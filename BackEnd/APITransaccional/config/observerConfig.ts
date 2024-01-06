// config/observerConfig.ts

import { PedidoAutomaticoService } from "../app/business/services/MAP/PedidosAutomaticosServices";
import { PedidosServices } from "../app/business/services/MAP/PedidosServices";
import { IngredientesServices } from "../app/business/services/MGPAAB/IngredientesServices";
import { EmailNotificationObserver } from "../app/business/services/common/EmailNotificationObserver";
import { container } from "./inversify.config";


/**
 * Configures and attaches observers to observable services.
 * This setup allows for observers to be notified of changes or events in observables.
 */
export const configureObservers = () => {
    // Obtain instances of the observer and observables from the InversifyJS container
    const emailObserver = container.get<EmailNotificationObserver>(EmailNotificationObserver);
    const pedidosAutomaticosService = container.get<PedidoAutomaticoService>(PedidoAutomaticoService);
    const ingredientesService = container.get<IngredientesServices>(IngredientesServices);
    const pedidosServices =container.get<PedidosServices>(PedidosServices);

    // Subscribe the email observer to the PedidoAutomaticoService
    pedidosAutomaticosService.subscribe(emailObserver);
    // Subscribe the email observer to the IngredientesServices
    ingredientesService.subscribe(emailObserver);
    pedidosServices.subscribe(emailObserver)



};
