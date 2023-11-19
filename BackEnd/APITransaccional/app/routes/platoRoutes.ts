
import { Router } from 'express';
import * as platofunctions from '../controllers/platoController'

export const platoRoutes = Router();

platoRoutes.get('/',platofunctions.getPlato);

platoRoutes.get('/:id',platofunctions.getPlatoById );

platoRoutes.post('/create',platofunctions.createPlato );

platoRoutes.put('/update/:id',platofunctions.updatePlato );

platoRoutes.delete('/delete/:id',platofunctions.deletePlato );

