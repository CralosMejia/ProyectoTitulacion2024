
import { Router } from 'express';
import { getGraficPredictionDemand, getGraficTrendSales, getOrdenesState, getinventoryProduct } from '../../controller/MVD/mvdController';



export const routerMVD = Router();

routerMVD.post('/predictionDemand',getGraficPredictionDemand);
routerMVD.post('/trendSales',getGraficTrendSales);
routerMVD.get('/inventoryProduct/:id',getinventoryProduct);
routerMVD.post('/summaryOrder',getOrdenesState);



