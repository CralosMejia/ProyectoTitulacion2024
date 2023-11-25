
import { Router } from 'express';
import { create, getOrdenComplete } from '../../controller/MAP/mapController';



export const routerMAP = Router();

routerMAP.post('/createComplete',create);
routerMAP.get('/getOrdenComplete/:id',getOrdenComplete);

