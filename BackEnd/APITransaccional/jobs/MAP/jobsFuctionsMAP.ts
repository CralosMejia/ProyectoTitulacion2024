
import cron from 'node-cron';
import { PedidoAutomaticoService } from '../../app/business/services/MAP/PedidosAutomaticosServices';

/**
 * Sets up a cron job for automatically creating orders at a specific time.
 * 
 * @param pedidosServices - The instance of PedidoAutomaticoService used to create automatic orders.
 */
export function setupCrearPedidosAutomaticosJob(pedidosServices: PedidoAutomaticoService) {
    cron.schedule('0 22 * * 6', async () => {  // Ejemplo: todos los días a las 10 PM
        console.log('Running the cron job to create automatic orders');
        try {
            const fechaEspecifica = new Date().toISOString(); // O la fecha específica que necesitas
            await pedidosServices.createAutomaticOrders(fechaEspecifica);
            console.log('Automatic orders successfully created');
        } catch (error) {
            console.error('Error in the cron job to create automatic orders:', error);
        }
    });
}
