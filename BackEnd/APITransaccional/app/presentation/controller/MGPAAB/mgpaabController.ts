import { IngredientesServices } from "../../../business/services/MGPAAB/IngredientesServices";
import { Request, Response } from 'express';


/**
 * Creates a new lote (batch) of ingredients.
 * 
 * @param req - The request object containing the lote data.
 * @param res - The response object used to send back the created lote data or an error message.
 * @returns A promise resolving to the response object.
 */
export const createLote = async (req: Request, res: Response): Promise<Response> => {
    const ingredientesServ = new IngredientesServices();
    const lote = req.body;

    try {
        const resp = await ingredientesServ.addLote(lote);
        console.log(`Created correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('error when adding lote:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves all expired lotes (batches).
 * 
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the expired lotes data or an error message.
 * @returns A promise resolving to the response object.
 */
export const getExpiredLotes = async (_req: Request, res: Response): Promise<Response> => {
    const ingredientesServ = new IngredientesServices();

    try {
        const resp = await ingredientesServ.getExpiredLotes();
        return res.status(200).json(resp);
    } catch (error) {
        console.error('error when getting expired lote:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves all lotes (batches) that are about to expire.
 * 
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the lotes about to expire data or an error message.
 * @returns A promise resolving to the response object.
 */
export const getLotesToExpire = async (_req: Request, res: Response): Promise<Response> => {
    const ingredientesServ = new IngredientesServices();

    try {
        const resp = await ingredientesServ.getLotestoExpire(2);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('error when gettinglotes to expireexpired lote:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves all products that are near or below their minimum stock level.
 * 
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the products data or an error message.
 * @returns A promise resolving to the response object.
 */
export const getProductsNearOrBelowMinimum = async (_req: Request, res: Response): Promise<Response> => {
    const ingredientesServ = new IngredientesServices();

    try {
        const resp = await ingredientesServ.getProductsNearOrBelowMinimum(2);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('error when gettinglotes to expireexpired lote:', error);
        return res.status(400).send(error);
    }
};


/**
 * Retrieves all products that are near or above their maximum stock level.
 * 
 * @param _req - The request object (not used in this function).
 * @param res - The response object used to send back the products data or an error message.
 * @returns A promise resolving to the response object.
 */
export const getProductsNearOrAboveMaximum = async (_req: Request, res: Response): Promise<Response> => {
    const ingredientesServ = new IngredientesServices();

    try {
        const resp = await ingredientesServ.getProductsNearOrAboveMaximum(2);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('error when gettinglotes to expireexpired lote:', error);
        return res.status(400).send(error);
    }
};

/**
 * Searches for a product in the bodega (warehouse) by a specific attribute.
 * 
 * @param req - The request object containing the search parameters.
 * @param res - The response object used to send back the found products data or an error message.
 * @returns A promise resolving to the response object.
 */
export const searchProduct = async (req: Request, res: Response): Promise<Response> => {
    const ingredientesServ = new IngredientesServices();
    const{paramSeacrh,atributeSearch} = req.body

    try {
        const resp = await ingredientesServ.searchProductsBodegaByAttribute(atributeSearch,paramSeacrh);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('error when gettinglotes to expireexpired lote:', error);
        return res.status(400).send(error);
    }
};