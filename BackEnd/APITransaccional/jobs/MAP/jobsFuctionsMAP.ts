
import cron from 'node-cron';
import { PedidoAutomaticoService } from '../../app/business/services/MAP/PedidosAutomaticosServices';
import dotenv from 'dotenv';
import { container } from '../../config/inversify.config';
import { PedidosServices } from '../../app/business/services/MAP/PedidosServices';
dotenv.config();

const  TIMECREATEAUTOMATICORDERS:string = process.env.TIMECREATEAUTOMATICORDERS || '';
const  TIMESENDAPPROVEDORDERS:string = process.env.TIMESENDAPPROVEDORDERS || '';


/**
 * Sets up a cron job for automatically creating orders at a specific time.
 * 
 * @param pedidosServices - The instance of PedidoAutomaticoService used to create automatic orders.
 */
export function setupCrearPedidosAutomaticosJob() {
    const pedidosServices =  container.get<PedidoAutomaticoService>(PedidoAutomaticoService);
    cron.schedule(TIMECREATEAUTOMATICORDERS, async () => {  // Ejemplo: todos los días a las 10 PM
        console.log('Running the cron job to create automatic orders');
        
        try {
            const dateSpecific = new Date().toISOString(); // O la fecha específica que necesitas
            await pedidosServices.createAutomaticOrders(dateSpecific);
            console.log('Automatic orders successfully created');
        } catch (error) {
            console.error('Error in the cron job to create automatic orders:', error);
        }
    });
}


export function sendApprovedOrdersJob() {
    const pedidosServices =  container.get<PedidosServices>(PedidosServices);
    cron.schedule(TIMESENDAPPROVEDORDERS, async () => {  // Ejemplo: todos los días a las 10 PM
        console.log('Running the cron job to send approved orders');
        
        try {
            await pedidosServices.processAndNotifyApprovedOrders();
            console.log('approved orders were sent correctly');
        } catch (error) {
            console.error('Error in the cron job to send approved orders:', error);
        }
    });
}

