
import { Router } from 'express';
import * as productosBodegafunctions from '../controllers/productosBodegaCotroller'

export const productosBodegaRoutes = Router();

productosBodegaRoutes.get('/',productosBodegafunctions.getProductoBodega);

productosBodegaRoutes.get('/:id',productosBodegafunctions.getproductoBodegaById );

productosBodegaRoutes.post('/create',productosBodegafunctions.createProductoBodega );

productosBodegaRoutes.put('/update/:id',productosBodegafunctions.updateProductoBodega );

productosBodegaRoutes.delete('/delete/:id',productosBodegafunctions.deleteProductoBodega );

