
import { Router } from 'express';
import { loadVentas } from '../../controller/common/ventasController';



export const routerVentas = Router();

routerVentas.post('/loadVentas',loadVentas);
