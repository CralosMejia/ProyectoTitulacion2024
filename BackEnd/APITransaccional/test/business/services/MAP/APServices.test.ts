import 'reflect-metadata';
import { PedidoAutomaticoService } from "../../../../app/business/services/MAP/PedidosAutomaticosServices";
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { container } from '../../../../config/inversify.config';
import { PedidosServices } from '../../../../app/business/services/MAP/PedidosServices';

const pedidosServices = container.get<PedidosServices>(PedidosServices)
const paServices = container.get<PedidoAutomaticoService>(PedidoAutomaticoService)
console.log(pedidosServices)


//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

describe('PedidosAutomaticosServices', () => {
    it('should create automatic orders correctly for a given date', async () => {
        let errorOccurred = false;

        try {
            await paServices.createAutomaticOrders('2023-01-01');
        } catch (error) {
            errorOccurred = true;
            console.error('Error during test:', error);
        }

        expect(errorOccurred).toBeFalsy();
    });

    it('should return an error that the date is not found.', async () => {
        let errorOccurred = false;
        let capturedError: Error | null = null;

        try {
            await paServices.createAutomaticOrders('2020-01-01');
        } catch (error) {
            errorOccurred = true;
            capturedError = error as Error;

        }

        expect(errorOccurred).toBeTruthy();
        // Verificar que el error capturado es del tipo o tiene el mensaje esperado
        expect(capturedError).toBeDefined();
        expect(capturedError?.message).toContain("Current date not found in DimFecha.");
    });
});
