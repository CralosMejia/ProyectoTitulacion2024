
import { Router } from 'express';
import * as crudFunctions from '../../controller/common/crudController'
import * as models from '../../../data/models/RestaurantePacificoDB/init-models'
import { Model, ModelStatic } from 'sequelize/types/model';

let tableName:string = '';

/**
 * Returns a CRUD (Create, Read, Update, Delete) router for a specific table.
 *
 * @param nameTable - The name of the table for which to create the CRUD router.
 * @returns A Router object configured with CRUD routes for the specified table.
 */
export function getCrudRouter(nameTable:string):Router {
    const router = Router();
    const modelo= _getModel(nameTable)
    
    if (modelo !== null) {

        router.get('/', (req, res) => crudFunctions.getEntries(modelo, tableName)(req, res));
        router.get('/:id',(req, res) => crudFunctions.getEntrieById(modelo, tableName)(req, res) );
        router.post('/create',(req, res) => crudFunctions.createEntrie(modelo, tableName)(req, res));
        router.put('/update/:id',(req, res) => crudFunctions.updateEntrie(modelo, tableName)(req, res));
        router.delete('/delete/:id',(req, res) => crudFunctions.deleteEntrie(modelo, tableName)(req, res));
    } else {
        // Manejar el caso en que el modelo sea null
        router.get('/', (_req, res) => {
            res.status(404).send(`No model was found for ${nameTable}`);
        });
    }

    return router;
}

/**
 * A mapping from table names to their corresponding Sequelize model objects.
 */
const modelMapping: { [key: string]: ModelStatic<Model> } = {
    'Peso': models.peso,
    'Proveedor': models.proveedor,
    'Platos': models.platos,
    'Producto bodega': models.productosbodega,
    'Ingredientes por plato': models.ingredientesporplato,
    'Lotes': models.lotes,
    'Ordenes': models.ordenes,
    // Agrega más modelos aquí según sea necesario
};


/**
 * Retrieves the model for a given table name.
 *
 * @param nameTable - The name of the table for which to retrieve the model.
 * @returns The model corresponding to the given table name, or null if not found.
 */
function _getModel<T extends ModelStatic<Model>>(nameTable: string): T | null {
    const model = modelMapping[nameTable];
    return model ? model as unknown as T : null;
}