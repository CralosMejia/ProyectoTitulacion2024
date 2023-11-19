import { Request, Response  } from 'express';
import {peso} from '../models/RestaurantePacificoDB/peso'



/**
 * Creates a new 'peso' entry in the database.
 *
 * @param req - The request object containing the new 'peso' data.
 * @param res - The response object used to send back the created 'peso' data or an error message.
 */
export const createPeso = async(req:Request, res:Response)=>{
    try {
        const  newPeso =req.body
        await peso.create(newPeso).then((peso_par)=>{
            console.log(`Peso created correctly: ${JSON.stringify(peso_par)}`)
            return res.status(200).json({
                newPeso: peso_par
            })
        });
    } catch (error) {
        console.log(`An error has occurred in the process of creating peso: ${error}`)
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
        await peso.findAll({raw: true}).then(pesos => {
            return res.status(200).json({
                pesos
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get peso: ${error}`)
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

        await peso.findByPk(id).then(pesos => {
            return res.status(200).json({
                pesos
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get peso by id: ${error}`)
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
        const currentPeso =await peso.findByPk(id)
        const newPeso  =req.body

        if (currentPeso) {

            await currentPeso.update(newPeso).then((pesoUpdated)=>{
                console.log(`Peso updated correctly: ${JSON.stringify(pesoUpdated)}`)
                return res.status(200).json({
                    updatedPeso: pesoUpdated
                })
            })

        } else {
            res.status(404).send('Peso not found');
        }
    } catch (error) {
        console.log(`An error has occurred in the peso update process: ${error}`)
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
        const currentPeso =await peso.findByPk(id)

        if (currentPeso) {

            await currentPeso.destroy().then(()=>{
                console.log(`Peso deleted correctly: ${JSON.stringify(currentPeso)}`)
                return res.status(200).json({
                    deletedPeso: currentPeso
                })
            })

        } else {
            res.status(404).send('Peso not found');
        }
    } catch (error) {
        console.log(`An error has occurred in the peso delete process: ${error}`)
        res.status(400).send(error);
    }
}