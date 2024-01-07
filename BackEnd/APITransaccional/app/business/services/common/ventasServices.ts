import { ventas } from "../../../data/models/RestaurantePacificoDB/ventas";
import { platos } from "../../../data/models/RestaurantePacificoDB/platos"; // Import the Platos model
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { inject, injectable } from "inversify";
import { ingredientesporplato } from "../../../data/models/RestaurantePacificoDB/ingredientesporplato";
import { lotes } from "../../../data/models/RestaurantePacificoDB/lotes";
import { LoggerService } from "./logs/LogsAPP";

/**
 * Service class for managing 'ventas' (sales) and related entities.
 */
@injectable()
export class VentasServices {
    private readonly repositoryVentas: EntrieRepository<ventas>;
    private readonly repositoryPlatos: EntrieRepository<platos>; // Repository for Platos
    private readonly repositoryIPP: EntrieRepository<ingredientesporplato>;
    private readonly repositoryLotes: EntrieRepository<lotes>;


    constructor(
        @inject(LoggerService) private log: LoggerService,
    ){
        this.repositoryVentas = new EntrieRepository(ventas);
        this.repositoryPlatos = new EntrieRepository(platos);
        this.repositoryIPP = new EntrieRepository(ingredientesporplato);
        this.repositoryLotes = new EntrieRepository(lotes);


    }

     /**
     * Adds multiple sales to the database.
     * Each sale includes the dish name, quantity, unit price, total price, and the week's start and end dates.
     * 
     * @param salesList - An array of objects, each representing a sale to be added.
     * @returns The result of the bulk creation operation, or an empty object if no sales were processed.
     */
    async addMultipleSales(salesList: Array<{
        nombre_plato: string,
        cantidad: number,
        precio_unitario: number,
        precio_total: number,
        fecha_inicio_semana: string,
        fecha_fin_semana: string
    }>) {
        try {
            let message=`Sales loading process has started` 
            this.log.addLog(message,'Apitransaccional','N/a')
            const ventasToInsert = [];

            for (const sale of salesList) {
                const platoId = await this.getPlatoIdByNombre(sale.nombre_plato);

                if (platoId !== null && !(await this.checkExistingSale(platoId, sale.fecha_inicio_semana))) {
                    const plato =await this.repositoryPlatos.getById(platoId)
                    if(plato === null || plato.numero_platos === undefined) throw new Error (`dish not found for ${platoId}`)

                    const ventaToAdd = {
                        plato_id: platoId,
                        cantidad: sale.cantidad,
                        precio_unitario: sale.precio_unitario,
                        precio_total: sale.precio_total,
                        fecha_inicio_semana: sale.fecha_inicio_semana,
                        fecha_fin_semana: sale.fecha_fin_semana
                    };

                    ventasToInsert.push(ventaToAdd);
                    await this.updateInventoryBySales(platoId, plato.numero_platos, sale.cantidad);
                } else {
                    console.error(`Existing sale  ${sale.nombre_plato}`);
                }
            }

            if (ventasToInsert.length > 0) {
                const results = await this.repositoryVentas.bulkCreate(ventasToInsert);
                let message=`Sales upload process has been completed, ${ventasToInsert.length} sales have been uploaded.` 
                this.log.addLog(message,'Apitransaccional','N/a')
                return results;
            } else {
                let message=`Sales could not be processed due to lack of matching plates or existing sales.` 
                console.log(message);
                this.log.addLog(message,'Apitransaccional','N/a')
                return {}
            }
        } catch (error) {
            console.error('Error when adding sales:', error);
            let message=`Error when adding sales:${error} ` 
            this.log.addLog(message,'Apitransaccional','N/a')
            throw error;
        }
    }

    // Método para actualizar el inventario en función de las ventas
    // ...otros miembros de la clase...

// Método para actualizar el inventario por cada venta
private async updateInventoryBySales(platoId: number,numeroPlato:number, cantidadVendida: number) {
    const ingredientes = await this.getDishIngredients(platoId);

    for (const ingrediente of ingredientes) {
        const cantidadNecesariaTotal = (ingrediente.cantidad_necesaria / numeroPlato) * cantidadVendida;
        await this.discountFromLots(ingrediente.producto_bodega_id, cantidadNecesariaTotal);
    }
}

// Método para obtener los ingredientes de un plato
private async getDishIngredients(platoId: number): Promise<any[]> {
    // Reemplaza esto con la lógica real para obtener los ingredientes de un plato
    // Aquí es solo un esquema
    const ingredientes = await this.repositoryIPP.getAllByField('plato_id', platoId);
    return ingredientes;
}

// Método para descontar de los lotes, empezando por el más cercano a vencer
private async discountFromLots(productoId: number, cantidad: number) {
    // Obtener todos los lotes del producto ordenados por fecha de vencimiento

    const lotes = await this.repositoryLotes.getAllByField('producto_bodega_id', productoId);
    lotes.sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime());

    for (const lote of lotes) {
        if (cantidad <= 0 ) break; // Si ya se descontó la cantidad necesaria, terminar

        if(lote.cantidad ===undefined) throw new Error('The amount does not exist')
        const cantidadADescontar = Math.min(lote.cantidad, cantidad);
        lote.cantidad -= cantidadADescontar;
        cantidad -= cantidadADescontar;

        // Actualizar el lote en la base de datos
        if (lote.cantidad === 0) {
            // Eliminar el lote si la cantidad es 0
            await this.repositoryLotes.delete(lote.lote_id);
        } else {
            // Actualizar la cantidad restante en el lote
            await this.repositoryLotes.updateSingleFieldById('lote_id', lote.lote_id, 'cantidad', lote.cantidad);
        }
    }
}



    /**
     * Retrieves the ID of a 'plato' (dish) by its name.
     * 
     * @param nombrePlato - The name of the dish.
     * @returns The ID of the dish if found, otherwise null.
     */
    private async getPlatoIdByNombre(nombrePlato: string): Promise<number | null> {
        const foundPlatos = await this.repositoryPlatos.getAllByField('nombre_plato', nombrePlato);
        if (foundPlatos.length > 0) {
            return foundPlatos[0].plato_id;
        }
        return null;
    }

    /**
     * Checks whether a sale for a specific dish already exists for a given end-of-week date.
     * 
     * @param platoId - The ID of the dish.
     * @param fechaInicioSemana - The end-of-week date.
     * @returns True if an existing sale is found, otherwise false.
     */
    private async checkExistingSale(platoId: number, fechaInicioSemana: string): Promise<boolean> {
        const existingSales = await this.repositoryVentas.getAllByField("fecha_inicio_semana", fechaInicioSemana);
        return existingSales.some(sale => sale.plato_id === platoId);
    }
}
