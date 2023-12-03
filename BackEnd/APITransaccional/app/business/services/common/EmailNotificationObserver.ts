// app/business/services/common/EmailNotificationObserver.ts
import { injectable } from 'inversify';
import { PedidoAutomaticoService } from '../MAP/PedidosAutomaticosServices';
import { Observer, Observable } from './Observable';
import { container } from '../../../../config/inversify.config';
import { EmailService } from './EmailServices';
import { IngredientesServices } from '../MGPAAB/IngredientesServices';

/**
 * Observer class for sending email notifications based on events in observables.
 */
@injectable()
export class EmailNotificationObserver implements Observer {
    private emailServ = container.get<EmailService>(EmailService)


    /**
     * The update method is called when an observable triggers an event.
     * 
     * @param observable - The observable instance that triggered the event.
     * @param data - The data associated with the event.
     */
    async update(observable: Observable, data: any): Promise<void> {
        console.log('funca')
        if (observable instanceof PedidoAutomaticoService) {
            // Enviar notificación de pedido
            const mail =await this.emailServ.sendEmail(
                'camh670@gmail.com',
                'Orden automatica creada',
                'Se ha creado una orden automatica',
                data
            )
            if(mail !== null) console.log("mail sent successfully")

        }else if (observable instanceof IngredientesServices) {
            //Enviar notificación de venta
            const mail =await this.emailServ.sendEmail(
                'camh670@gmail.com',
                'Lotes por caducar',
                'Listado de lotes que estan por caducar:',
                '<b>Este es un correo de prueba</b>'
            )
            if(mail !== null) console.log("mail sent successfully")
        }
        
    }
}
