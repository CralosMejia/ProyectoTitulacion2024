import { inject, injectable } from "inversify";
import { dimfecha } from "../../../data/models/DataScienceDB/dimfecha";
import { dimplato } from "../../../data/models/DataScienceDB/dimplato";
import { hechosdemandaproducto } from "../../../data/models/DataScienceDB/hechosdemandaproducto";
import { hechosventaplatos } from "../../../data/models/DataScienceDB/hechosventaplatos";
import { ordenes } from "../../../data/models/RestaurantePacificoDB/ordenes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { ValidatorVisualizationManagerServices } from "../../validators/MVD/ValidatorVisualizationManagerServices";
import { LoggerService } from "../common/logs/LogsAPP";
import { peso } from "../../../data/models/RestaurantePacificoDB/peso";
import { proveedor } from "../../../data/models/RestaurantePacificoDB/proveedor";
import { lotes } from "../../../data/models/RestaurantePacificoDB/lotes";
import { analisispredicciondemanda } from "../../../data/models/RestaurantePacificoDB/analisispredicciondemanda";

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
    private repositoryPeso: EntrieRepository<peso>;
    private repositoryOrdenes: EntrieRepository<ordenes>;
    private repositoryProveedor: EntrieRepository<proveedor>;
    private repositoryLotes:EntrieRepository<lotes>;
    private repositoryPrediccion:EntrieRepository<analisispredicciondemanda>;


    constructor(
        @inject(LoggerService) private log: LoggerService,
    ) {
        this.repositoryFecha = new EntrieRepository(dimfecha);
        this.repositoryDemanda = new EntrieRepository(hechosdemandaproducto);
        this.validator= new ValidatorVisualizationManagerServices()
        this.repositoryPlato = new EntrieRepository(dimplato);
        this.repositoryVentas = new EntrieRepository(hechosventaplatos);
        this.repositoryProductosBodega = new EntrieRepository(productosbodega);
        this.repositoryPeso = new EntrieRepository(peso);
        this.repositoryOrdenes = new EntrieRepository(ordenes);
        this.repositoryProveedor = new EntrieRepository(proveedor);
        this.repositoryLotes = new EntrieRepository(lotes);
        this.repositoryPrediccion = new EntrieRepository(analisispredicciondemanda);



        

    }

    /**
     * Retrieves data for demand prediction graphics within a specific date range for a given product.
     * 
     * @param fechaDesde - Start date of the range.
     * @param fechaHasta - End date of the range.
     * @param productoId - ID of the product for which to get data.
     * @returns A dataset for visualization, including predicted and actual demand.
     */
    async getDataPredictionDemandGraphic(fechaDesde: string, fechaHasta: string, productoId: number, frecuencia: string = 'w') {
        try {
            let labels:any=[];

            const product= await this.repositoryProductosBodega.getById(productoId)

            if(!product){
                let errorMessage=`Does not exist product ${productoId}` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            const peso=await this.repositoryPeso.getById(product.peso_proveedor_id)

            if(!peso){
                let errorMessage=`Does not exist peso ${product.peso_proveedor_id}` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            

            const esRangoValido = await this.validator.validateRangeDates(fechaDesde, fechaHasta);
            if (!esRangoValido) {
                let errorMessage=`The specified date range is invalid or has no data.` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }
            // Obtener todas las fechas
            const todasFechas = await this.repositoryFecha.getAll();

            // Filtrar fechas en el rango especificado
            const fechasFiltradas = todasFechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            let datosPrediccion: number[] = [];
            let datosRealidad: number[] = [];
            let resumenDatos:any=[]

            if(frecuencia === 'w'){
                 labels = fechasFiltradas.map(fecha => fecha.fecha);
            }

            for (const fecha of fechasFiltradas) {
                let demandas = await this.repositoryDemanda.getAllByField('fecha_id', fecha.fecha_id);
                demandas = demandas.filter((demanda:any)=> demanda.producto_id === productoId)

                if(demandas.length === 0){
                    if(frecuencia === 'w' && product.precio_proveedor){
                        datosPrediccion.push(0);
                        datosRealidad.push(0);
                        resumenDatos.push({ 
                            fecha:fecha.fecha, 
                            cantidad_predicha:(0),
                            valor_estimado:0
                        });
                    }else if(frecuencia === 'm' && fecha.mes !== undefined && fecha.anio !== undefined){
                        let nombreMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][fecha.mes - 1];

                        nombreMes=nombreMes+'-'+fecha.anio

                        this.agregarOModificarPrediccion(resumenDatos,nombreMes,( 0),0);

                        resumenDatos = this.sortByDate(resumenDatos)

                        labels=resumenDatos.map((item:any)=> item.fecha)
                        datosPrediccion=resumenDatos.map((item:any)=> item.cantidad_predicha)
                    }else{
                        const anio = fecha.anio || 0

                        this.agregarOModificarPrediccion(resumenDatos,String(anio),( 0), 0);

                        labels=resumenDatos.map((item:any)=> item.fecha)
                        datosPrediccion=resumenDatos.map((item:any)=> item.cantidad_predicha)
                    }
                }else{
                    demandas.forEach(demanda => {
                        if(frecuencia === 'w' && product.precio_proveedor){
                            datosPrediccion.push(Number(demanda.cantidad_predicha_modelo_1) || 0);
                            resumenDatos.push({ 
                                fecha:fecha.fecha, 
                                cantidad_predicha:(Number(demanda.cantidad_predicha_modelo_1) || 0),
                                valor_estimado:(Number(demanda.cantidad_predicha_modelo_1) || 0)*product.precio_proveedor
                            });
                        }else if(frecuencia === 'm' && fecha.mes !== undefined && fecha.anio !== undefined){
                            let nombreMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][fecha.mes - 1];
    
                            nombreMes=nombreMes+'-'+fecha.anio
    
                            this.agregarOModificarPrediccion(resumenDatos,nombreMes,(Number(demanda.cantidad_predicha_modelo_1) || 0),Number(product.precio_proveedor || 0));
    
                            resumenDatos = this.sortByDate(resumenDatos)
    
                            labels=resumenDatos.map((item:any)=> item.fecha)
                            datosPrediccion=resumenDatos.map((item:any)=> item.cantidad_predicha)
                        }else{
                            const anio = fecha.anio || 0
    
                            this.agregarOModificarPrediccion(resumenDatos,String(anio),(Number(demanda.cantidad_predicha_modelo_1) || 0),product.precio_proveedor || 0);
    
                            labels=resumenDatos.map((item:any)=> item.fecha)
                            datosPrediccion=resumenDatos.map((item:any)=> item.cantidad_predicha)
                        }
                    });

                }
            }

            if( datosPrediccion.length === 0 || labels.length === 0){

                let errorMessage=`No data found` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            } 
                

            let errorMessage=`information has been returned correctly for plotting the demand forecast` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
            return {
                peso:peso.simbolo,
                unidad:peso.unidad,
                datos:{
                datasets: [
                    {
                        data: datosPrediccion,
                        label: 'Predicción',
                        backgroundColor: 'rgba(235, 139, 150, 0.29)',
                        borderColor: 'rgba(238, 137, 149, 0.54)',
                        pointBackgroundColor: 'rgba(238, 137, 149, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                        fill: 'origin',
                    },
                    
                ],
                labels: labels,},
                options:{
                    responsive: true,
                    elements: {
                      line: {
                        tension: 0.5,
                      },
                    },
                    scales: {
                      // We use this empty structure as a placeholder for dynamic theming.
                      y: {
                        title: {
                          display: true,
                          text: `peso: ${peso.unidad}`, // Etiqueta para el eje Y
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Tiempo', // Etiqueta para el eje X
                        }
                      },
                    },
                    plugins: {
                      datalabels: {
                        anchor: 'end',
                        align: 'end',
                        offset: -5
                      }
                    },
                  },
                resumenDatos
            };
        } catch (error) {
            throw error;
        }
    }

    async getDataPredictedGeneralDemand(fechaDesde: string, fechaHasta: string, frecuencia: string = 'w'){
        try{
            let resumenDatos = [];
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            const products = await this.repositoryProductosBodega.getAll();
            if (!products) {
                throw new Error('No existen productos');
            }

            const esRangoValido = await this.validator.validateRangeDates(fechaDesde, fechaHasta);
            if (!esRangoValido) {
                throw new Error('El rango de fechas especificado es inválido o no tiene datos.');
            }

            const todasFechas = await this.repositoryFecha.getAll();
            let demandas = await this.repositoryDemanda.getAll();

            const fechasFiltradas = todasFechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            demandas = demandas.filter(demanda => fechasFiltradas.some(fecha => fecha.fecha_id === demanda.fecha_id));

            for (const demanda of demandas) {
                const product = products.find(prod => prod.producto_bodega_id === demanda.producto_id);
                if (!product) continue;

                const fecha = fechasFiltradas.find(fecha => fecha.fecha_id === demanda.fecha_id);
                let key:any;

                if (!fecha) continue;
                if (!fecha.mes) continue;


                if (frecuencia === 'w') {
                    key = fecha.fecha;
                } else if (frecuencia === 'm') {
                    key = `${meses[fecha.mes - 1]}-${fecha.anio}`;
                } else {
                    key = String(fecha.anio);
                }

                let index = resumenDatos.findIndex(item => item.fecha === key);
                if (index === -1) {
                    resumenDatos.push({
                        fecha: key,
                        cantidad_predicha: 0,
                        valor_estimado: 0
                    });
                    index = resumenDatos.findIndex(item => item.fecha === key);

                }

                if (!product.precio_proveedor) continue;

                resumenDatos[index].cantidad_predicha += Number(demanda.cantidad_predicha_modelo_1) || 0;
                resumenDatos[index].valor_estimado += (demanda.cantidad_predicha_modelo_1 || 0) * product.precio_proveedor;
            }
            resumenDatos = this.sortByDate(resumenDatos);
            const labels = resumenDatos.map((item:any) => item.fecha);
            const datosPrediccion = resumenDatos.map((item:any) => item.valor_estimado);

    
            if( datosPrediccion.length === 0 || labels.length === 0 ){
    
                let errorMessage=`No data found` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            } 

            let errorMessage=`information has been returned correctly for plotting the demand forecast` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
            return {
                peso:'Dolares',
                unidad:'$',
                datos:{
                datasets: [
                    {
                        data: datosPrediccion,
                        label: 'Predicción',
                        backgroundColor: 'rgba(235, 139, 150, 0.29)',
                        borderColor: 'rgba(238, 137, 149, 0.54)',
                        pointBackgroundColor: 'rgba(238, 137, 149, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                        fill: 'origin',
                    },
                    
                ],
                labels: labels,},
                options:{
                    responsive: true,
                    elements: {
                      line: {
                        tension: 0.5,
                      },
                    },
                    scales: {
                      // We use this empty structure as a placeholder for dynamic theming.
                      y: {
                        title: {
                            display: true,
                            text: `Dolares`, // Etiqueta para el eje Y
                          }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Tiempo', // Etiqueta para el eje X
                        }
                      },
                    },
                    plugins: {
                      datalabels: {
                        anchor: 'end',
                        align: 'end',
                        offset: -5
                      }
                    },
                  },
                resumenDatos
            };
        }catch(error) {
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
    async getDataTrendSalesPlate(fechaDesde: string, fechaHasta: string, platoId: number, frecuencia: string = 'w') {
        try {
            let labels:any=[];
            // Validar el rango de fechas
            const esRangoValido = await this.validator.validateRangeDates(fechaDesde, fechaHasta);
            if (!esRangoValido) {
                let errorMessage=`The specified date range is invalid or has no data.` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            // Obtener nombre del plato
            const plato = await this.repositoryPlato.getById(platoId);
            if (!plato) {
                let errorMessage=`Plate with ID ${platoId} not found.` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            // Obtener todas las fechas en el rango
            const fechas = await this.repositoryFecha.getAll();
            const fechasFiltradas = fechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            let datosVentas: number[] = [];
            let resumenDatos:any=[]

            if(frecuencia === 'w'){
                labels = fechasFiltradas.map(fecha => fecha.fecha);
           }

            // Obtener y procesar ventas para cada fecha
            for (const fecha of fechasFiltradas) {
                const ventasEnFecha = await this.repositoryVentas.getAllByField('fecha_id', fecha.fecha_id);
                const ventaDelPlato = ventasEnFecha.find(venta => venta.plato_id === platoId);
                if(frecuencia === 'w'){
                    if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                        this.agregarTendenciaVentasMes(resumenDatos,fecha.fecha,Number(ventaDelPlato.unidades_vendidas),(Number(plato.precio)));
                    }

                    labels=resumenDatos.map((item:any)=> item.fecha)
                    datosVentas = resumenDatos.map((item:any)=> item.cantidad_real)
                }else if(frecuencia === 'm' && fecha.mes !== undefined){
                    const nombreMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][fecha.mes - 1];

                    if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                        this.agregarTendenciaVentasMes(resumenDatos,nombreMes,Number(ventaDelPlato.unidades_vendidas),(Number(plato.precio)));
                    }

                    labels=resumenDatos.map((item:any)=> item.fecha)
                    datosVentas = resumenDatos.map((item:any)=> item.cantidad_real)
                }else{
                    const anio = fecha.anio || 0

                    if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                        this.agregarTendenciaVentasMes(resumenDatos,anio,Number(ventaDelPlato.unidades_vendidas),(Number(plato.precio)));
                    }

                    labels=resumenDatos.map((item:any)=> item.fecha)
                    datosVentas = resumenDatos.map((item:any)=> item.cantidad_real)
                }
                
            }

            if( datosVentas.length === 0 || labels.length === 0){
                let errorMessage=`No data found` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            let message=`information has been returned correctly to graph the sales trend` 
            this.log.addLog(message,'Apitransaccional','Módulo visualizacion de datos')
            return{ datos:{
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
            },
            resumenDatos
        };
        } catch (error) {
            throw error;
        }
    }

    async getDataTrendSalesPlategeneral(fechaDesde: string, fechaHasta: string, frecuencia: string = 'w') {
        try {
            let labels:any=[];
            // Validar el rango de fechas
            const esRangoValido = await this.validator.validateRangeDates(fechaDesde, fechaHasta);
            if (!esRangoValido) {
                let errorMessage=`The specified date range is invalid or has no data.` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            // Obtener nombre del plato
            const platos = await this.repositoryPlato.getAll();
            if (!platos) {
                let errorMessage=`Plates does not exist.` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            // Obtener todas las fechas en el rango
            const fechas = await this.repositoryFecha.getAll();
            const fechasFiltradas = fechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            let datosVentas: number[] = [];
            let resumenDatos:any=[]

            if(frecuencia === 'w'){
                labels = fechasFiltradas.map(fecha => fecha.fecha);
           }

            // Obtener y procesar ventas para cada fecha
            for (const fecha of fechasFiltradas) {
                const ventasEnFecha = await this.repositoryVentas.getAllByField('fecha_id', fecha.fecha_id);
                platos.forEach((plato:any)=>{
                    const ventaDelPlato = ventasEnFecha.find(venta => venta.plato_id === plato.plato_id);
                if(frecuencia === 'w'){
                    if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                        this.agregarTendenciaVentasMes(resumenDatos,fecha.fecha,Number(ventaDelPlato.unidades_vendidas),(Number(plato.precio)));
                    }

                    labels=resumenDatos.map((item:any)=> item.fecha)
                    datosVentas = resumenDatos.map((item:any)=> item.cantidad_real)
                }else if(frecuencia === 'm' && fecha.mes !== undefined){
                    const nombreMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][fecha.mes - 1];

                    if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                        this.agregarTendenciaVentasMes(resumenDatos,nombreMes,Number(ventaDelPlato.unidades_vendidas),(Number(plato.precio)));
                    }

                    labels=resumenDatos.map((item:any)=> item.fecha)
                    datosVentas = resumenDatos.map((item:any)=> item.cantidad_real)
                }else{
                    const anio = fecha.anio || 0

                    if( ventaDelPlato !== undefined && ventaDelPlato.unidades_vendidas !== undefined){
                        this.agregarTendenciaVentasMes(resumenDatos,anio,Number(ventaDelPlato.unidades_vendidas),(Number(plato.precio)));
                    }

                    labels=resumenDatos.map((item:any)=> item.fecha)
                    datosVentas = resumenDatos.map((item:any)=> item.cantidad_real)
                }
                })
                
                
            }

            if( datosVentas.length === 0 || labels.length === 0){
                let errorMessage=`No data found` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            let message=`information has been returned correctly to graph the sales trend` 
            this.log.addLog(message,'Apitransaccional','Módulo visualizacion de datos')
            return{ datos:{
                datasets: [
                    {
                        data: datosVentas,
                        label: 'GENERAL',
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
            },
            resumenDatos
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
                let errorMessage=`Product with ID ${productoBodegaId} not found.` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }

            const infoLotes= await this.getInfoLotesByProductoBodega(productoBodegaId);

            let message=`information has been returned correctly to plot inventory status` 
            this.log.addLog(message,'Apitransaccional','Módulo visualizacion de datos')

            return{
                datos: {
                    labels: [producto.nombre_producto],
                    datasets: [
                        { data: [producto.cantidad_maxima || 0], label: 'Cantidad Máxima' },
                        { data: [producto.cantidad_actual || 0], label: 'Cantidad Actual' },
                    ],
                },infoLotes
            };
        } catch (error) {
            console.error('Error obtaining product inventory data:', error);
            let errorMessage=`Error obtaining product inventory data: ${error}` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
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

            if(ordenesEnRango.length === 0) {
                let errorMessage=`No data found` 
                this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')
                throw new Error(errorMessage);
            }
            // Contar órdenes según criterios
            const creadosManualmente = ordenesEnRango.filter(orden => orden.modo_creacion === 'Manual').length;
            const aprobadosSinModificaciones = ordenesEnRango.filter(orden => orden.modo_creacion === 'Automatico' && !orden.estado_edicion && (orden.estado === 'Aprobado' || orden.estado === 'Enviado' ||orden.estado === 'Recibido')).length;
            const editadosYAprobados = ordenesEnRango.filter(orden => orden.modo_creacion === 'Automatico' && orden.estado_edicion &&  (orden.estado === 'Aprobado' || orden.estado === 'Enviado' ||orden.estado === 'Recibido')).length;
            const cancelados = ordenesEnRango.filter(orden => orden.estado === 'Cancelado').length;

            let errorMessage=`information has been returned correctly for plotting the order summary` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo visualizacion de datos')

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

            let yearsBetween = [];

            let currentYear = oldestDate.getFullYear();
            const endYear = mostRecentDate.getFullYear();

            while (currentYear <= endYear) {
                yearsBetween.push(currentYear);
                currentYear++;
            }


            return {
                yearsBetween
            };
        } catch (error) {
            throw new Error(`Error in obtaining the oldest and most recent dates: ${error}`);
        }
    }




    private agregarOModificarPrediccion(arreglo: any[], fecha: string,cantidad_predicha:number,precio_provee:number): void {
        const indice = arreglo.findIndex(item => item.fecha === fecha);
    
        if (indice !== -1) {
            // Si el mes ya existe, suma la cantidad
            arreglo[indice].cantidad_predicha += Number(cantidad_predicha);
            arreglo[indice].valor_estimado = Number(arreglo[indice].cantidad_predicha) *Number(precio_provee);
        } else {
            // Si el mes no existe, agrega un nuevo objeto al arreglo
            arreglo.push({fecha,cantidad_predicha:Number(cantidad_predicha),valor_estimado:(Number(cantidad_predicha)*Number(precio_provee))});
        }
    }


    private agregarTendenciaVentasMes(arreglo: any[], fecha:number|string, cantidad_real: number,precio_plato:number): void {
        const indice = arreglo.findIndex(item => item.fecha == fecha);
    
        if (indice !== -1) {
            // Si el mes ya existe, suma la cantidad
            arreglo[indice].cantidad_real += cantidad_real;
            arreglo[indice].valor_Real =arreglo[indice].cantidad_real*precio_plato;
        } else {
            // Si el mes no existe, agrega un nuevo objeto al arreglo
            arreglo.push({fecha, cantidad_real: cantidad_real,valor_Real:(cantidad_real*precio_plato)});
        }
    }

    async getInfoLotesByProductoBodega(productoBodegaId: number) {
        try {
            // Obtener información del producto en bodega
            const producto = await this.repositoryProductosBodega.getById(productoBodegaId);
            if (!producto) {
                throw new Error(`Producto con ID ${productoBodegaId} no encontrado.`);
            }
    
            // Obtener información del proveedor
            const proveedor = await this.repositoryProveedor.getById(producto.proveedor_id);
            if (!proveedor) {
                throw new Error(`Proveedor con ID ${producto.proveedor_id} no encontrado.`);
            }
    
            // Obtener información del peso
            const peso = await this.repositoryPeso.getById(producto.peso_proveedor_id);
            if (!peso) {
                throw new Error(`Información de peso para el producto con ID ${producto.peso_proveedor_id} no encontrada.`);
            }
    
            // Obtener todos los lotes asociados al producto
            const lotes = await this.repositoryLotes.getAllByField('producto_bodega_id', productoBodegaId);
    
            // Ordenar los lotes por fecha de vencimiento, desde el más próximo a caducar
            const lotesOrdenados = lotes.sort((a, b) => {
                const fechaA = new Date(a.fecha_vencimiento).getTime();
                const fechaB = new Date(b.fecha_vencimiento).getTime();
                return fechaA - fechaB;
            });
            
    
            // Formatear la información de los lotes
            const infoLotes = lotesOrdenados.map(lote => {
                return {
                    idLote: lote.lote_id,
                    cantidad: `${lote.cantidad} ${peso.simbolo}`,
                    fechaExpiracion: lote.fecha_vencimiento,
                    nombreProveedor: proveedor.nombre_proveedor
                };
            });
    
            return infoLotes;
        } catch (error) {
            throw error;
        }
    }

    sortByDate(arr:any) {
        const meses:any = {
            "Enero": 1, "Febrero": 2, "Marzo": 3, "Abril": 4, "Mayo": 5, "Junio": 6,
            "Julio": 7, "Agosto": 8, "Septiembre": 9, "Octubre": 10, "Noviembre": 11, "Diciembre": 12
        };
    
        return arr.slice().sort((a:any, b:any) => {
            const [mesA, anioA] = a.fecha.split('-');
            const [mesB, anioB] = b.fecha.split('-');
            return (anioA - anioB) || (meses[mesA] - meses[mesB]);
        });
    }

    async saveDatapredictDemand(data:any){
        try {
            const resp = await this.repositoryPrediccion.create(data)
            return resp
            
        } catch (error) {
            throw new Error(`error while managing the prediction analysis information: ${error}`);
        }
    }

    async getAllAnalisis(){
        try {
            const resp = await this.repositoryPrediccion.getAll()
            const newResp = resp.map((analisis:any)=>{
                const { ['info']: _, ...restoDelObjeto } = analisis;
                return restoDelObjeto;
            })

            newResp.forEach((analisis:any)=>{
                analisis.selected=false
                analisis.disabled=false

            })
            return newResp
            
        } catch (error) {
            throw new Error(`error while managing the prediction analysis information: ${error}`);
        }
    }

    async doAnalisis(listIds:any[]){
        try {
            console.log(listIds)
            let labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            let analisisList = [];
            let datasets:any=[];
            let resumenDatos:any=[];

            let cont=1;

            for (const id of listIds) {
                const analisis = await this.repositoryPrediccion.getById(Number(id));
                if (!analisis) {
                    let errorMessage = `No existe análisis ${id}`;
                    this.log.addLog(errorMessage, 'Apitransaccional', 'Módulo visualización de datos');
                    throw new Error(errorMessage);
                }
                analisis.info=JSON.parse(analisis.info).resumenDatos
                analisisList.push(analisis);
            }
            
            analisisList.sort((a, b) => {
                let dateA:any = new Date(a.create_date);
                let dateB:any = new Date(b.create_date);
                return dateA - dateB;
            });

            analisisList.forEach((analisis:any)=>{
                let obj:any={}
                obj.data=[]

                analisis.info.forEach((element:any) => {
                    const mes = element.fecha.split('-')[0];
                    if(cont==1){
                        this.agruparAnalisisPrediccion(resumenDatos,mes,element.valor_estimado)
                    }else{
                        this.agruparAnalisisPrediccion(resumenDatos,mes,0,element.valor_estimado)

                    }
                    obj.data.push(element.valor_estimado)
                });
                cont++
                obj.label=`${analisis.name}-${analisis.create_date}`
                datasets.push(obj)
            })

            resumenDatos.forEach((objeto:any) => {
                const variacionPorcentual = ((objeto.cant_b - objeto.cant_a) / Math.abs(objeto.cant_a)) * 100;
                const variacionMonetaria = objeto.cant_b - objeto.cant_a;

                objeto.variacion_porcentual = variacionPorcentual;
                objeto.variacionMonetaria = variacionMonetaria;

            });
            
            // return analisisList
            return {
                datos:{
                    datasets,labels
                },resumenDatos,
                analisisList
            };
        } catch (error) {
            throw new Error(`Error al gestionar la información de análisis de predicción: ${error}`);
        }
    }


    private agruparAnalisisPrediccion(arreglo: any[], fecha: string,cant_a:number=0,cant_b:number=0): void {
        const indice = arreglo.findIndex(item => item.fecha === fecha);
    
        if (indice !== -1) {
            // Si el mes ya existe, suma la cantidad
            if(cant_a !=0){
                arreglo[indice].cant_a = Number(cant_a);
            }else{
                arreglo[indice].cant_b = Number(cant_b);
            }
        } else {
            // Si el mes no existe, agrega un nuevo objeto al arreglo
            arreglo.push({fecha,cant_a:Number(cant_a),cant_b:Number(cant_b)});
        }
    }


    
    
    
}