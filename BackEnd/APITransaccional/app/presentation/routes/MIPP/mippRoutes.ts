
import { Router } from 'express';
import { create, createMultiple, deletePlatoComplete, getInfoPlatos } from '../../controller/MIPP/mippController';



export const routerMIPP = Router();

routerMIPP.post('/create',create);
routerMIPP.post('/createMultiple',createMultiple);
routerMIPP.get('/infoPlatos',getInfoPlatos);
routerMIPP.delete('/delete/:id',deletePlatoComplete);
