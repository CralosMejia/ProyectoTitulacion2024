import { injectable } from "inversify";
import { dimfecha } from "../../../data/models/DataScienceDB/dimfecha";
import { dimplato } from "../../../data/models/DataScienceDB/dimplato";
import { hechosdemandaproducto } from "../../../data/models/DataScienceDB/hechosdemandaproducto";
import { hechosventaplatos } from "../../../data/models/DataScienceDB/hechosventaplatos";
import { ordenes } from "../../../data/models/RestaurantePacificoDB/ordenes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { ValidatorVisualizationManagerServices } from "../../validators/MVD/ValidatorVisualizationManagerServices";

/**
 * Service class for managing and retrieving various data visualizations.
 */
@injectable()
export class VisualizationManagerServices{

    private repositoryFecha: EntrieRepository<dimfecha>;
    private repositoryDemanda: EntrieRepository<hechosdemandaproducto>;
    private validator:ValidatorVisualizationManagerServices;
    private repositoryPlato: EntrieRepository<dimplato>;
    private repositoryVentas: EntrieRepository<hechosventaplatos>;
    private repositoryProductosBodega: EntrieRepository<productosbodega>;
    private repositoryOrdenes: EntrieRepository<ordenes>;

    constructor() {
        this.repositoryFecha = new EntrieRepository(dimfecha);
        this.repositoryDemanda = new EntrieRepository(hechosdemandaproducto);
        this.validator= new ValidatorVisualizationManagerServices()
        this.repositoryPlato = new EntrieRepository(dimplato);
        this.repositoryVentas = new EntrieRepository(hechosventaplatos);
        this.repositoryProductosBodega = new EntrieRepository(productosbodega);
        this.repositoryOrdenes = new EntrieRepository(ordenes);
        

    }

