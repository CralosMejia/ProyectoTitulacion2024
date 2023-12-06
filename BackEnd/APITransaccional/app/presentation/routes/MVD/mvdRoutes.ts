
import { Router } from 'express';
import { getDates, getGraficPredictionDemand, getGraficTrendSales, getOrdenesState, getinventoryProduct } from '../../controller/MVD/mvdController';



export const routerMVD = Router();

routerMVD.post('/predictionDemand',getGraficPredictionDemand);
routerMVD.post('/trendSales',getGraficTrendSales);
routerMVD.get('/inventoryProduct/:id',getinventoryProduct);
routerMVD.post('/summaryOrder',getOrdenesState);
routerMVD.get('/getdates',getDates);



