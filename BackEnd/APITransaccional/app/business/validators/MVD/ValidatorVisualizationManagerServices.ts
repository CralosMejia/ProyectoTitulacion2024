import { dimfecha } from "../../../data/models/DataScienceDB/dimfecha";
import { EntrieRepository } from "../../../data/repository/entrieRepository";

/**
 * Service class for validating date ranges for data visualization purposes.
 */
export class ValidatorVisualizationManagerServices{

    private repositoryFecha: EntrieRepository<dimfecha>;

    constructor() {
        this.repositoryFecha = new EntrieRepository(dimfecha);
    }

    /**
     * Validates whether the specified date range contains any data.
     * 
     * @param fechaDesde - The start date of the range.
     * @param fechaHasta - The end date of the range.
     * @returns True if the range contains data, false otherwise.
     * @throws An error if there's an issue accessing the data.
     */
    async validateRangeDates(fechaDesde: string, fechaHasta: string): Promise<boolean> {
        try {
            const fechas = await this.repositoryFecha.getAll();
            const fechasEnRango = fechas.filter(fecha => {
                const date = new Date(fecha.fecha);
                return date >= new Date(fechaDesde) && date <= new Date(fechaHasta);
            });

            return fechasEnRango.length > 0;
        } catch (error) {
            throw error;
        }
    }

}