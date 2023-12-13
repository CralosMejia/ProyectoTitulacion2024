import { injectable } from "inversify";
import { OrderStatus } from "../../../data/models/AuxModels/OrderStatus";
import { detalleordenes } from "../../../data/models/RestaurantePacificoDB/detalleordenes";
import { ordenes } from "../../../data/models/RestaurantePacificoDB/ordenes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { ValidatorPedidosServices } from "../../validators/MAP/validatorPedidosServices";
import { proveedor } from "../../../data/models/RestaurantePacificoDB/proveedor";
import { peso } from "../../../data/models/RestaurantePacificoDB/peso";

/**
 * Service class for managing orders and order details in a restaurant.
 */
@injectable()
export class PedidosServices{

    private readonly repositoryOrdenes: EntrieRepository<ordenes>;
    private readonly repositoryDetalleOrden: EntrieRepository<detalleordenes>;
    private readonly repositoryProductosBodega: EntrieRepository<productosbodega>;
    private readonly repositoryProveedor: EntrieRepository<proveedor>;
    private readonly repositoryPeso: EntrieRepository<peso>;

    private readonly validator:ValidatorPedidosServices;



    constructor(){
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
    
            if (listDetalleOrdenes && listDetalleOrdenes.length > 0) {
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
    
            // Create the order
            const createdOrden = await this.repositoryOrdenes.create(orden);
    
            // Create order details
            let detallesResult = null;
            if (listDetalleOrdenes && listDetalleOrdenes.length > 0) {
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
            console.error('Error while creating the order and its details:', error);
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
                    if (product === null){
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
            console.error('Error retrieving complete order info:', error);
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
    
            return await this.repositoryDetalleOrden.create(detalleOrden);
        } catch (error) {
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
    
            // Retorna el número de filas afectadas
            return await this.repositoryOrdenes.updateSingleFieldById('orden_id', orderId, 'estado', newStatus);
        } catch (error) {
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
    async finalizeOrder(orderId: number): Promise<void> {
        try {
            const newStatus: OrderStatus = 'Recibido';
            const affectedRows = await this.changeOrderStatus(orderId, newStatus);
    
            if (affectedRows === 0) {
                throw new Error(`No order was updated for order ID ${orderId}.`);
            }
    
            const orderDetails = await this.repositoryDetalleOrden.getAllByField('orden_id', orderId);
    
            for (const detail of orderDetails) {
                const producto = await this.repositoryProductosBodega.getById(detail.producto_bodega_id);
    
                if (producto && detail.cantidad_necesaria !== undefined &&  producto.cantidad_actual !== undefined) {
                    const newCantidadActual = Number(producto.cantidad_actual) + Number(detail.cantidad_necesaria);
                    await this.repositoryProductosBodega.updateSingleFieldById('producto_bodega_id', producto.producto_bodega_id, 'cantidad_actual', newCantidadActual);
                }
            }
        } catch (error) {
            await this.repositoryOrdenes.updateSingleFieldById('orden_id', orderId, 'estado', 'Enviado');
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
            console.error('Error retrieving complete product info:', error);
            throw error;
        }
    }
    
    
    
}