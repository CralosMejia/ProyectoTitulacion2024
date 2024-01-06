
import { Router } from 'express';
import { create, createMultiple, chageStatus, getInfoPlatos, getInfoPlato, addIngredienteToPlate, deleteIngredienteToPlate, updateIngredienteToPlate, searchPlate, searchIngredientes } from '../../controller/MIPP/mippController';



export const routerMIPP = Router();

routerMIPP.post('/create',create);
routerMIPP.post('/createMultiple',createMultiple);
routerMIPP.get('/infoPlatos',getInfoPlatos);
routerMIPP.post('/chageState/:id',chageStatus);
routerMIPP.get('/infoPlato/:id',getInfoPlato);
routerMIPP.post('/addingrediente',addIngredienteToPlate);
routerMIPP.delete('/deleteingrediente/:id',deleteIngredienteToPlate);
routerMIPP.put('/updatedingrediente/:id',updateIngredienteToPlate);
routerMIPP.put('/search',searchPlate);
routerMIPP.put('/searchIngredientes/:id',searchIngredientes);





