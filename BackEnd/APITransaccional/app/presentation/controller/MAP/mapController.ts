import { container } from "../../../../config/inversify.config";
import { PedidoAutomaticoService } from "../../../business/services/MAP/PedidosAutomaticosServices";
import { PedidosServices } from "../../../business/services/MAP/PedidosServices";
import { Request, Response } from 'express';
import { LoggerService } from "../../../business/services/common/logs/LogsAPP";

const pedidosServ = container.get<PedidosServices>(PedidosServices)
const paServices = container.get<PedidoAutomaticoService>(PedidoAutomaticoService)
const logs = container.get<LoggerService>(LoggerService)



/**
 * Creates a complete order with its details.
 * 
 * @param req - The request object containing the order and its details.
 * @param res - The response object used to send back the created order data or an error message.
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
    const orden = req.body.orden;
    const detalleOrden = req.body.detallesOrden;

    try {
        const resp = await pedidosServ.createOrdenComplete(orden, detalleOrden);
        const message=`Order created correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when creating an order:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves complete information for a specific order, including its details.
 * 
 * @param req - The request object containing the order ID.
 * @param res - The response object used to send back the order information or an error message.
 */
export const getOrdenComplete = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params

    try {
        const resp = await pedidosServ.getOrderCompleteInfo(Number(id));
        const message=`Get order correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when obtaining an order: ', error);
        return res.status(400).send(error);
    }
};

/**
 * Updates a specific order detail.
 * 
 * @param req - The request object containing the order detail ID and new data.
 * @param res - The response object used to send back the updated order detail or an error message.
 */
export const updatedetalleOrden = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params
    const detalleOrd= req.body

    try {
        const resp = await pedidosServ.updateDetalleOrden(Number(id),detalleOrd);
        const message=`Updated order correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error updating the order detail:', error);
        return res.status(400).send(error);
    }
};

/**
 * Creates a new order detail.
 * 
 * @param req - The request object containing the order detail data.
 * @param res - The response object used to send back the created order detail or an error message.
 */

export const createdetalleOrden = async (req: Request, res: Response): Promise<Response> => {
    const detalleOrden= req.body

    try {
        const resp = await pedidosServ.createDetalleOrden(detalleOrden);
        const message=`Order detail successfully created: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when creating the order detail: ', error);
        return res.status(400).send(error);
    }
};

/**
 * Deletes a specific order detail.
 * 
 * @param req - The request object containing the order detail ID.
 * @param res - The response object used to confirm the deletion or send an error message.
 */
export const deletedetalleOrden = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params

    try {
        const resp = await pedidosServ.deleteDetalleOrden(Number(id));
        const message=`Order detail successfully deleted: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when creating the order detail: ', error);
        return res.status(400).send(error);
    }
};

/**
 * Changes the status of an order.
 * 
 * @param req - The request object containing the order ID and the new status.
 * @param res - The response object used to confirm the status change or send an error message.
 */
export const updateOrdenState = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params
    const orden= req.body.estado

    try {
        const resp = await pedidosServ.changeOrderStatus(Number(id),orden);
        const message=`Updated order state correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error changing order status:', error);
        return res.status(400).send(error);
    }
};

/**
 * Finalizes an order by completing its processing.
 * 
 * @param req - The request object containing the order ID.
 * @param res - The response object used to confirm the completion or send an error message.
 */
export const finalizeOrder = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params
    const {idProv,idDetail} = req.body


    try {
        const resp = await pedidosServ.finalizeOrder(Number(id),Number(idProv)|| 0,Number(idDetail)||0);
        const message=`order completed correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error finalizing the order:', error);
        return res.status(400).send(error);
    }
};

/**
 * Retrieves detailed information about a specific product from the warehouse.
 * 
 * @param req - The request object containing the product ID.
 * @param res - The response object used to send back the product information or an error message.
 */
export const getDetalleInfo = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params

    try {
        const resp = await pedidosServ.getProductCompleteInfo(Number(id));
        const message=`get detailed info: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error finalizing the order:', error);
        return res.status(400).send(error);
    }
};


export const generateAutomaticOrder = async (req: Request, res: Response): Promise<Response> => {
    const date= req.body.fecha

    try {
        const resp = await paServices.createAutomaticOrders(date);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error generate order:', error);
        return res.status(400).send(error);
    }
};

export const approveOrder = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params

    try {
        const resp = await pedidosServ.changeOrderStatus(Number(id),'Aprobado');
        const message=`The order has been approved correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error changing order status:', error);
        return res.status(400).send(error);
    }
};

export const sendAllOrder = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const resp = await pedidosServ.processAndNotifyApprovedOrders();
        const message=`orders have been sent correctly: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error when changing the status of orders:', error);
        return res.status(400).send(error);
    }
};

export const searchProve = async (req: Request, res: Response): Promise<Response> => {
    const{paramSeacrh,atributeSearch} = req.body
    try {
        const resp = await pedidosServ.searchProveedoresByAttribute(atributeSearch,paramSeacrh);
        const message=`The search was successful: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Not found', error);
        return res.status(400).send(error);
    }
};

export const searchOrdenes = async (req: Request, res: Response): Promise<Response> => {
    const{paramSeacrh,atributeSearch} = req.body
    try {
        const resp = await pedidosServ.searchOrdenesByAttribute(atributeSearch,paramSeacrh);
        const message=`The search was successful: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Not found', error);
        return res.status(400).send(error);
    }
};

export const searchOrden = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params
    const{paramSeacrh,atributeSearch} = req.body
    try {
        const resp = await pedidosServ.searchCompleteOrderInfoByAttributeAndId(Number(id),atributeSearch,paramSeacrh);
        const message=`The search was successful: ${JSON.stringify(resp)}`
        logs.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Not found', error);
        return res.status(400).send(error);
    }
};

export const getAllPendigOrderDatils = async (_req: Request, res: Response): Promise<Response> => {

    try {
        const resp = await pedidosServ.getPendingOrderDetailsNearReception();
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error generate order:', error);
        return res.status(400).send(error);
    }
};