
import { Router } from 'express';
import { doAnalisis, getAllAnalisis, getDates, getGraficPredictionDemand, getGraficTrendSales, getOrdenesState, getinventoryProduct, savePredictDemandAnalisis } from '../../controller/MVD/mvdController';



export const routerMVD = Router();

routerMVD.post('/predictionDemand',getGraficPredictionDemand);
routerMVD.post('/trendSales',getGraficTrendSales);
routerMVD.get('/inventoryProduct/:id',getinventoryProduct);
routerMVD.post('/summaryOrder',getOrdenesState);
routerMVD.get('/getdates',getDates);
routerMVD.post('/savePredictdemand',savePredictDemandAnalisis);
routerMVD.get('/getAllAnalisis',getAllAnalisis);
routerMVD.post('/doAnalisis',doAnalisis);





