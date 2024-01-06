// config/inversify.config.ts
import 'reflect-metadata';
import { Container } from 'inversify';
import { PedidoAutomaticoService } from '../app/business/services/MAP/PedidosAutomaticosServices';
import { EmailNotificationObserver } from '../app/business/services/common/EmailNotificationObserver';
import { IngredientesServices } from '../app/business/services/MGPAAB/IngredientesServices';
import { PedidosServices } from '../app/business/services/MAP/PedidosServices';
import { PlatosServices } from '../app/business/services/MIPP/platoServices';
import { VisualizationManagerServices } from '../app/business/services/MVD/VisualizationManagerServices';
import { VentasServices } from '../app/business/services/common/ventasServices';
import { EmailService } from '../app/business/services/common/EmailServices';


const container = new Container();

container.bind<IngredientesServices>(IngredientesServices).toSelf().inSingletonScope();
container.bind<PlatosServices>(PlatosServices).toSelf().inSingletonScope();
container.bind<VisualizationManagerServices>(VisualizationManagerServices).toSelf().inSingletonScope();
container.bind<VentasServices>(VentasServices).toSelf().inSingletonScope();
container.bind<EmailService>(EmailService).toSelf().inSingletonScope();
container.bind<EmailNotificationObserver>(EmailNotificationObserver).toSelf();
container.bind<PedidosServices>(PedidosServices).toSelf().inSingletonScope();
container.bind<PedidoAutomaticoService>(PedidoAutomaticoService).toSelf().inSingletonScope();



export { container };
