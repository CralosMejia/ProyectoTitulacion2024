
import { Router } from 'express';
import { create, deletePlatoComplete, getInfoPlatos } from '../controller/mippController';



export const routerMIPP = Router();
routerMIPP.post('/create',create);
routerMIPP.get('/infoPlatos',getInfoPlatos);
routerMIPP.delete('/delete/:id',deletePlatoComplete);
