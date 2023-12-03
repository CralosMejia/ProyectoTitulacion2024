
import cron from 'node-cron';
import { PedidoAutomaticoService } from '../../app/business/services/MAP/PedidosAutomaticosServices';
import dotenv from 'dotenv';
import { container } from '../../config/inversify.config';
dotenv.config();

const  TIME:string = process.env.TIMECREATEAUTOMATICORDERS || '';

/**
 * Sets up a cron job for automatically creating orders at a specific time.
 * 
 * @param pedidosServices - The instance of PedidoAutomaticoService used to create automatic orders.
 */
export function setupCrearPedidosAutomaticosJob() {
    const pedidosServices =  container.get<PedidoAutomaticoService>(PedidoAutomaticoService);
    cron.schedule(TIME, async () => {  // Ejemplo: todos los días a las 10 PM
        console.log('Running the cron job to create automatic orders');
        
        try {
            //const fechaEspecifica = new Date().toISOString(); // O la fecha específica que necesitas
            await pedidosServices.createAutomaticOrders('2023-01-01');
            console.log('Automatic orders successfully created');
        } catch (error) {
            console.error('Error in the cron job to create automatic orders:', error);
        }
    });
}
