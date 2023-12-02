import { PedidoAutomaticoService } from "../../../../app/business/services/MAP/PedidosAutomaticosServices";
import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

describe('PedidosAutomaticosServices', () => {
    it('should create automatic orders correctly for a given date', async () => {
        const paServices = new PedidoAutomaticoService();
        let errorOccurred = false;

        try {
            await paServices.crearPedidosAutomaticos('2023-01-01');
        } catch (error) {
            errorOccurred = true;
            console.error('Error during test:', error);
        }

        expect(errorOccurred).toBeFalsy();
    });
});
