import { PedidosServices } from "../../../business/services/MAP/PedidosServices";
import { Request, Response } from 'express';


export const create = async (req: Request, res: Response): Promise<Response> => {
    const pedidosServ = new PedidosServices();
    const orden = req.body.orden;
    const detalleOrden = req.body.detallesOrden;

    try {
        const resp = await pedidosServ.createOrdenComplete(orden, detalleOrden);
        console.log(`Created correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error al crearuna orden:', error);
        return res.status(400).send(error);
    }
};

export const getOrdenComplete = async (req: Request, res: Response): Promise<Response> => {
    const pedidosServ = new PedidosServices();
    const {id} = req.params

    try {
        const resp = await pedidosServ.getOrderCompleteInfo(Number(id));
        console.log(`Created correctly: ${JSON.stringify(resp)}`);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error al crearuna orden:', error);
        return res.status(400).send(error);
    }
};