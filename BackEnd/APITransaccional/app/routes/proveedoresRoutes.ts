
import { Router } from 'express';
import * as proveedorfunctions from '../controllers/proveedoresController'

export const proveedoresRoutes = Router();

proveedoresRoutes.get('/',proveedorfunctions.getProveedor);

proveedoresRoutes.get('/:id',proveedorfunctions.getProveedorById );

proveedoresRoutes.post('/create',proveedorfunctions.createProveedor );

proveedoresRoutes.put('/update/:id',proveedorfunctions.updateProveedor );

proveedoresRoutes.delete('/delete/:id',proveedorfunctions.deleteProveedor );

