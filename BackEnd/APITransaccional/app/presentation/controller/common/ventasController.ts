import { Request, Response } from 'express';
import { VentasServices } from '../../../business/services/common/ventasServices';

/**
 * Loads multiple sales into the database.
 * 
 * @param req - The request object containing the array of sales data.
 * @param res - The response object used to send back the result of the sales loading or an error message.
 */
export const loadVentas = async (req: Request, res: Response): Promise<Response> => {
    const ventassServ = new VentasServices();
    const ventas = req.body;

    try {
        const resp = await ventassServ.addMultipleSales(ventas);
        console.log(`Created correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when loading sales:', error);
        return res.status(400).send(error);
    }
};