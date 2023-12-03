import { Request, Response } from 'express';
import { VisualizationManagerServices } from '../../../business/services/MVD/VisualizationManagerServices';
import { container } from '../../../../config/inversify.config';

const gmServices = container.get<VisualizationManagerServices>(VisualizationManagerServices)


/**
 * Retrieves data for a demand prediction graphic.
 * 
 * @param req - The request object containing the product ID and date range.
 * @param res - The response object used to send back the data for plotting or an error message.
 */
export const getGraficPredictionDemand = async (req: Request, res: Response): Promise<Response> => {
    const {id,fechaDesde,fechaHasta} = req.body;

    try {
        const resp = await gmServices.getDataPredictionDemandGraphic(fechaDesde,fechaHasta,Number(id));
        console.log(`Data: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error while obtaining the data for plotting the demand forecast:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves sales trend data for a specific dish.
 * 
 * @param req - The request object containing the dish ID and date range.
 * @param res - The response object used to send back the sales trend data or an error message.
 */
export const getGraficTrendSales = async (req: Request, res: Response): Promise<Response> => {
    const {id,fechaDesde,fechaHasta} = req.body;

    try {
        const resp = await gmServices.getDataTrendSalesPlate(fechaDesde,fechaHasta,Number(id));
        console.log(`Data: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error in obtaining sales trend data for the dish:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves inventory data for a specific product.
 * 
 * @param req - The request object containing the product ID.
 * @param res - The response object used to send back the inventory data or an error message.
 */
export const getinventoryProduct = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    try {
        const resp = await gmServices.getInventoryDataProduct(Number(id));
        console.log(`Data: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error obtaining product inventory data:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves a summary of orders within a specific date range.
 * 
 * @param req - The request object containing the date range.
 * @param res - The response object used to send back the order summary or an error message.
 */
export const getOrdenesState = async (req: Request, res: Response): Promise<Response> => {
    const {fechaDesde,fechaHasta} = req.body;

    try {
        const resp = await gmServices.getSummaryOrders(fechaDesde,fechaHasta);
        console.log(`Data: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error getting order summary:', error);
        return res.status(400).send(error);
    }
};