
import { Router } from 'express';
import { create, createdetalleOrden, deletedetalleOrden, finalizeOrder, getOrdenComplete, updateOrdenState, updatedetalleOrden } from '../../controller/MAP/mapController';



export const routerMAP = Router();

routerMAP.post('/createComplete',create);
routerMAP.get('/getOrdenComplete/:id',getOrdenComplete);
routerMAP.put('/updateDetalleOrden/:id',updatedetalleOrden);
routerMAP.post('/createDetalleOrden',createdetalleOrden);
routerMAP.delete('/deleteDetalleOrden/:id',deletedetalleOrden);
routerMAP.put('/updateOrderStatus/:id',updateOrdenState);
routerMAP.post('/finalizeOrder/:id',finalizeOrder);



