import { ventas } from "../../../data/models/RestaurantePacificoDB/ventas";
import { platos } from "../../../data/models/RestaurantePacificoDB/platos"; // Import the Platos model
import { EntrieRepository } from "../../../data/repository/entrieRepository";

/**
 * Service class for managing 'ventas' (sales) and related entities.
 */
export class VentasServices {
    private readonly repositoryVentas: EntrieRepository<ventas>;
    private readonly repositoryPlatos: EntrieRepository<platos>; // Repository for Platos

    constructor(){
        this.repositoryVentas = new EntrieRepository(ventas);
        this.repositoryPlatos = new EntrieRepository(platos); // Initialize Platos repository
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
            const ventasToInsert = [];

            for (const sale of salesList) {
                const platoId = await this.getPlatoIdByNombre(sale.nombre_plato);

                if (platoId !== null && !(await this.checkExistingSale(platoId, sale.fecha_fin_semana))) {
                    const ventaToAdd = {
                        plato_id: platoId,
                        cantidad: sale.cantidad,
                        precio_unitario: sale.precio_unitario,
                        precio_total: sale.precio_total,
                        fecha_inicio_semana: sale.fecha_inicio_semana,
                        fecha_fin_semana: sale.fecha_fin_semana
                    };

                    ventasToInsert.push(ventaToAdd);
                } else {
                    console.error(`Existing sale or dish not found for ${sale.nombre_plato}`);
                }
            }

            if (ventasToInsert.length > 0) {
                const results = await this.repositoryVentas.bulkCreate(ventasToInsert);
                return results;
            } else {
                console.log("Sales could not be processed due to lack of matching plates or existing sales.");
                return {}
            }
        } catch (error) {
            console.error('Error when adding sales:', error);
            throw error;
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
     * @param fechaFinSemana - The end-of-week date.
     * @returns True if an existing sale is found, otherwise false.
     */
    private async checkExistingSale(platoId: number, fechaFinSemana: string): Promise<boolean> {
        const existingSales = await this.repositoryVentas.getAllByField("fecha_fin_semana", fechaFinSemana);
        return existingSales.some(sale => sale.plato_id === platoId);
    }
}
