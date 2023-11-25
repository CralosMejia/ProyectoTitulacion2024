import { Request, Response } from 'express';
import { PlatosServices } from '../../../business/services/MIPP/platoServices';

/**
 * Creates a new plato (dish) along with its ingredients.
 * 
 * @param req - The request object containing the plato data and its ingredients.
 * @param res - The response object used to send back the created plato data or an error message.
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
    const platosServ = new PlatosServices();
    const plato = req.body.plato;
    const ingredientesList = req.body.ingredientes;

    try {
        const resp = await platosServ.createPlatoComplete(plato, ingredientesList);
        console.log(`Created correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when creating the dish and its ingredients:', error);
        return res.status(400).send(error);
    }
};

/**
 * Creates multiple 'platos' (dishes) along with their ingredients.
 * 
 * @param req - The request object containing an array of 'platos' and their ingredients.
 * @param res - The response object used to send back the created 'platos' data or an error message.
 * @returns A promise resolving to the response object.
 */
export const createMultiple = async (req: Request, res: Response): Promise<Response> => {
    const platosServ = new PlatosServices();
    const platos = req.body;

    try {
        const resp = await platosServ.createMultiplePlatosWithIngredients(platos);
        console.log(`Created all plates correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when creating the dishes and their ingredients:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves information about all platos (dishes) and their ingredients.
 * 
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the platos data or an error message.
 */
export const getInfoPlatos = async (_req: Request, res: Response): Promise<Response> => {
    const platosServ = new PlatosServices();

    try {
        const resp = await platosServ.showInfoPlatos();
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error in obtaining the information of the dish and its ingredients:', error);
        return res.status(400).send(error);
    }
};

/**
 * Deletes a specific plato (dish) and its ingredients by ID.
 * 
 * @param req - The request object containing the ID of the plato to delete.
 * @param res - The response object used to confirm the deletion or send an error message.
 */
export const deletePlatoComplete = async (req: Request, res: Response): Promise<Response> => {
    const platosServ = new PlatosServices();
    const { id } = req.params;

    try {
        const resp = await platosServ.deletePlato(Number(id));
        console.log(`Deleted correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when eliminating the dish and its ingredients:', error);
        return res.status(400).send(error);
    }
};
