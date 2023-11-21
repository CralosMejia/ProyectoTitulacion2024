import express, { Express} from 'express';
import dotenv from 'dotenv';
import {PacificoDB,DataScienceDB} from './config/db'

//Routes imports
import { getCrudRouter} from './app/common/presentation/crudRoutes'
import { routerMIPP } from './app/MIPP/presentation/routes/mippRoutes';

//Models imports
import * as modelPacifico from './app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from './app/data/models/DataScienceDB/init-models'
import { routerMGPAA } from './app/MGPAAB/presentation/routes/mgpaabRoutes';



dotenv.config();

const port = process.env.PORT;
const app: Express = express();


app.use(express.json())//middleware que transforma la req.body a un json


//Routes 
//CRUD
app.use('/api/peso',getCrudRouter('Peso'))
app.use('/api/proveedor',getCrudRouter('Proveedor'))
app.use('/api/plato',getCrudRouter('Platos'))
app.use('/api/productoBodega',getCrudRouter('Producto bodega'))
app.use('/api/ingredientesPorPlato',getCrudRouter('Ingredientes por plato'))
app.use('/api/lote',getCrudRouter('Lotes'))
app.use('/api/orden',getCrudRouter('Ordenes'))
app.use('/api/detalleOrden',getCrudRouter('Detalle orden'))
app.use('/api/ordenesProveedor',getCrudRouter('Ordenes proveedor'))

//MÓDULO IGREDIENTES POR PLATO
app.use('/api/mipp',routerMIPP)
app.use('/api/mgpaab',routerMGPAA)




//Inicializacion del servidor
app.listen(port, () => {
    try {
        //Inicializo los modelos de la base de datos RestaurantePacifico
        PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
        modelPacifico.initModels(PacificoDB);

        //Inicializo los modelos de la base de datos DataScience
        DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
        modelDataScience.initModels(DataScienceDB);

        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        
    } catch (error) {
        console.log(`A server error has occurred: ${error}`)
    }
});