    /**
     * Retrieves data for demand prediction graphics within a specific date range for a given product.
     * 
     * @param fechaDesde - Start date of the range.
     * @param fechaHasta - End date of the range.
     * @param productoId - ID of the product for which to get data.
     * @returns A dataset for visualization, including predicted and actual demand.
     */
    async getDataPredictionDemandGraphic(fechaDesde: string, fechaHasta: string, productoId: number) {
        try {

            const esRangoValido = await this.validator.validateRangeDates(fechaDesde, fechaHasta);
            if (!esRangoValido) {
                throw new Error('The specified date range is invalid or has no data.');
            }
            // Obtener todas las fechas
            const todasFechas = await this.repositoryFecha.getAll();

            // Filtrar fechas en el rango especificado
            const fechasFiltradas = todasFechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            const labels = fechasFiltradas.map(fecha => fecha.fecha);
            const datosPrediccion: number[] = [];
            const datosRealidad: number[] = [];

            for (const fecha of fechasFiltradas) {
                const demandas = await this.repositoryDemanda.getAllByField('fecha_id', fecha.fecha_id);

                let sumaPrediccion = 0;
                let sumaRealidad = 0;

                demandas.forEach(demanda => {
                    if (demanda.producto_id === productoId) {
                        sumaPrediccion += demanda.cantidad_predicha_modelo_1 || 0;
                        sumaRealidad += demanda.cantidad_real || 0;
                    }
                });

                datosPrediccion.push(sumaPrediccion);
                datosRealidad.push(sumaRealidad);
            }

            if( datosPrediccion.length === 0 || labels.length === 0 || datosRealidad.length === 0) throw new Error(`No data found`);


            return {
                datasets: [
                    {
                        data: datosPrediccion,
                        label: 'Predicción',
                        backgroundColor: 'rgba(148,159,177,0.2)',
                        borderColor: 'rgba(148,159,177,1)',
                        pointBackgroundColor: 'rgba(148,159,177,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                        fill: 'origin',
                    },
                    {
                        data: datosRealidad,
                        label: 'Realidad',
                        backgroundColor: 'rgba(77,83,96,0.2)',
                        borderColor: 'rgba(77,83,96,1)',
                        pointBackgroundColor: 'rgba(77,83,96,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(77,83,96,1)',
                        fill: 'origin',
                    },
                ],
                labels: labels
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves sales trend data for a specific dish within a given date range.
     * 
     * @param fechaDesde - Start date of the range.
     * @param fechaHasta - End date of the range.
     * @param platoId - ID of the dish for which to get sales data.
     * @returns A dataset for visualization, including sales data of the dish.
     */
    async getDataTrendSalesPlate(fechaDesde: string, fechaHasta: string, platoId: number) {
        try {
            // Validar el rango de fechas
            const esRangoValido = await this.validator.validateRangeDates(fechaDesde, fechaHasta);
            if (!esRangoValido) {
                throw new Error('The specified date range is invalid or has no data.');
            }

            // Obtener nombre del plato
            const plato = await this.repositoryPlato.getById(platoId);
            if (!plato) {
                throw new Error(`Plate with ID ${platoId} not found.`);
            }

            // Obtener todas las fechas en el rango
            const fechas = await this.repositoryFecha.getAll();
            const fechasFiltradas = fechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            const datosVentas: number[] = [];
            const labels: string[] = fechasFiltradas.map(fecha => fecha.fecha);

            // Obtener y procesar ventas para cada fecha
            for (const fecha of fechasFiltradas) {
                const ventasEnFecha = await this.repositoryVentas.getAllByField('fecha_id', fecha.fecha_id);
                const ventaDelPlato = ventasEnFecha.find(venta => venta.plato_id === platoId);
                if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                    datosVentas.push(ventaDelPlato ? ventaDelPlato.unidades_vendidas : 0);
                }
            }

            if( datosVentas.length === 0 || labels.length === 0) throw new Error(`No data found`);

            return {
                datasets: [
                    {
                        data: datosVentas,
                        label: plato.nombre_plato,
                        yAxisID: 'y1',
                        backgroundColor: 'rgba(255,0,0,0.3)',
                        borderColor: 'red',
                        pointBackgroundColor: 'rgba(148,159,177,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                        fill: 'origin',
                    }
                ],
                labels: labels
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves inventory data for a specific product in the warehouse.
     * 
     * @param productoBodegaId - ID of the warehouse product.
     * @returns A dataset for visualization, including inventory levels of the product.
     */
    async getInventoryDataProduct(productoBodegaId: number) {
        try {
            // Obtener la información del producto de la bodega
            const producto = await this.repositoryProductosBodega.getById(productoBodegaId);
            if (!producto) {
                throw new Error(`Product with ID ${productoBodegaId} not found.`);
            }

            return {
                labels: [producto.nombre_producto],
                datasets: [
                    { data: [producto.cantidad_maxima || 0], label: 'Cantidad Máxima' },
                    { data: [producto.cantidad_actual || 0], label: 'Cantidad Actual' },
                ],
            };
        } catch (error) {
            console.error('Error obtaining product inventory data:', error);
            throw error;
        }
    }

    /**
     * Retrieves a summary of orders within a specific date range.
     * 
     * @param fechaDesde - Start date of the range.
     * @param fechaHasta - End date of the range.
     * @returns A dataset for visualization, including counts of different types of orders.
     */
    async getSummaryOrders(fechaDesde: string, fechaHasta: string) {
        try {
            // Obtener todas las órdenes
            const todasLasOrdenes = await this.repositoryOrdenes.getAll();

            // Filtrar órdenes dentro del rango de fechas
            const ordenesEnRango = todasLasOrdenes.filter(orden => 
                new Date(orden.fecha_orden) >= new Date(fechaDesde) && 
                new Date(orden.fecha_orden) <= new Date(fechaHasta)
            );

            if(ordenesEnRango.length === 0) throw new Error(`No data found`);
            // Contar órdenes según criterios
            const creadosManualmente = ordenesEnRango.filter(orden => orden.modo_creacion === 'Manual').length;
            const aprobadosSinModificaciones = ordenesEnRango.filter(orden => orden.modo_creacion === 'Automatico' && !orden.estado_edicion && orden.estado === 'Aprobado').length;
            const editadosYAprobados = ordenesEnRango.filter(orden => orden.modo_creacion === 'Automatico' && orden.estado_edicion && orden.estado === 'Aprobado').length;
            const cancelados = ordenesEnRango.filter(orden => orden.estado === 'Cancelado').length;

            return {
                labels: [['Creados', 'Manualmente'], ['Aprobados sin', 'modificaciones'], ['Editados y', 'aprobados'], 'Cancelados'],
                datasets: [
                    {
                        data: [creadosManualmente, aprobadosSinModificaciones, editadosYAprobados, cancelados],
                    },
                ],
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves the oldest and most recent dates.
     * 
     * @returns An object containing the oldest and most recent dates.
     */
    async getOldestAndMostRecentDates() {
        try {
            const allDates = await this.repositoryFecha.getAll();
            if (allDates.length === 0) {
                throw new Error('No hay fechas disponibles');
            }

            // Suponiendo que 'fecha' es un campo de tipo Date o string en formato de fecha
            let oldestDate = new Date(allDates[0].fecha);
            let mostRecentDate = new Date(allDates[0].fecha);

            allDates.forEach(dateEntry => {
                const currentDate = new Date(dateEntry.fecha);
                if (currentDate < oldestDate) {
                    oldestDate = currentDate;
                }
                if (currentDate > mostRecentDate) {
                    mostRecentDate = currentDate;
                }
            });

            return {
                oldestDate: oldestDate.toISOString().split('T')[0], // Formatear como 'YYYY-MM-DD'
                mostRecentDate: mostRecentDate.toISOString().split('T')[0] // Formatear como 'YYYY-MM-DD'
            };
        } catch (error) {
            throw new Error(`Error al obtener las fechas más antiguas y recientes: ${error}`);
        }
    }
}