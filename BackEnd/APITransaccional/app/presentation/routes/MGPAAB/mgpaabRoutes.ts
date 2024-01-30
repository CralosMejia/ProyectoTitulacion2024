
import { Router } from 'express';
import { createLote, getAllInfoProducts, getExpiredLotes, getLotesToExpire, getProductsNearOrAboveMaximum, getProductsNearOrBelowMinimum, searchProduct } from '../../controller/MGPAAB/mgpaabController';



export const routerMGPAA = Router();

routerMGPAA.post('/createLote',createLote);
routerMGPAA.get('/getExpiredLotes',getExpiredLotes);
routerMGPAA.get('/getLotesToExpire',getLotesToExpire);
routerMGPAA.get('/getProductosMinimum',getProductsNearOrBelowMinimum);
routerMGPAA.get('/getProductosMax',getProductsNearOrAboveMaximum);
routerMGPAA.put('/searchProduct',searchProduct);
routerMGPAA.get('/getAllInfoProducts',getAllInfoProducts);






