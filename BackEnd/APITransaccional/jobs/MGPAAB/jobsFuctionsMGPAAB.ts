// jobs/expiredLotesJob.ts

import cron from 'node-cron';
import { IngredientesServices } from '../../app/business/services/MGPAAB/IngredientesServices';

/**
 * Sets up a cron job to identify and log expired lots.
 *
 * @param ingredientesServices - The instance of IngredientesServices used for the job.
 */
export function setupExpiredLotesJob(ingredientesServices: IngredientesServices) {
    cron.schedule('0 22 * * *', async () => {
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
    cron.schedule('0 22 * * *', async () => {
        console.log('Running the cron job for expiring batches');
        try {
            const expiredLotes = await ingredientesServices.getLotestoExpire(2);
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
    cron.schedule('0 22 * * *', async () => {
        console.log('Running the cron job for products close to or below minimum');
        try {
            const difference = 5;
            const productsNearOrBelowMinimum = await ingredientesServices.getProductsNearOrBelowMinimum(difference);
            console.log('Products near or below the minimum:', productsNearOrBelowMinimum);
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
    cron.schedule('0 22 * * *', async () => {
        console.log('Running the cron job for products close to or above maximum');
        try {
            const difference = 5;
            const productsNearOrAboveMaximum = await ingredientesServices.getProductsNearOrAboveMaximum(difference);
            console.log('Products near or above the maximum:', productsNearOrAboveMaximum);
            // Lógica adicional para productos cerca o por encima del máximo
        } catch (error) {
            console.error('Error in the cron job of products near or above the maximum:', error);
        }
    });
}


