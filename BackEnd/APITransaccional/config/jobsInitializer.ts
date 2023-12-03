// config/jobsInitializer.ts

import { PedidoAutomaticoService } from '../app/business/services/MAP/PedidosAutomaticosServices';
import { IngredientesServices } from '../app/business/services/MGPAAB/IngredientesServices';
import { setupCrearPedidosAutomaticosJob } from '../jobs/MAP/jobsFuctionsMAP';
import { setupExpiredLotesJob, setupLotestoExpireJob, setupProductsMaximumJob, setupProductsMinimumJob } from '../jobs/MGPAAB/jobsFuctionsMGPAAB';
// Importa otros cron jobs aquí

/**
 * Initializes and starts various cron jobs for the application.
 */
export function initializeJobs(): void {
    const ingredientesServices = new IngredientesServices();
    const pedidosAutomaticosServices = new PedidoAutomaticoService();


    setupExpiredLotesJob(ingredientesServices);
    setupLotestoExpireJob(ingredientesServices)
    setupProductsMinimumJob(ingredientesServices)
    setupProductsMaximumJob(ingredientesServices)
    setupCrearPedidosAutomaticosJob(pedidosAutomaticosServices)
    // Inicia otros cron jobs aquí
}
