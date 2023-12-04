import 'reflect-metadata';
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { container } from '../../../../config/inversify.config';
import { PedidosServices } from '../../../../app/business/services/MAP/PedidosServices';

const pedidosService = container.get<PedidosServices>(PedidosServices)

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);


describe('PedidosServices', () => {
    describe('createOrdenComplete', () => {
        it('should create a complete order with its details', async () => {
            const orden:any = {};
            const listDetalleOrdenes:any[] = [ {
                "producto_bodega_id": 1,
                "cantidad_necesaria": 6
            },
            {
                "producto_bodega_id": 3,
                "cantidad_necesaria": 10
            }];

            const result = await pedidosService.createOrdenComplete(orden, listDetalleOrdenes);

            expect(result).toHaveProperty('order');
            expect(result).toHaveProperty('order details');
        });

    });

    describe('getOrderCompleteInfo', () => {
        it('should retrieve complete information for an order', async () => {
            const orderId = 1; // Un ID de orden existente
    
            const result = await pedidosService.getOrderCompleteInfo(orderId);
    
            expect(result).toHaveProperty('order');
            expect(result).toHaveProperty('orderDetails');
        });
    
    });
    
    describe('updateDetalleOrden', () => {
        it('should update a specific order detail', async () => {
            const detalleOrdenId = 2; // Suponiendo que este ID existe
            const updatedData = {
                "cantidad_necesaria": 6.2
            };
    
            const result = await pedidosService.updateDetalleOrden(detalleOrdenId, updatedData);
    
            expect(result).toHaveProperty('cantidad_necesaria',6.2); // Verifica que se haya afectado al menos una fila
        });
    
    });

    describe('createDetalleOrden', () => {
        it('should create a new order detail', async () => {
            const detalleOrden:any = {
                "producto_bodega_id": 7,
                "cantidad_necesaria": 6.2,
                "orden_id": 1
            };

            const result = await pedidosService.createDetalleOrden(detalleOrden);

            expect(result).toHaveProperty('detalle_orden_id');
        });

    });

    describe('deleteDetalleOrden', () => {
        it('should delete a specific order detail', async () => {
            const detalleOrdenId = 45; // Suponiendo que este ID existe
    
            const result = await pedidosService.deleteDetalleOrden(detalleOrdenId);
    
            expect(result).toBeTruthy();
        });
    
    });

    describe('changeOrderStatus', () => {


        it('should allow valid status transition from "En espera" to "Aprobado"', async () => {
            const orderId = 1; // Suponiendo que este ID existe y su estado actual es 'En espera'
            const newStatus = 'Aprobado';

            const result = await pedidosService.changeOrderStatus(orderId, newStatus);

            expect(result).toBeGreaterThan(0); // Suponiendo que se actualiza al menos una fila.
        });

        it('should allow valid status transition from "Aprobado" to "Enviado"', async () => {
            const orderId = 1; // Suponiendo que este ID existe y su estado actual es 'Aprobado'
            const newStatus = 'Enviado';

            const result = await pedidosService.changeOrderStatus(orderId, newStatus);

            expect(result).toBeGreaterThan(0);
        });

        it('should not allow invalid status transition from "Recibido" to "Enviado"', async () => {
            const orderId = 3; // Suponiendo que este ID existe y su estado actual es 'Recibido'
            const newStatus = 'Enviado';

            await expect(pedidosService.changeOrderStatus(orderId, newStatus)).rejects.toThrow(Error);
        });

        it('should throw an error if the order does not exist', async () => {
            const invalidOrderId = 9999; // Un ID que no existe
            const newStatus = 'Aprobado';

            await expect(pedidosService.changeOrderStatus(invalidOrderId, newStatus)).rejects.toThrow(Error);
        });

        // Más pruebas para otros casos de transición válidos e inválidos
    });

    describe('finalizeOrder', () => {
        it('should finalize an order by changing its status and updating stock', async () => {
            const orderId = 1; // Suponiendo que este ID existe
    
            await expect(pedidosService.finalizeOrder(orderId)).resolves.not.toThrow();
        });
    
    });
    
    
    
    
});
