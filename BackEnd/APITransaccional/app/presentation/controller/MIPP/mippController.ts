import { Request, Response } from 'express';
import { PlatosServices } from '../../../business/services/MIPP/platoServices';
import { container } from '../../../../config/inversify.config';


const platosServ = container.get<PlatosServices>(PlatosServices)

/**
 * Creates a new plato (dish) along with its ingredients.
 * 
 * @param req - The request object containing the plato data and its ingredients.
 * @param res - The response object used to send back the created plato data or an error message.
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
    const plato = req.body.plato;
    const ingredientesList = req.body.ingredientes;

    try {
        const resp = await platosServ.createPlatoComplete(plato, ingredientesList);
        console.log(`Created correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when creating the dish and its ingredients:', error);
        const message = 'Error when creating the dish and its ingredients: '+ error
        return res.status(400).json(message);
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
export const chageStatus = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const resp = await platosServ.changeState(Number(id));
        console.log(`Status chaged correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when change status of dish:', error);
        const message = 'Error when change status of dish: '+ error
        return res.status(400).send(message);
    }
};

/**
 * Gets complete information about a dish, including its ingredients.
 * 
 * @param req - The request object containing the dish ID.
 * @param res - The response object used to send back the dish information or an error message.
 */
export const getInfoPlato = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const resp = await platosServ.getPlatoCompleteInfo(Number(id));
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error in obtaining the information of the dish and its ingredients:', error);
        return res.status(400).send(error);
    }
};

/**
 * Adds a new ingredient to a dish.
 * 
 * @param req - The request object containing the ingredient data.
 * @param res - The response object used to send back the added ingredient or an error message.
 */
export const addIngredienteToPlate = async (req: Request, res: Response): Promise<Response> => {
    const ingrediente = req.body;
    try {
        const resp = await platosServ.addIngredientToPlato(ingrediente);
        console.log(`Ingrediete added correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error while adding an ingredient:', error);
        return res.status(400).send(error);
    }
};

/**
 * Deletes an ingredient from a dish.
 * 
 * @param req - The request object containing the ingredient ID.
 * @param res - The response object used to confirm the deletion or send an error message.
 */
export const deleteIngredienteToPlate = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;
    try {
        const resp = await platosServ.deleteIngredientOfPlato(Number(id));
        console.log(`Ingrediete deleted correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error while deleted an ingredient:', error);
        return res.status(400).send(error);
    }
};


/**
 * Updates an existing ingredient of a dish.
 * 
 * @param req - The request object containing the ingredient ID and new data.
 * @param res - The response object used to send back the updated ingredient or an error message.
 */
export const updateIngredienteToPlate = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;
    const ingrediente = req.body;
    try {
        const resp = await platosServ.updateIngredientOfPlato(Number(id),ingrediente);
        console.log(`Ingrediete updated correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error while updated an ingredient:', error);
        return res.status(400).send(error);
    }
};


export const searchPlate = async (req: Request, res: Response): Promise<Response> => {
    const{paramSeacrh,atributeSearch} = req.body
    try {
        
        const resp = await platosServ.searchPlatosWithFullInfo(atributeSearch,paramSeacrh);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Not found', error);
        return res.status(400).send(error);
    }
};

export const searchIngredientes = async (req: Request, res: Response): Promise<Response> => {
    const{paramSeacrh} = req.body
    const {id} = req.params;

    try {
        
        const resp = await platosServ.searchIngredientsByProductName(Number(id),paramSeacrh);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Not found', error);
        return res.status(400).send(error);
    }
};