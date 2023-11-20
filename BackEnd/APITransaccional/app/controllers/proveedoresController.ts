import { Request, Response  } from 'express';
import {proveedor} from '../models/RestaurantePacificoDB/proveedor'


const nameTable:string= 'Proveedor';
/**
 * Creates a new 'proveedor' (supplier) entry in the database.
 *
 * @param req - The request object containing the new 'proveedor' data.
 * @param res - The response object used to send back the created 'proveedor' data or an error message.
 */
export const createProveedor = async(req:Request, res:Response)=>{
    try {
        const  newOBJ =req.body
        await proveedor.create(newOBJ).then((objectPar)=>{
            console.log(`${nameTable} created correctly: ${JSON.stringify(objectPar)}`)
            return res.status(200).json({
                newEntrie: objectPar
            })
        });
    } catch (error) {
        console.log(`An error has occurred in the process of creating ${nameTable}: ${error}`)
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
        await proveedor.findAll({raw: true}).then(objectPar => {
            return res.status(200).json({
                entriesList: objectPar
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get ${nameTable}: ${error}`)
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

        await proveedor.findByPk(id).then(objectPar => {
            return res.status(200).json({
                entrie: objectPar
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get ${nameTable} by id: ${error}`)
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
        const currentOBJ =await proveedor.findByPk(id)
        const newOBJ  =req.body

        if (currentOBJ) {

            await currentOBJ.update(newOBJ).then((objectPar)=>{
                console.log(`${nameTable} updated correctly: ${JSON.stringify(objectPar)}`)
                return res.status(200).json({
                    entrieUpdate: objectPar
                })
            })

        } else {
            res.status(404).send(`${nameTable} not found`);
        }
    } catch (error) {
        console.log(`An error has occurred in the ${nameTable} update process: ${error}`)
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
        const currentOBJ =await proveedor.findByPk(id)

        if (currentOBJ) {

            await currentOBJ.destroy().then(()=>{
                console.log(`${nameTable} deleted correctly: ${JSON.stringify(currentOBJ)}`)
                return res.status(200).json({
                    deletedEntrie: currentOBJ
                })
            })

        } else {
            res.status(404).send(`${nameTable} not found`);
        }
    } catch (error) {
        console.log(`An error has occurred in the ${nameTable} delete process: ${error}`)
        res.status(400).send(error);
    }
}