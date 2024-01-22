import { inject, injectable } from "inversify";
import { OrderStatus } from "../../../data/models/AuxModels/OrderStatus";
import { detalleordenes } from "../../../data/models/RestaurantePacificoDB/detalleordenes";
import { ordenes } from "../../../data/models/RestaurantePacificoDB/ordenes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { ValidatorPedidosServices } from "../../validators/MAP/validatorPedidosServices";
import { proveedor } from "../../../data/models/RestaurantePacificoDB/proveedor";
import { peso } from "../../../data/models/RestaurantePacificoDB/peso";
import { Observable } from "../common/Observable";
import { IngredientesServices } from "../MGPAAB/IngredientesServices";
import { LoggerService } from "../common/logs/LogsAPP";
import { addDays } from "date-fns";

/**
 * Service class for managing orders and order details in a restaurant.
 */
@injectable()
export class PedidosServices extends Observable{

    private readonly repositoryOrdenes: EntrieRepository<ordenes>;
    private readonly repositoryDetalleOrden: EntrieRepository<detalleordenes>;
    private readonly repositoryProductosBodega: EntrieRepository<productosbodega>;
    private readonly repositoryProveedor: EntrieRepository<proveedor>;
    private readonly repositoryPeso: EntrieRepository<peso>;
    private readonly validator:ValidatorPedidosServices;



    constructor(
        @inject(IngredientesServices) private ingredietesServices: IngredientesServices,
        @inject(LoggerService) private log: LoggerService,

        ){
        super()
        this.repositoryOrdenes =  new EntrieRepository(ordenes);
        this.repositoryDetalleOrden =  new EntrieRepository(detalleordenes);
        this.repositoryProductosBodega =  new EntrieRepository(productosbodega);
        this.repositoryPeso =  new EntrieRepository(peso);
        this.repositoryProveedor =  new EntrieRepository(proveedor);
        this.validator= new ValidatorPedidosServices();
    }

