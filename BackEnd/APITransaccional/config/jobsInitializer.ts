// config/jobsInitializer.ts

import { IngredientesServices } from '../app/business/services/MGPAAB/IngredientesServices';
import { setupCrearPedidosAutomaticosJob } from '../jobs/MAP/jobsFuctionsMAP';
import { setupExpiredLotesJob, setupLotestoExpireJob, setupProductsMaximumJob, setupProductsMinimumJob } from '../jobs/MGPAAB/jobsFuctionsMGPAAB';
import { container } from './inversify.config';
// Importa otros cron jobs aquí

/**
 * Initializes and starts various cron jobs for the application.
 */
export function initializeJobs(): void {
    const ingredientesServices = container.get<IngredientesServices>(IngredientesServices);

    setupExpiredLotesJob(ingredientesServices);
    setupLotestoExpireJob(ingredientesServices)
    setupProductsMinimumJob(ingredientesServices)
    setupProductsMaximumJob(ingredientesServices)
    setupCrearPedidosAutomaticosJob()
    // Inicia otros cron jobs aquí
}
