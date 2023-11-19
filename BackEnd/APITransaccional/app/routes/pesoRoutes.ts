
import { Router } from 'express';
import * as pesofunctions from '../controllers/pesoController'

export const pesoRoutes = Router();

pesoRoutes.get('/',pesofunctions.getPeso );

pesoRoutes.get('/:id',pesofunctions.getPesoById );

pesoRoutes.post('/create',pesofunctions.createPeso );

pesoRoutes.put('/update/:id',pesofunctions.updatePeso );

pesoRoutes.delete('/delete/:id',pesofunctions.deletePeso );