    /**
     * Creates a complete order with its details.
     * Calculates the total order value and sets the order date.
     * 
     * @param orden - The order object to be created.
     * @param listDetalleOrdenes - An array of order detail objects.
     * @returns An object containing the created order and its details.
     */
    async createOrdenComplete(orden: ordenes, listDetalleOrdenes: detalleordenes[] | null) {
        try {
            let subtotalOrden = 0;
            const diasASumar =Number(process.env.DAYSMAXTORECIVEORDER) || 0


            if(listDetalleOrdenes=== null || listDetalleOrdenes === undefined){
                throw new Error('Order details are null orn undefined')
            }
    
            if ( listDetalleOrdenes.length > 0) {
                // Calculate the subtotal based on order details
                for (const detalle of listDetalleOrdenes) {
                    const prodBode = await this.repositoryProductosBodega.getById(detalle.producto_bodega_id);
                    if (prodBode && prodBode.precio_proveedor && detalle.cantidad_necesaria) {
                        subtotalOrden += prodBode.precio_proveedor * detalle.cantidad_necesaria;
                    }
                }
                orden.total = subtotalOrden; // Add additional logic here if needed to calculate the total
            }
    
            // Set the order date to the current date
            orden.fecha_orden = new Date().toISOString().split('T')[0];
            const dateMaxToRecive=new Date(new Date(orden.fecha_orden ).setDate(new Date(orden.fecha_orden ).getDate() + diasASumar)).toISOString().split('T')[0];

            orden.fecha_estimada_recepcion=dateMaxToRecive
    
            // Create the order
            const createdOrden = await this.repositoryOrdenes.create(orden);
    
            // Create order details
            let detallesResult = null;
            if ( listDetalleOrdenes.length > 0) {
                const updatedDetalleOrdenes = listDetalleOrdenes.map(detalle => {
                    return { ...detalle, orden_id: createdOrden.orden_id };
                });
                detallesResult = await this.repositoryDetalleOrden.bulkCreate(updatedDetalleOrdenes);
            }
    
            return {
                "order": createdOrden,
                "order details": detallesResult
            };
        } catch (error) {
            const errorMessage=`Error while creating the order and its details: ${error}` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    
    /**
     * Retrieves complete information for an order, including its details and associated products.
     * 
     * @param orderId - The ID of the order to retrieve.
     * @returns An object containing the order and detailed product information.
     */
    async getOrderCompleteInfo(orderId: number) {
        try {
            // Retrieve the order
            const order = await this.repositoryOrdenes.getById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
    
            // Retrieve the order details
            const orderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', orderId);
    
            // Retrieve the products for each order detail
            const productsInfo = await Promise.all(
                orderDetails.map(async (detail) => {
                    const product = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
                    if (product === null || product ===undefined){
                        throw new Error('Product not found');
                    }
                    const proveedor = await this.repositoryProveedor.getById(product.proveedor_id);
                    const peso = await this.repositoryPeso.getById(product.peso_proveedor_id);
    
                    return {
                        ...detail,
                        productInfo: product,
                        proveedorNombre: proveedor ? proveedor.nombre_proveedor : '',
                        pesoInfo: {
                            unidad: peso ? peso.unidad : '',
                            simbolo: peso ? peso.simbolo : '',
                            tipo: peso ? peso.tipo : ''
                        }
                    };
                })
            );
    
            return {
                order: order,
                orderDetails: productsInfo
            };
        } catch (error) {
            const errorMessage=`Error retrieving complete order info: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    

    /**
     * Updates a specific order detail.
     * Validates the order status before updating.
     * 
     * @param detalleOrdenId - The ID of the order detail to update.
     * @param updatedData - The new data for the order detail.
     * @returns The number of affected rows in the database.
     */
    async updateDetalleOrden(detalleOrdenId: number, updatedData: Partial<detalleordenes>){
        try {
            const detalleOrden = await this.repositoryDetalleOrden.getById(detalleOrdenId);
            if (!detalleOrden) {
                throw new Error(`Order detail with ID ${detalleOrdenId} not found.`);
            }
    
            // Validar el estado de la orden antes de actualizar
            await this.validator.validateManageDeatelleOrden(detalleOrden.orden_id);
    
            return await this.repositoryDetalleOrden.update(detalleOrdenId, updatedData);
        } catch (error) {
            const errorMessage=`Error while updating order detail: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    

     /**
     * Creates a new order detail.
     * Validates the order status before creation.
     * 
     * @param detalleOrden - The order detail object to be created.
     * @returns The created order detail object.
     */
    async createDetalleOrden(detalleOrden: detalleordenes): Promise<detalleordenes> {
        try {
            // Validar el estado de la orden antes de crear el detalle
            await this.validator.validateManageDeatelleOrden(detalleOrden.orden_id);
    
            // Buscar si existe un detalle de orden con el mismo producto y orden
            const existingDetail = await this.repositoryDetalleOrden.getAllByFieldMultipleCriteria({
                orden_id: detalleOrden.orden_id,
                producto_bodega_id: detalleOrden.producto_bodega_id
            });
    
            if (existingDetail && existingDetail.length > 0  && detalleOrden.cantidad_necesaria !== undefined) {
                // Si existe, actualizar la cantidad
                const updatedCantidad = Number(existingDetail[0].cantidad_necesaria) + detalleOrden.cantidad_necesaria ;
                await this.repositoryDetalleOrden.update(existingDetail[0].detalle_orden_id, { cantidad_necesaria: updatedCantidad });
                return existingDetail[0];
            } else {
                // Si no existe, crear un nuevo detalle de orden
                return await this.repositoryDetalleOrden.create(detalleOrden);
            }
        } catch (error) {
            const errorMessage=`Error while creating order detail: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    
    /**
     * Deletes a specific order detail.
     * Validates the order status before deletion.
     * 
     * @param detalleOrdenId - The ID of the order detail to delete.
     * @returns True if the deletion was successful, otherwise false.
     */
    async deleteDetalleOrden(detalleOrdenId: number): Promise<boolean> {
        try {
            const detalleOrden = await this.repositoryDetalleOrden.getById(detalleOrdenId);
            if (!detalleOrden) {
                throw new Error(`Order detail with ID ${detalleOrdenId} not found.`);
            }
    
            // Validar el estado de la orden antes de eliminar el detalle
            await this.validator.validateManageDeatelleOrden(detalleOrden.orden_id);
    
            return await this.repositoryDetalleOrden.delete(detalleOrdenId);
        } catch (error) {
            const errorMessage=`Error while deleting order detail: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }

    /**
     * Changes the status of an order.
     * Validates the status transition before updating.
     * 
     * @param orderId - The ID of the order to update.
     * @param newStatus - The new status for the order.
     * @returns The number of affected rows in the database.
     */
    async changeOrderStatus(orderId: number, newStatus: OrderStatus): Promise<number> {
        try {
            const order = await this.repositoryOrdenes.getById(orderId);
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found.`);
            }
            
            this.validator.validateStatusTransition(order.estado as OrderStatus, newStatus);

            if(newStatus === 'Enviado'){
                this.processAndNotifyApprovedOrders(orderId)
                return 1
            }
    
    
            // Retorna el número de filas afectadas
            return await this.repositoryOrdenes.updateSingleFieldById('orden_id', orderId, 'estado', newStatus);
        } catch (error) {
            const errorMessage=`Error while changing order status: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }

    /**
     * Finalizes an order by changing its status to 'Received'.
     * Updates the stock of products based on the order details.
     * Reverts the order status to 'Sent' in case of any error.
     * 
     * @param orderId - The ID of the order to finalize.
     */
    async finalizeOrder(orderId: number,expiredDate:Date, proveedorId: number=0,detalleOrdenId: number = 0): Promise<void> {
        try {
            let orderDetails = [];
            const order= await this.repositoryOrdenes.getById(orderId)
            if(order===null){
                const errorMessage=`Error finalizing the order, order: ${orderId} does not exist.`
                this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
                throw new Error(errorMessage)
            }
            if(order.estado === 'En espera' || order.estado === 'Cancelado' || order.estado === 'Aprobado' || order.estado === 'Recibido'){
                const errorMessage=`Error finalizing the order, you cannot change the status of the order directly .`
                this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
                throw new Error(errorMessage)
            }
            if (detalleOrdenId !== 0) {
                const detail = await this.repositoryDetalleOrden.getById(detalleOrdenId);
                if (detail && detail.orden_id === orderId) {
                    orderDetails.push(detail);
                }
            } else if (proveedorId !== 0) {
                const orderDetailsComplete = await this.repositoryDetalleOrden.getAllByField('orden_id', orderId);
                for (const detail of orderDetailsComplete) {
                    const producto = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
                    if (!producto) continue;
        
                    // Actualizar los detalles de la orden según el proveedorId
                    if (proveedorId === 0 || producto.proveedor_id === proveedorId) {
                        orderDetails.push(detail)
                    }
                }
            } else {
                orderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', orderId);
            }

            for (const detail of orderDetails) {
                const producto = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
                if (!producto) continue;

                // const newCantidadActual = Number(producto.cantidad_actual) + Number(detail.cantidad_necesaria);
                const newLote: any = {
                    "producto_bodega_id": detail.producto_bodega_id,
                    "fecha_vencimiento": expiredDate,
                    "cantidad": detail.cantidad_necesaria
                };
                this.ingredietesServices.addLote(newLote);
                const dateSpecific = new Date()

                await this.repositoryDetalleOrden.updateSingleFieldById('detalle_orden_id', detail.detalle_orden_id, 'estado', 'Recibido');
                await this.repositoryDetalleOrden.updateSingleFieldById('detalle_orden_id', detail.detalle_orden_id, 'fecha_recepcion', dateSpecific);
            }

            const updatedOrderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', orderId);
            const allDetailsReceived = updatedOrderDetails.every(detail => detail.estado === 'Recibido');

            if (allDetailsReceived) {
                await this.repositoryOrdenes.updateSingleFieldById('orden_id', orderId, 'estado', 'Recibido');
            }
        } catch (error) {
            const errorMessage=`Error finalizing the order: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    
    
    
    /**
     * Retrieves complete information about a specific product in the warehouse.
     * 
     * @param productoBodegaId - The ID of the product to retrieve information for.
     * @returns An object containing detailed information about the product, its supplier, and weight details.
     */
    async getProductCompleteInfo(productoBodegaId: number) {
        try {
            // Obtener la información del producto de bodega
            const product = await this.repositoryProductosBodega.getById(productoBodegaId);
            if (!product) {
                throw new Error('Product not found');
            }
    
            // Obtener la información del proveedor asociado con el producto
            const proveedor = await this.repositoryProveedor.getById(product.proveedor_id);
            if (!proveedor) {
                throw new Error('Supplier not found');
            }
    
            // Obtener la información del peso asociado con el producto
            const peso = await this.repositoryPeso.getById(product.peso_proveedor_id);
            if (!peso) {
                throw new Error('Weight information not found');
            }
    
            // Construir y retornar la respuesta
            return {
                producto_bodega_id: product.producto_bodega_id,
                cantidad_necesaria: null, // este valor puede ser ajustado según sea necesario
                productInfo: product,
                proveedorNombre: proveedor.nombre_proveedor,
                pesoInfo: {
                    unidad: peso.unidad,
                    simbolo: peso.simbolo,
                    tipo: peso.tipo
                }
            };
        } catch (error) {
            const errorMessage=`Error retrieving complete product info: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    async processAndNotifyApprovedOrders(id:number=0) {
        try {
            // Obtener todas las órdenes con estado 'Aprobado'
            let approvedOrders = await this.repositoryOrdenes.getAllByField('estado', 'Aprobado');

            if(id!=0){
                approvedOrders=approvedOrders.filter((order:any)=>order.orden_id === id)
            }
    
            // Crear un objeto para agrupar los detalles de las órdenes por proveedor
            const ordersBySupplier: Record<number, any[]> = {};
    
            // Cambiar el estado y agrupar detalles por proveedor
            for (const order of approvedOrders) {
                await this.repositoryOrdenes.updateSingleFieldById('orden_id', order.orden_id, 'estado', 'Enviado');
                
                // Obtener los detalles de la orden
                const orderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', order.orden_id);
    
                for (const detail of orderDetails) {
                    // Obtener información del producto
                    const product = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
                    if (!product) continue;
                    const peso = await this.repositoryPeso.getById(product.peso_proveedor_id); // Obtener el peso

    
                    const supplierId = product.proveedor_id;
                    if (!ordersBySupplier[supplierId]) {
                        ordersBySupplier[supplierId] = [];
                    }
    
                    const supplierInfo = await this.repositoryProveedor.getById(supplierId);
                    ordersBySupplier[supplierId].push({
                        ...detail,
                        productInfo: product,
                        supplierInfo: supplierInfo,
                         pesoInfo: peso,
                         date:order.fecha_estimada_recepcion
                    });
                }
            }
            if(approvedOrders.length !==0) this.notify({
                type:'notify',
                ordersBySupplier
            });

    
            return `${approvedOrders.length} orders have been processed and reported.`;
        } catch (error) {
            const errorMessage=`Error when processing and notifying orders: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }


     /**
     * Retorna los detalles de las órdenes que no han sido recibidos y están a 4 días o menos
     * de su fecha estimada de recepción.
     */
     async getPendingOrderDetailsNearReception() {
        try {
            const days =Number(process.env.NOTIFYDAYSMAXTORECIVEORDER) || 0
            const currentDate = new Date();
            const thresholdDate = addDays(currentDate, days).toISOString().split('T')[0];

            // Obtener todas las órdenes con fecha_estimada_recepcion dentro del rango y estado 'Por recibir'
            const orders = await this.repositoryOrdenes.getAll();
            const filteredOrders = orders.filter(order => 
                order.fecha_estimada_recepcion <= thresholdDate && order.estado === 'Enviado'
            );

            // Obtener los detalles de las órdenes filtradas
            const detailedOrders = await Promise.all(filteredOrders.map(async (order) => {
                const orderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', order.orden_id);
                const pendingDetails = orderDetails.filter(detail => detail.estado === 'Por recibir');

                const detailedProducts = await Promise.all(pendingDetails.map(async (detail) => {
                    const product = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
                    const proveedor = product ? await this.repositoryProveedor.getById(product.proveedor_id) : null;
                    const peso = product ? await this.repositoryPeso.getById(product.peso_proveedor_id) : null;
                    return {
                        ...detail,
                        nombreProducto: product ? product.nombre_producto : 'Producto desconocido',
                        nombreProveedor: proveedor ? proveedor.nombre_proveedor : 'Proveedor desconocido',
                        unidadPeso: peso ? peso.unidad : ''

                    };
                }));

                return {
                    orden_id: order.orden_id,
                    fecha_orden:order.fecha_orden,
                    fecha_estimada:order.fecha_estimada_recepcion,
                    total:order.total,
                    detallesPendientes: detailedProducts
                };
            }));


            if(detailedOrders.length !==0) this.notify({
                type:'NotRecived',
                detailedOrders
            });
            return detailedOrders;
        } catch (error) {
            console.error('Error al obtener detalles de órdenes pendientes:', error);
            throw error;
        }
    }
    
    async searchProveedoresByAttribute(attributeName: keyof proveedor, searchValue: string) {
        // Obtener todos los proveedores
        const allProveedores = await this.repositoryProveedor.getAll();
    
        // Filtrar proveedores basándose en el atributo y valor de búsqueda
        const filteredProveedores = allProveedores.filter(proveedor => {
            const attributeValue = proveedor[attributeName];
            if (typeof attributeValue === 'string') {
                return attributeValue.toLowerCase().includes(searchValue.toLowerCase());
            }
            return false;
        });
    
        // Construir la información detallada de los proveedores filtrados
        const detailedProveedores = filteredProveedores.map(proveedor => ({
            proveedor_id: proveedor.proveedor_id,
            nombre_proveedor: proveedor.nombre_proveedor,
            email: proveedor.email,
            telefono: proveedor.telefono,
            nivel: proveedor.nivel,
            estado: proveedor.estado
        }));
    
        return detailedProveedores;
    }

    async searchOrdenesByAttribute(attributeName: keyof ordenes, searchValue: string) {
        // Obtener todas las órdenes
        const allOrdenes = await this.repositoryOrdenes.getAll();
    
        // Filtrar órdenes basándose en el atributo y valor de búsqueda
        const filteredOrdenes = allOrdenes.filter(orden => {
            const attributeValue = orden[attributeName];
            if (typeof attributeValue === 'string') {
                return attributeValue.toLowerCase().includes(searchValue.toLowerCase());
            } else if (typeof attributeValue === 'number') {
                return attributeValue === Number(searchValue);
            } else if (attributeValue instanceof Date) {
                // Para fechas, puedes comparar como prefieras, por ejemplo:
                return attributeValue.toISOString().split('T')[0] === searchValue;
            }
            return false;
        });
    
        // Construir la información detallada de las órdenes filtradas
        const detailedOrdenes = filteredOrdenes.map(orden => ({
            orden_id: orden.orden_id,
            fecha_orden: orden.fecha_orden,
            estado: orden.estado,
            modo_creacion: orden.modo_creacion,
            total: orden.total
            // Puedes agregar más campos aquí si es necesario
        }));
    
        return detailedOrdenes;
    }

    async searchCompleteOrderInfoByAttributeAndId(orderId: number, attributeName: keyof productosbodega | keyof detalleordenes | keyof peso | keyof proveedor, searchValue: string) {
        // Obtener la orden específica por ID
        const order = await this.repositoryOrdenes.getById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
    
        // Obtener los detalles de la orden
        const orderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', orderId);
    
        // Obtener la información completa de cada detalle de la orden
        const detailedOrderInfo = await Promise.all(orderDetails.map(async (detail) => {
            const product = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
            if(product === null) throw new Error('Detail is null')

            const proveedor = await this.repositoryProveedor.getById(product.proveedor_id);
            const peso = await this.repositoryPeso.getById(product.peso_proveedor_id);
    
            return {
                ...detail,
                productInfo: product,
                proveedorNombre: proveedor ? proveedor.nombre_proveedor : '',
                pesoInfo: {
                    unidad: peso ? peso.unidad : '',
                    simbolo: peso ? peso.simbolo : '',
                    tipo: peso ? peso.tipo : ''
                }
            };
        }));
    
        // Filtrar la información detallada de la orden basándose en el atributo y valor de búsqueda
        const filteredDetails = detailedOrderInfo.filter((detail:any )=> {
            switch (attributeName) {
                case 'nombre_producto':
                    return detail.productInfo.nombre_producto.toLowerCase().includes(searchValue.toLowerCase());
                case 'cantidad_necesaria':
                    return detail.cantidad_necesaria.toString().includes(searchValue);
                case 'unidad':
                    return detail.pesoInfo.unidad.toLowerCase().includes(searchValue.toLowerCase());
                case 'precio_proveedor':
                    return detail.productInfo.precio_proveedor.toString().includes(searchValue);
                case 'nombre_proveedor':
                    return detail.proveedorNombre.toLowerCase().includes(searchValue.toLowerCase());
                default:
                    return false;
            }
        });
    
        return {
            order: order,
            orderDetails: filteredDetails
        };
    }


    
    
    
    
    
}