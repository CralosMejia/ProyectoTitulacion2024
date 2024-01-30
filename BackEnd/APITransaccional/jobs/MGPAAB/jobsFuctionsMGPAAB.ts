// jobs/expiredLotesJob.ts

import cron from 'node-cron';
import { IngredientesServices } from '../../app/business/services/MGPAAB/IngredientesServices';
import dotenv from 'dotenv';
// import { addDays, startOfWeek } from 'date-fns';


dotenv.config();

const  TIMELOTESEXPIRED:string = process.env.TIMELOTESEXPIRED || '';
const  TIMELOTESTOEXPIRED:string = process.env.TIMELOTESTOEXPIRED || '';
const  TIMEDIFMINORMAX:string = process.env.TIMEDIFMINORMAX || '';



/**
 * Sets up a cron job to identify and log expired lots.
 *
 * @param ingredientesServices - The instance of IngredientesServices used for the job.
 */
export function setupExpiredLotesJob(ingredientesServices: IngredientesServices) {
    cron.schedule(TIMELOTESEXPIRED, async () => {
        console.log('Running the cron job for overdue batches');
        try {
            const expiredLotes = await ingredientesServices.getExpiredLotes();
            console.log('Expired lots:', expiredLotes);
        } catch (error) {
            console.error('Error when executing the cron job of expired batches:', error);
        }
    });
}

/**
 * Sets up a cron job to identify and log lots that are about to expire.
 *
 * @param ingredientesServices - The instance of IngredientesServices used for the job.
 */
export function setupLotestoExpireJob(ingredientesServices: IngredientesServices) {
    cron.schedule(TIMELOTESTOEXPIRED, async () => {
        console.log('Running the cron job for expiring batches');
        try {
            const expiredLotes = await ingredientesServices.getLotestoExpire();
            console.log('Lots to expire:', expiredLotes);
            // Aquí puedes agregar más lógica, como notificaciones o actualizaciones de estado
        } catch (error) {
            console.error('Error when executing the batch cron job to expire:', error);
        }
    });
}

/**
 * Sets up a cron job to identify and log products that are near or below their minimum stock level.
 *
 * @param ingredientesServices - The instance of IngredientesServices used for the job.
 */
export function setupProductsMinimumJob(ingredientesServices: IngredientesServices) {
    cron.schedule(TIMEDIFMINORMAX, async () => {
        console.log('Running the cron job for products close to or below minimum');
        try {
            const productsNearOrBelowMinimum = await ingredientesServices.getProductsNearOrBelowMinimum();
            if(productsNearOrBelowMinimum !== null){
                // console.log(productsNearOrBelowMinimum)
                // const hoy = new Date();
                // const proximoSabado = startOfWeek(addDays(hoy, 6));
        
                // console.log(proximoSabado.toISOString().slice(0, 10));
            }
            // Lógica adicional para productos cerca o por debajo del mínimo
        } catch (error) {
            console.error('Error in the cron job of products near or below the minimum:', error);
        }
    });
}

/**
 * Sets up a cron job to monitor and log products that are near or above their maximum stock levels.
 * 
 * @param ingredientesServices - An instance of IngredientesServices to interact with product data.
 */
export function setupProductsMaximumJob(ingredientesServices: IngredientesServices) {
    cron.schedule(TIMEDIFMINORMAX, async () => {
        console.log('Running the cron job for products close to or above maximum');
        try {
            const productsNearOrAboveMaximum = await ingredientesServices.getProductsNearOrAboveMaximum();
            console.log('Products near or above the maximum:', productsNearOrAboveMaximum);
            // Lógica adicional para productos cerca o por encima del máximo
        } catch (error) {
            console.error('Error in the cron job of products near or above the maximum:', error);
        }
    });
}


