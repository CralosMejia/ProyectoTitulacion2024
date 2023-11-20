import { Request, Response  } from 'express';
import {platos} from '../models/RestaurantePacificoDB/platos'

const nameTable:string= 'Platos';

/**
 * Creates a new 'plato' (dish) entry in the database.
 *
 * @param req - The request object containing the new 'plato' data.
 * @param res - The response object used to send back the created 'plato' data or an error message.
 */
export const createPlato = async(req:Request, res:Response)=>{
    try {
        const  newOBJ =req.body
        await platos.create(newOBJ).then((objectPar)=>{
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
 * Retrieves all 'plato' (dish) entries from the database.
 *
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the 'plato' data or an error message.
 */
export const getPlato = async(_req:Request, res:Response)=>{
    try {
        await platos.findAll({raw: true}).then(objectPar => {
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
 * Retrieves a specific 'plato' (dish) entry from the database by its ID.
 *
 * @param req - The request object containing the ID of the 'plato' to retrieve.
 * @param res - The response object used to send back the requested 'plato' data or an error message.
 */
export const getPlatoById = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params

        await platos.findByPk(id).then(objectPar => {
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
 * Updates an existing 'plato' (dish) entry in the database.
 *
 * @param req - The request object containing the ID of the 'plato' to update and the new data.
 * @param res - The response object used to send back the updated 'plato' data or an error message.
 */
export const updatePlato = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentOBJ =await platos.findByPk(id)
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
 * Deletes a specific 'plato' (dish) entry from the database.
 *
 * @param req - The request object containing the ID of the 'plato' to delete.
 * @param res - The response object used to confirm the deletion or send an error message.
 */
export const deletePlato = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentOBJ =await platos.findByPk(id)

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