import { Request, Response  } from 'express';
import {peso} from '../models/RestaurantePacificoDB/peso'


const nameTable:string= 'Peso';

/**
 * Creates a new 'peso' entry in the database.
 *
 * @param req - The request object containing the new 'peso' data.
 * @param res - The response object used to send back the created 'peso' data or an error message.
 */
export const createPeso = async(req:Request, res:Response)=>{
    try {
        const  newOBJ =req.body
        await peso.create(newOBJ).then((objectPar)=>{
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
 * Retrieves all 'peso' entries from the database.
 *
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the 'peso' data or an error message.
 */
export const getPeso = async(_req:Request, res:Response)=>{
    try {
        await peso.findAll({raw: true}).then(objectPar => {
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
 * Retrieves a specific 'peso' entry from the database by its ID.
 *
 * @param req - The request object containing the ID of the 'peso' to retrieve.
 * @param res - The response object used to send back the requested 'peso' data or an error message.
 */
export const getPesoById = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params

        await peso.findByPk(id).then(objectPar => {
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
 * Updates an existing 'peso' entry in the database.
 *
 * @param req - The request object containing the ID of the 'peso' to update and the new data.
 * @param res - The response object used to send back the updated 'peso' data or an error message.
 */
export const updatePeso = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentOBJ =await peso.findByPk(id)
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
 * Deletes a specific 'peso' entry from the database.
 *
 * @param req - The request object containing the ID of the 'peso' to delete.
 * @param res - The response object used to confirm the deletion or send an error message.
 */
export const deletePeso = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentOBJ =await peso.findByPk(id)

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