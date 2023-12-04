import 'reflect-metadata';
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { container } from '../../../../config/inversify.config';
import { VisualizationManagerServices } from '../../../../app/business/services/MVD/VisualizationManagerServices';

const visualizationManager = container.get<VisualizationManagerServices>(VisualizationManagerServices)

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

describe('VisualizationManagerServices', () => {
    describe('getDataPredictionDemandGraphic', () => {
        it('should retrieve demand prediction data for a given product within a date range', async () => {
            const fechaDesde = '2023-01-01';
            const fechaHasta = '2023-01-31';
            const productoId = 123; // Asegúrate de que este ID exista en tu base de datos de prueba

            const result = await visualizationManager.getDataPredictionDemandGraphic(fechaDesde, fechaHasta, productoId);

            expect(result).toHaveProperty('datasets');
            expect(result).toHaveProperty('labels');
            expect(result.datasets.length).toBeGreaterThan(0);
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
            expect(result.datasets.length).toBeGreaterThan(0);
        });
    
    });

    describe('getInventoryDataProduct', () => {
        it('should retrieve inventory data for a specific product', async () => {
            const productoBodegaId = 1; // Asegúrate de que este ID exista en tu base de datos de prueba
    
            const result = await visualizationManager.getInventoryDataProduct(productoBodegaId);
    
            expect(result).toHaveProperty('labels');
            expect(result).toHaveProperty('datasets');
            expect(result.datasets.length).toBeGreaterThan(0);
        });
    
    });

    describe('getSummaryOrders', () => {
        it('should retrieve a summary of orders within a specific date range', async () => {
            const fechaDesde = '2023-12-02';
            const fechaHasta = '2023-12-03';
    
            const result = await visualizationManager.getSummaryOrders(fechaDesde, fechaHasta);
    
            expect(result).toHaveProperty('labels');
            expect(result).toHaveProperty('datasets');
            expect(result.datasets.length).toBeGreaterThan(0);
        });
    
    });
    
    
    

});
