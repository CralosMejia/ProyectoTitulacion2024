import { inject, injectable } from "inversify";
import { dimfecha } from "../../../data/models/DataScienceDB/dimfecha";
import { hechosdemandaproducto } from "../../../data/models/DataScienceDB/hechosdemandaproducto";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { Observable } from "../common/Observable";
import { PedidosServices } from "./PedidosServices";
import { dimunidadmedida } from "../../../data/models/DataScienceDB/dimunidadmedida";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { LoggerService } from "../common/logs/LogsAPP";
import dotenv from 'dotenv';

dotenv.config();

/**
 * Service class for automatically generating orders based on predicted demand.
 */
@injectable()
export class PedidoAutomaticoService extends Observable {
    // Repositories for relevant tables
    private repositoryFecha: EntrieRepository<dimfecha>;
    private repositoryDemanda: EntrieRepository<hechosdemandaproducto>;
    private repositoryPeso: EntrieRepository<dimunidadmedida>;
    private repositoryProductosBodega: EntrieRepository<productosbodega>;



    // Assuming there's a service or repository to handle orders

    constructor(
        @inject(PedidosServices) private pedidosService: PedidosServices,
        @inject(LoggerService) private log: LoggerService,
        ) {
        super();
        this.repositoryFecha = new EntrieRepository(dimfecha);
        this.repositoryDemanda = new EntrieRepository(hechosdemandaproducto);
        this.repositoryPeso = new EntrieRepository(dimunidadmedida);
        this.repositoryProductosBodega= new EntrieRepository(productosbodega)
    }

    /**
     * Creates automatic orders for a specific date based on demand predictions.
     * 
     * @param fechaEspecifica - The specific date for which to generate orders.
     * @returns The result of creating the order based on predicted demand.
     */
    async createAutomaticOrders(fechaEspecifica: string) {
        let message=`Starting the automatic order creation process` 
        this.log.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
        try {
            const fechaHoyFormat = new Date(fechaEspecifica).toISOString().split('T')[0];

    
            // Obtener la fecha_id correspondiente a la fecha actual
            const fecha = await this.repositoryFecha.getAllByField('fecha', fechaHoyFormat);
            if (fecha.length === 0) {
                throw new Error('Current date not found in DimFecha.');
            }
            const fechaId = fecha[0].fecha_id;
    
            // Obtener predicciones de demanda para la fecha actual
            const demandas = await this.repositoryDemanda.getAllByField('fecha_id', fechaId);
    
            // Crear detalles del pedido basados en las predicciones
            const detallesPedido: any[] = [];
            for (const demanda of demandas) {
                if(demanda.cantidad_predicha_modelo_1 === undefined) throw new Error('no prediction');
                if (demanda.cantidad_predicha_modelo_1 > 0) {
                    const productoBodega = await this.repositoryProductosBodega.getById(demanda.producto_id || 0);
                    if (!productoBodega) {
                        throw new Error(`Product with ID ${demanda.producto_id} not found in ProductosBodega.`);
                    }
    
                    // Obtener información del peso desde DimProducto
                    const peso = await this.repositoryPeso.getById(productoBodega.peso_proveedor_id);
    
                    
    
    
                    if(productoBodega.cantidad_maxima === undefined  || productoBodega.cantidad_actual === undefined)  throw new Error('there are no current or maximum or minimum quantity values, which are necessary to work with');
    
                    let cantidadTotalConDemanda = Number(productoBodega.cantidad_actual) + Number(demanda.cantidad_predicha_modelo_1);

                    // Verificar si la cantidad actual cubre la demanda
                    if (Number(productoBodega.cantidad_actual) < Number(demanda.cantidad_predicha_modelo_1)) {
                        let cantidadNecesaria = Number(demanda.cantidad_predicha_modelo_1) - Number(productoBodega.cantidad_actual);
    
                        // Verificar y ajustar la cantidad máxima si la demanda la supera significativamente
                        if (demanda.cantidad_predicha_modelo_1 > productoBodega.cantidad_maxima + 50) {
                            const diferencia_cant= Number(productoBodega.cantidad_maxima)-Number(productoBodega.cantidad_actual)
                            cantidadNecesaria=Number(productoBodega.cantidad_actual)+diferencia_cant;
                        }

                        cantidadTotalConDemanda= Number(productoBodega.cantidad_actual) +cantidadNecesaria
    
                        // Ajustar la cantidad máxima si supera el total por 20
                        if (cantidadTotalConDemanda > productoBodega.cantidad_maxima + 300) {
                            await this.repositoryProductosBodega.updateSingleFieldById('producto_bodega_id', Number(productoBodega.producto_bodega_id), 'cantidad_maxima', Math.round(cantidadTotalConDemanda));
                        }

                        if (peso) {
                            cantidadNecesaria = Math.round(cantidadNecesaria);
                        }
    
                        // Si la cantidad necesaria para el pedido es mayor que 0 y no cubre la cantidad actual, agregar al pedido
                        if (cantidadNecesaria >= 0.1 && productoBodega.cantidad_actual < demanda.cantidad_predicha_modelo_1) {
                            detallesPedido.push({
                                producto_bodega_id: demanda.producto_id,
                                cantidad_necesaria: cantidadNecesaria
                            });
                        }
                    }
                }
            }
    
            // Crear el pedido si hay detalles válidos
            if (detallesPedido.length > 0) {
                const pedido: any = {
                    modo_creacion: 'Automatico',
                    // fecha_estimada_recepcion:dateMaxToRecive
                };
                const orderComplete = await this.pedidosService.createOrdenComplete(pedido, detallesPedido);
                if (orderComplete !== null) {
                    const infoOrderComplete = await this.pedidosService.getOrderCompleteInfo(orderComplete.order.orden_id);
                    this.notify(infoOrderComplete);
                }
                message=`The automatic order has been created correctly: ${orderComplete}` 
                this.log.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
                return orderComplete;
            } else {
                message=`Does not exist details to create order` 
                this.log.addLog(message,'Apitransaccional','Módulo pedidos automaticos')
                return
            }
        } catch (error) {
            const errorMessage=`Error while creating automatic orders: ${error}` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
    }
    
}
