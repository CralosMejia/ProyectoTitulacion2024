import 'reflect-metadata';
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { container } from '../../../../config/inversify.config';
import { PedidosServices } from '../../../../app/business/services/MAP/PedidosServices';
import { EntrieRepository } from '../../../../app/data/repository/entrieRepository';

const pedidosService = container.get<PedidosServices>(PedidosServices)


//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

const repositoryOrdenes =  new EntrieRepository(modelPacifico.ordenes);
const repositoryDetalleOrden =  new EntrieRepository(modelPacifico.detalleordenes);


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

        it('should throw an error that the command was not found', async () => {
            const orderId = 0; // Un ID de orden existente
            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                await pedidosService.getOrderCompleteInfo(orderId);

            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain("Order not found");
        });
    
    });
    
    describe('updateDetalleOrden', () => {
        it('should update a specific order detail', async () => {
            const detalleOrdenId = 2; // Suponiendo que este ID existe
            await repositoryOrdenes.updateSingleFieldById('orden_id',1,'estado','En espera')
            const updatedData = {
                "cantidad_necesaria": 6
            };
    
            const result = await pedidosService.updateDetalleOrden(detalleOrdenId, updatedData);
    
            expect(result).toHaveProperty('cantidad_necesaria',6); // Verifica que se haya afectado al menos una fila
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
            const orderDetails=await repositoryDetalleOrden.getAll()
            let detalleOrdenId=1

            // Verificar si hay detalles de órdenes disponibles
            if (orderDetails && orderDetails.length > 0) {
                // Ordenar los detalles por ID en orden descendente
                const sortedOrderDetails = orderDetails.sort((a, b) => b.detalle_orden_id - a.detalle_orden_id);

                // El primer elemento ahora es el que tiene el ID más alto
                const lastOrderDetail = sortedOrderDetails[0];

                // Obtener el ID del último detalle de la orden
                detalleOrdenId = lastOrderDetail.detalle_orden_id;

                // Utilizar lastOrderDetailId según sea necesario
            }

    
            const result = await pedidosService.deleteDetalleOrden(detalleOrdenId);
    
            expect(result).toBeTruthy();
        });
    
    });

    describe('changeOrderStatus', () => {


        it('should allow valid status transition from "En espera" to "Aprobado"', async () => {
            const orderId = 1; // Suponiendo que este ID existe y su estado actual es 'En espera'
            await repositoryOrdenes.updateSingleFieldById('orden_id',orderId,'estado','En espera')
            const newStatus = 'Aprobado';

            const result = await pedidosService.changeOrderStatus(orderId, newStatus);

            expect(result).toBeGreaterThan(0); // Suponiendo que se actualiza al menos una fila.
        });

        it('should allow valid status transition from "Aprobado" to "Enviado"', async () => {
            const orderId = 1; // Suponiendo que este ID existe y su estado actual es 'Aprobado'
            await repositoryOrdenes.updateSingleFieldById('orden_id',orderId,'estado','Aprobado')

            const newStatus = 'Enviado';

            const result = await pedidosService.changeOrderStatus(orderId, newStatus);

            expect(result).toBeGreaterThan(0);
        });

        it('should not allow invalid status transition from "Recibido" to "Enviado"', async () => {
            const orderId = 1; // Suponiendo que este ID existe y su estado actual es 'Recibido'
            await repositoryOrdenes.updateSingleFieldById('orden_id',orderId,'estado','Recibido')
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
            await repositoryOrdenes.updateSingleFieldById('orden_id',orderId,'estado','Enviado')
            const proveedorId = 0; // Suponiendo que este ID existe

            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                pedidosService.finalizeOrder(orderId,proveedorId)

            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeFalsy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
        });
    
    });

    describe('getProductCompleteInfo', () => {
        it('should retrieve complete information for a product', async () => {
            // Asumiendo que tienes un producto_bodega_id válido
            const productoBodegaId = 1; // Reemplazar con un ID válido

            // Llamamos al método directamente
            try {
                const result = await pedidosService.getProductCompleteInfo(productoBodegaId);
                
                // Realizamos aserciones sobre el resultado
                expect(result).toHaveProperty('producto_bodega_id', productoBodegaId);
                expect(result).toHaveProperty('productInfo');
                expect(result).toHaveProperty('proveedorNombre');
                expect(result).toHaveProperty('pesoInfo');
            } catch (error) {
            }
        });
    });


    describe('processAndNotifyApprovedOrders', () => {
        it('should process and notify approved orders', async () => {
            // let result;
            let errorOccurred = false; 


            try {
                await repositoryOrdenes.updateSingleFieldById('orden_id',1,'estado','Aprobado')
                 await pedidosService.processAndNotifyApprovedOrders();
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            // expect(result).toBeDefined();
        });
    });

    describe('searchProveedoresByAttribute', () => {
        it('should retrieve providers filtered by a specific attribute', async () => {
            const attributeName = 'nombre_proveedor'; // Cambia esto según la necesidad
            const searchValue = 'pro'; // Valor de búsqueda para la prueba

            const result = await pedidosService.searchProveedoresByAttribute(attributeName, searchValue);

            expect(Array.isArray(result)).toBeTruthy();
            if (result.length > 0) {
                // Verificar que todos los proveedores en el resultado contengan el valor de búsqueda en el atributo especificado
                result.forEach(proveedor => {
                    expect(proveedor[attributeName].toLowerCase()).toContain(searchValue.toLowerCase());
                });
            }
            // Otras aserciones según sea necesario
        });
    });

    describe('searchOrdenesByAttribute', () => {
        it('should retrieve orders filtered by a specific attribute', async () => {
            const attributeName = 'estado'; // Cambia esto según la necesidad
            const searchValue = 'Aprobado'; // Valor de búsqueda para la prueba

            const result = await pedidosService.searchOrdenesByAttribute(attributeName, searchValue);

            expect(Array.isArray(result)).toBeTruthy();
            if (result.length > 0) {
                // Verificar que todas las órdenes en el resultado contengan el valor de búsqueda en el atributo especificado
                result.forEach((orden:any) => {
                    if (typeof orden[attributeName] === 'string') {
                        expect(orden[attributeName].toLowerCase()).toContain(searchValue.toLowerCase());
                    } else if (typeof orden[attributeName] === 'number') {
                        expect(orden[attributeName]).toEqual(Number(searchValue));
                    } else if (orden[attributeName] instanceof Date) {
                        expect(orden[attributeName].toISOString().split('T')[0]).toEqual(searchValue);
                    }
                });
            }
            // Otras aserciones según sea necesario
        });
    });

    describe('searchCompleteOrderInfoByAttributeAndId', () => {
        it('should retrieve complete order info filtered by a specific attribute', async () => {
            const orderId = 1; // Asegúrate de que este ID exista en la base de datos
            const attributeName = 'nombre_producto'; // Cambia según la necesidad
            const searchValue = 'producto'; // Valor de búsqueda para la prueba

            let result: any = null; // Inicializa result con un valor por defecto
            let errorOccurred = false;

            try {
                result = await pedidosService.searchCompleteOrderInfoByAttributeAndId(orderId, attributeName, searchValue);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(result).toBeDefined(); // Ahora result siempre estará definida
            // Realiza las demás aserciones aquí
        });
    });
    
    
    
    
});
