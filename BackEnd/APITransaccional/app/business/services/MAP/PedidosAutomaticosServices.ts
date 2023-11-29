import { dimfecha } from "../../../data/models/DataScienceDB/dimfecha";
import { dimproducto } from "../../../data/models/DataScienceDB/dimproducto";
import { hechosdemandaproducto } from "../../../data/models/DataScienceDB/hechosdemandaproducto";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { PedidosServices } from "./PedidosServices";

/**
 * Service class for automatically generating orders based on predicted demand.
 */
export class PedidoAutomaticoService {
    // Repositories for relevant tables
    private repositoryFecha: EntrieRepository<dimfecha>;
    private repositoryProducto: EntrieRepository<dimproducto>;
    private repositoryDemanda: EntrieRepository<hechosdemandaproducto>;
    // Assuming there's a service or repository to handle orders
    private pedidosService: PedidosServices;

    constructor() {
        this.repositoryFecha = new EntrieRepository(dimfecha);
        this.repositoryProducto = new EntrieRepository(dimproducto);
        this.repositoryDemanda = new EntrieRepository(hechosdemandaproducto);
        this.pedidosService = new PedidosServices(); // Assuming you have an orders service
    }

    /**
     * Creates automatic orders for a specific date based on demand predictions.
     * 
     * @param fechaEspecifica - The specific date for which to generate orders.
     * @returns The result of creating the order based on predicted demand.
     */
    async crearPedidosAutomaticos(fechaEspecifica: string){
        try {
            const fechaHoyFormat = new Date(fechaEspecifica).toISOString().split('T')[0];

            // Get the fecha_id corresponding to today's date
            const fecha = await this.repositoryFecha.getAllByField('fecha', fechaHoyFormat);
            if (fecha.length === 0) {
                throw new Error('Current date not found in DimFecha.');
            }
            const fechaId = fecha[0].fecha_id;

            // Get demand predictions for today
            const demandas = await this.repositoryDemanda.getAllByField('fecha_id', fechaId);

            // Create order details based on the predictions
            const detallesPedido: any[] = await Promise.all(demandas.map(async (demanda) => {
                if (typeof demanda.producto_id === 'undefined') {
                    throw new Error('Producto ID is undefined.');
                }
                const producto = await this.repositoryProducto.getById(demanda.producto_id);
                if (!producto) {
                    throw new Error(`Product with ID ${demanda.producto_id} not found.`);
                }
                return {
                    producto_bodega_id: demanda.producto_id,
                    cantidad_necesaria: demanda.cantidad_predicha_modelo_1,
                    // Add more necessary details for the order here
                };
            }));

            // Create the order
            const pedido: any = {
                // Define the order object structure here
            };

            return await this.pedidosService.createOrdenComplete(pedido, detallesPedido);
        } catch (error) {
            console.error('Error while creating automatic orders:', error);
            throw error;
        }
    }
}
