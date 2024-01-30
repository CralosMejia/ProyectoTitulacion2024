import { injectable } from "inversify";
import { EntrieRepository } from "../../../../data/repository/entrieRepository";
import { logsapp } from "../../../../data/models/RestaurantePacificoDB/logsapp";
// Asumiendo que tienes un modelo definido para LogsApp

@injectable()
export class LoggerService {
    private readonly repositoryLogsApp: EntrieRepository<logsapp>;

    constructor() {
        this.repositoryLogsApp = new EntrieRepository(logsapp);
    }

    /**
     * Agrega un nuevo log a la base de datos.
     * 
     * @param description - La descripción del log.
     * @param sistema - El sistema donde se generó el log.
     * @param modulo - El módulo donde se generó el log.
     */
    async addLog(description: string, sistema: string, modulo: string): Promise<logsapp> {
        const newLog: any = {
            log_description: description,
            fecha_log: new Date(), // Fecha actual
            sistema: sistema,
            modulo: modulo
        };
        return await this.repositoryLogsApp.create(newLog);
    }
}
