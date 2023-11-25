import { detalleordenes } from "../../../data/models/RestaurantePacificoDB/detalleordenes";
import { ordenes } from "../../../data/models/RestaurantePacificoDB/ordenes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";

export class PedidosServices{

    private readonly repositoryOrdenes: EntrieRepository<ordenes>;
    private readonly repositoryDetalleOrden: EntrieRepository<detalleordenes>;
    private readonly repositoryProductosBodega: EntrieRepository<productosbodega>;



    constructor(){
        this.repositoryOrdenes =  new EntrieRepository(ordenes);
        this.repositoryDetalleOrden =  new EntrieRepository(detalleordenes);
        this.repositoryProductosBodega =  new EntrieRepository(productosbodega);
    }

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
    
                // Update the order with the calculated subtotal
                orden.subtotal = subtotalOrden;
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
                    return {
                        ...detail,
                        productInfo: product
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
    
    
    

    
}