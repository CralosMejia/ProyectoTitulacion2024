import { Request, Response  } from 'express';
import {proveedor} from '../models/RestaurantePacificoDB/proveedor'



/**
 * Creates a new 'proveedor' (supplier) entry in the database.
 *
 * @param req - The request object containing the new 'proveedor' data.
 * @param res - The response object used to send back the created 'proveedor' data or an error message.
 */
export const createProveedor = async(req:Request, res:Response)=>{
    try {
        const  newProveedor =req.body
        await proveedor.create(newProveedor).then((prov_par)=>{
            console.log(`Proveedor created correctly: ${JSON.stringify(prov_par)}`)
            return res.status(200).json({
                newProveedor: prov_par
            })
        });
    } catch (error) {
        console.log(`An error has occurred in the process of creating proveedor: ${error}`)
        res.status(400).send(error);
    }
}

/**
 * Retrieves all 'proveedor' (supplier) entries from the database.
 *
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the 'proveedor' data or an error message.
 */
export const getProveedor = async(_req:Request, res:Response)=>{
    try {
        await proveedor.findAll({raw: true}).then(proveedor => {
            return res.status(200).json({
                proveedor: proveedor
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get proveedor: ${error}`)
        res.status(400).send(error);
    }
}

/**
 * Retrieves a specific 'proveedor' (supplier) entry from the database by its ID.
 *
 * @param req - The request object containing the ID of the 'proveedor' to retrieve.
 * @param res - The response object used to send back the requested 'proveedor' data or an error message.
 */
export const getProveedorById = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params

        await proveedor.findByPk(id).then(proveedor => {
            return res.status(200).json({
                proveedor: proveedor
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get proveedor by id: ${error}`)
        res.status(400).send(error);
    }
}

/**
 * Updates an existing 'proveedor' (supplier) entry in the database.
 *
 * @param req - The request object containing the ID of the 'proveedor' to update and the new data.
 * @param res - The response object used to send back the updated 'proveedor' data or an error message.
 */
export const updateProveedor = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentProveedor =await proveedor.findByPk(id)
        const newProveedor  =req.body

        if (currentProveedor) {

            await currentProveedor.update(newProveedor).then((proveedorUpdated)=>{
                console.log(`proveedor updated correctly: ${JSON.stringify(proveedorUpdated)}`)
                return res.status(200).json({
                    updatedProveedor: proveedorUpdated
                })
            })

        } else {
            res.status(404).send('Proveedor not found');
        }
    } catch (error) {
        console.log(`An error has occurred in the proveedor update process: ${error}`)
        res.status(400).send(error);
    }
}

/**
 * Deletes a specific 'proveedor' (supplier) entry from the database.
 *
 * @param req - The request object containing the ID of the 'proveedor' to delete.
 * @param res - The response object used to confirm the deletion or send an error message.
 */
export const deleteProveedor = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentProveedor =await proveedor.findByPk(id)

        if (currentProveedor) {

            await currentProveedor.destroy().then(()=>{
                console.log(`Proveedor deleted correctly: ${JSON.stringify(currentProveedor)}`)
                return res.status(200).json({
                    deletedProveedor: currentProveedor
                })
            })

        } else {
            res.status(404).send('Proveedor not found');
        }
    } catch (error) {
        console.log(`An error has occurred in the proveedor delete process: ${error}`)
        res.status(400).send(error);
    }
}