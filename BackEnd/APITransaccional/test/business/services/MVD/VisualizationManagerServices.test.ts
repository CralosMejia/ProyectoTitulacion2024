import 'reflect-metadata';
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { container } from '../../../../config/inversify.config';
import { VisualizationManagerServices } from '../../../../app/business/services/MVD/VisualizationManagerServices';
import { EntrieRepository } from '../../../../app/data/repository/entrieRepository';

const visualizationManager = container.get<VisualizationManagerServices>(VisualizationManagerServices)

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

const repositoryFecha= new EntrieRepository(modelDataScience.dimfecha);

describe('VisualizationManagerServices', () => {
    describe('getDataPredictionDemandGraphic', () => {
        it('should retrieve demand prediction data for a given product within a date range', async () => {
            const fechaDesde = '2023-01-01';
            const fechaHasta = '2023-01-31';
            const productoId = 1; // Asegúrate de que este ID exista en tu base de datos de prueba


            const result = await visualizationManager.getDataPredictionDemandGraphic(fechaDesde, fechaHasta, productoId);

            expect(result).toHaveProperty('datasets');
            expect(result).toHaveProperty('labels');
            expect(result.datos.datasets.length).toBeGreaterThan(0);
        });

        it('should throw an error due to invalid date range', async () => {
            const fechaDesde = '2002-01-01';
            const fechaHasta = '2001-01-31';
            const productoId = 123; // Asegúrate de que este ID exista en tu base de datos de prueba


            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                await visualizationManager.getDataPredictionDemandGraphic(fechaDesde, fechaHasta, productoId);


            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain("The specified date range is invalid or has no data.");
        });

    });

    describe('getDataTrendSalesPlate', () => {
        it('should retrieve sales trend data for a specific dish within a date range', async () => {
            const fechaDesde = '2022-01-01';
            const fechaHasta = '2022-01-31';
            const platoId = 1; // Asegúrate de que este ID exista en tu base de datos de prueba
    
            const result = await visualizationManager.getDataTrendSalesPlate(fechaDesde, fechaHasta, platoId);
    
            expect(result).toHaveProperty('datasets');
            expect(result).toHaveProperty('labels');
            expect(result.datos.datasets.length).toBeGreaterThan(0);
        });

        it('should throw an error due to invalid date range', async () => {
            const fechaDesde = '2020-01-01';
            const fechaHasta = '2021-01-31';
            const platoId = 1; // Asegúrate de que este ID exista en tu base de datos de prueba


            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                await visualizationManager.getDataTrendSalesPlate(fechaDesde, fechaHasta, platoId);



            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain("The specified date range is invalid or has no data.");
        });

        it('should throw an error if the dish does not exist', async () => {
            const fechaDesde = '2022-01-01';
            const fechaHasta = '2022-01-31';
            const platoId = -1;


            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                await visualizationManager.getDataTrendSalesPlate(fechaDesde, fechaHasta, platoId);



            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain(`Plate with ID ${platoId} not found.`);
        });
    
    });

    describe('getInventoryDataProduct', () => {
        it('should retrieve inventory data for a specific product', async () => {
            const productoBodegaId = 1; // Asegúrate de que este ID exista en tu base de datos de prueba
    
            const result = await visualizationManager.getInventoryDataProduct(productoBodegaId);
    
            expect(result).toHaveProperty('labels');
            expect(result).toHaveProperty('datasets');
            expect(result.datos.datasets.length).toBeGreaterThan(0);
        });


        it('should throw an error if the product does not exist', async () => {
            const productoBodegaId = -1;


            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                await visualizationManager.getInventoryDataProduct(productoBodegaId);
            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain(`Product with ID ${productoBodegaId} not found.`);
        });
    
    });

    describe('getSummaryOrders', () => {
        it('should retrieve a summary of orders within a specific date range', async () => {
            const fechaDesde = '2023-12-30';
            const fechaHasta = '2024-01-03';
    
            const result = await visualizationManager.getSummaryOrders(fechaDesde, fechaHasta);
    
            expect(result).toHaveProperty('labels');
            expect(result).toHaveProperty('datasets');
            expect(result.datasets.length).toBeGreaterThan(0);
        });
    
    });
    
    describe('getOldestAndMostRecentDates', () => {
        it('should retrieve the oldest and most recent dates from the data', async () => {
            let result;
            let errorOccurred = false;

            try {
                result = await visualizationManager.getOldestAndMostRecentDates();
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(result).toBeDefined();
            expect(result?.oldestDate).toBeDefined();
            expect(result?.mostRecentDate).toBeDefined();
            // Aquí puedes añadir más aserciones específicas, como verificar que las fechas son correctas
        });

        it('should throw an error if no dates are available', async () => {
            // Este caso de prueba depende de que realmente no haya fechas en la base de datos.
            // Podrías necesitar configurar el estado de la base de datos para este caso de prueba.
            let errorOccurred = false;
            let capturedError: Error | null = null;

            const allDates = await repositoryFecha.getAll();

            try {
                await visualizationManager.getOldestAndMostRecentDates();
            } catch (error) {
                errorOccurred = true;
                capturedError  = error as Error;
            }
            if(allDates){
                expect(errorOccurred).toBeFalsy();

            }else{
                expect(errorOccurred).toBeTruthy();
                expect(capturedError).toBeDefined();
                expect(capturedError?.message).toContain('No hay fechas disponibles');
            }

            
        });

        // Aquí puedes añadir más casos de prueba según sea necesario
    });
    

});
