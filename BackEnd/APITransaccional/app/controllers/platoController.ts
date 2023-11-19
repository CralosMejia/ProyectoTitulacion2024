import { Request, Response  } from 'express';
import {platos} from '../models/RestaurantePacificoDB/platos'



/**
 * Creates a new 'plato' (dish) entry in the database.
 *
 * @param req - The request object containing the new 'plato' data.
 * @param res - The response object used to send back the created 'plato' data or an error message.
 */
export const createPlato = async(req:Request, res:Response)=>{
    try {
        const  newPlato =req.body
        await platos.create(newPlato).then((plato_par)=>{
            console.log(`Plato created correctly: ${JSON.stringify(plato_par)}`)
            return res.status(200).json({
                newPlato: plato_par
            })
        });
    } catch (error) {
        console.log(`An error has occurred in the process of creating plato: ${error}`)
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
        await platos.findAll({raw: true}).then(platos => {
            return res.status(200).json({
                platos
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get plato: ${error}`)
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

        await platos.findByPk(id).then(plato => {
            return res.status(200).json({
                plato
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get proveedor by id: ${error}`)
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
        const currentPlato =await platos.findByPk(id)
        const newPlato  =req.body

        if (currentPlato) {

            await currentPlato.update(newPlato).then((platoUpdated)=>{
                console.log(`Plato updated correctly: ${JSON.stringify(platoUpdated)}`)
                return res.status(200).json({
                    platoUpdated
                })
            })

        } else {
            res.status(404).send('Plato not found');
        }
    } catch (error) {
        console.log(`An error has occurred in the plato update process: ${error}`)
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
        const currentPlato =await platos.findByPk(id)

        if (currentPlato) {

            await currentPlato.destroy().then(()=>{
                console.log(`Plato deleted correctly: ${JSON.stringify(currentPlato)}`)
                return res.status(200).json({
                    deletedPlato: currentPlato
                })
            })

        } else {
            res.status(404).send('Plato not found');
        }
    } catch (error) {
        console.log(`An error has occurred in the Plato delete process: ${error}`)
        res.status(400).send(error);
    }
}