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

async function testCrearPedidosAutomaticos() {
    const servicioPedidosAutomaticos = new PedidoAutomaticoService();
    const fechaPrueba = '2023-01-01'; // Cambia esto a una fecha de prueba relevante para tus datos

    try {
        console.log(`Iniciando prueba de creación automática de pedidos para la fecha: ${fechaPrueba}`);
        await servicioPedidosAutomaticos.crearPedidosAutomaticos(fechaPrueba);
        console.log('Prueba completada con éxito.');
    } catch (error) {
        console.error('Error durante la prueba de creación automática de pedidos:', error);
    }
}

testCrearPedidosAutomaticos();
