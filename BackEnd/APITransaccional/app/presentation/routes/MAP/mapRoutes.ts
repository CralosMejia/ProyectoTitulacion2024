
import { Router } from 'express';
import { approveOrder, create, createdetalleOrden, deletedetalleOrden, finalizeOrder, generateAutomaticOrder, getAllPendigOrderDatils, getDetalleInfo, getOrdenComplete, searchOrden, searchOrdenes, searchProve, sendAllOrder, updateOrdenState, updatedetalleOrden } from '../../controller/MAP/mapController';



export const routerMAP = Router();

routerMAP.post('/createComplete',create);
routerMAP.get('/getOrdenComplete/:id',getOrdenComplete);
routerMAP.put('/updateDetalleOrden/:id',updatedetalleOrden);
routerMAP.post('/createDetalleOrden',createdetalleOrden);
routerMAP.delete('/deleteDetalleOrden/:id',deletedetalleOrden);
routerMAP.put('/updateOrderStatus/:id',updateOrdenState);
routerMAP.post('/finalizeOrder/:id',finalizeOrder);
routerMAP.get('/getInfoDetalleOrder/:id',getDetalleInfo);
routerMAP.post('/generateOrder',generateAutomaticOrder);
routerMAP.get('/approveOrder/:id',approveOrder);
routerMAP.get('/sendAllOrders',sendAllOrder);
routerMAP.get('/getPendigOrderdetails',getAllPendigOrderDatils);
routerMAP.put('/searchProveedor',searchProve);
routerMAP.put('/searchOrdenes',searchOrdenes);
routerMAP.put('/searchOrden/:id',searchOrden);












