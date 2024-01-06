import 'reflect-metadata';
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { container } from '../../../../config/inversify.config';
import { IngredientesServices } from '../../../../app/business/services/MGPAAB/IngredientesServices';

const ingredientesService = container.get<IngredientesServices>(IngredientesServices)

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);


describe('IngredientesServices', () => {
    describe('addLote', () => {
        it('should add a new lote', async () => {
            const lote:any = {
                "producto_bodega_id": 4,
                "fecha_vencimiento": "2024-12-4",
                "cantidad": 1
            };

            const result = await ingredientesService.addLote(lote);

            expect(result).toHaveProperty('fecha_ingreso');
        });

        it('should throw an error that the date is less than the current date.', async () => {
            const lote:any = {
                "producto_bodega_id": 4,
                "fecha_vencimiento": "2021-12-4",
                "cantidad": 1
            };

            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
            await ingredientesService.addLote(lote);


            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain("The expiration date is less than or equal to the current date");
        });

    });

    describe('getExpiredLotes', () => {
        it('should retrieve all expired lotes', async () => {
    
            const result = await ingredientesService.getExpiredLotes();
    
            expect(Array.isArray(result)).toBeTruthy();
        });
    
    });

    describe('getLotestoExpire', () => {
        it('should retrieve lotes that are about to expire', async () => {
    
            const result = await ingredientesService.getLotestoExpire();
    
            expect(Array.isArray(result)).toBeTruthy();
        });
    
    });

    // describe('getProductsNearOrBelowMinimum', () => {
    //     it('should retrieve products near or below their minimum stock level', async () => {
    
    //         const result = await ingredientesService.getProductsNearOrBelowMinimum();
    
    //         expect(Array.isArray(result)).toBeTruthy();
    //     });
    
    // });
    
    describe('getProductsNearOrAboveMaximum', () => {
        it('should retrieve products near or above their maximum stock level', async () => {
    
            const result = await ingredientesService.getProductsNearOrAboveMaximum();
    
            expect(Array.isArray(result)).toBeTruthy();
        });
    
    });

    describe('searchProductsBodegaByAttribute', () => {
        it('should retrieve products based on a specific attribute', async () => {
            const attributeName = 'tipo'; // o cualquier otro atributo relevante
            const searchValue = 'bebi';
    
            const result = await ingredientesService.searchProductsBodegaByAttribute(attributeName, searchValue);
    
            expect(Array.isArray(result)).toBeTruthy();
        });

        it('should retrieve products based on a supplier attribute', async () => {
            const attributeName = 'Proveedor'; // o cualquier otro atributo relevante
            const searchValue = 'pro';
    
            const result = await ingredientesService.searchProductsBodegaByAttribute(attributeName, searchValue);
    
            expect(Array.isArray(result)).toBeTruthy();
        });

        it('should retrieve products based on expired_date attribute', async () => {
            const attributeName = 'fecha_vencimiento'; // o cualquier otro atributo relevante
            const searchValue = '2024-01-01';
    
            const result = await ingredientesService.searchProductsBodegaByAttribute(attributeName, searchValue);
    
            expect(Array.isArray(result)).toBeTruthy();
        });
    
    });

    describe('getProductosBodegaWithLotes', () => {
        it('should retrieve products with their lots and weight information', async () => {
            // Llamamos al método directamente
            const result = await ingredientesService.getProductosBodegaWithLotes();

            // Realizamos aserciones sobre el resultado
            expect(Array.isArray(result)).toBeTruthy();
            // Aquí podrías agregar más aserciones para verificar la estructura de los datos
            // Por ejemplo, si sabes que siempre debe haber al menos un producto, podrías hacer:
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('prodbodega');
            expect(result[0].prodbodega).toHaveProperty('lotes');
            // Y otras aserciones según los datos específicos y la estructura que esperas
        });
    });
    
    
    
    
});
