// app/business/services/common/EmailNotificationObserver.ts
import { injectable } from 'inversify';
import { PedidoAutomaticoService } from '../MAP/PedidosAutomaticosServices';
import { Observer, Observable } from './Observable';
import { container } from '../../../../config/inversify.config';
import { EmailService } from './EmailServices';
import { IngredientesServices } from '../MGPAAB/IngredientesServices';
import dotenv from 'dotenv';
import { PedidosServices } from '../MAP/PedidosServices';
dotenv.config();


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
        try {
            if (observable instanceof PedidoAutomaticoService) {
                // Enviar notificación de pedido
                let detallesPedidoHTML =  `
                                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                    <thead>
                                    <tr>
                                        <th style="border: 1px solid #ddd; background-color: #f2f2f2; padding: 8px; text-align: left;">Nombre del Producto</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad necesaria</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Precio Proveedor</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valor</th>
                                    </tr>
                                    </thead>
                                    <tbody>`;
                data.orderDetails.forEach((detail:any) => {
                    detallesPedidoHTML += `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.productInfo.nombre_producto}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.cantidad_necesaria} ${detail.pesoInfo.simbolo}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.productInfo.precio_proveedor}$</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${(detail.cantidad_necesaria * detail.productInfo.precio_proveedor).toFixed(2)}$</td>

                        </tr>
                    `;
                });
                detallesPedidoHTML += `</tbody>
                </table>
    `
                const mail =await this.emailServ.sendEmail(
                    process.env.ADMIN_MAIL || '',
                    'Orden automatica creada',
                    'Se ha creado una orden automatica',
                    `
                        <h1>Se ha creado una orden automatica</h1>
                        <h3>Numero de orden: ${data.order.orden_id}</h3>
                        <h3>Estado de la orden: ${data.order.estado}</h3>
                        <h3>Fecha de creacion: ${data.order.fecha_orden}</h3>
                        <h3>Fecha estimada de recepción: ${data.order.fecha_estimada_recepcion}</h3>
                        <h3>Valor total de la orden: ${data.order.total}$</h3>
                        <h3>Detalles del pedido</h3>
                        ${detallesPedidoHTML}
                        

                    `
                )
                if(mail !== null) console.log("mail sent successfully")
    
            }else if (observable instanceof IngredientesServices) {
                //Enviar notificación de venta
                 if(data.type === 'ExpiredLotes'){
                    const lotesExpired: any[] = data.detailedExpiredLotes as any[];
                    let lotesExpiredHTML = '<ul style="list-style-type:none;">';
                    lotesExpired.forEach((detail:any)=>{
                        lotesExpiredHTML+=`
                            <li>
                                <strong>${detail.nombreProducto}</strong>:
                                Cantidad: ${detail.cantidad} ${detail.unidadPeso},
                            </li>
                        `
    
                    })
                    const mail =await this.emailServ.sendEmail(
                        process.env.ADMIN_MAIL || '',
                        'Lotes caducados',
                        'Listado de lotes que estan caducados y eliminados del sistema:',
                        `
                            <h1>Lotes caducados</h1>
                            <h3>lotes que estan caducados y eliminados del sistema</h3>
                            ${lotesExpiredHTML}
                        `
                    )
    
                    if(mail !== null) console.log("mail sent successfully")
    
    
                }else if(data.type === 'LotesToExpired'){
    
                    const lotesExpired: any[] = data.detailedExpiredLotes as any[];
                    let lotesExpiredHTML = '<ul style="list-style-type:none;">';
                    lotesExpired.forEach((detail:any)=>{
                        lotesExpiredHTML+=`
                            <li>
                                <strong>${detail.nombreProducto}</strong>:
                                Cantidad: ${detail.cantidad} ${detail.unidadPeso},
                            </li>
                        `
    
                    })
                    const mail =await this.emailServ.sendEmail(
                        process.env.ADMIN_MAIL || '',
                        'Lotes por caducar',
                        `Listado de lotes que estan por caducar en ${process.env.DIFDAYSTOEXPIRED} dias`,
                        `
                            <h1>Lotes por caducar</h1>
                            <h3>lotes que estan por caducar en ${process.env.DIFDAYSTOEXPIRED} días</h3>
                            ${lotesExpiredHTML}
                        `
                    )
    
                    if(mail !== null) console.log("mail sent successfully")
    
                }else if(data.type === 'ProductsMinimun'){
                    const productsMinum: any[] = data.productsNearOrBelowMinimum  as any[];
                    let lotesExpiredHTML = `
                                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                                <thead>
                                                <tr>
                                                    <th style="border: 1px solid #ddd; background-color: #f2f2f2; padding: 8px; text-align: left;">Nombre del Producto</th>
                                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad Actual</th>
                                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad Mínima</th>
                                                </tr>
                                                </thead>
                                                <tbody>`;


                    productsMinum.forEach((detail:any)=>{
                        lotesExpiredHTML+=`
                                    <tr>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.nombre_producto}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.cantidad_actual}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.cantidad_minima}</td>
                                    </tr>
                        `
    
                    })
                    lotesExpiredHTML+=`</tbody>
                                </table>
                    `
                    const mail =await this.emailServ.sendEmail(
                        process.env.ADMIN_MAIL || '',
                        'Productos que ha superado el minimo',
                        ``,
                        lotesExpiredHTML
                    )
    
                    if(mail !== null) console.log("mail sent successfully")
                }
                
            }else if(observable instanceof PedidosServices){
                if(data.type==='notify'){
                    // Manejar notificación a proveedores
                    for (const [supplierId, details] of Object.entries(data.ordersBySupplier)) {
                        const detallesDelProveedor: any[] = details as any[];
                        // Supongamos que cada detalle contiene información del producto y del proveedor
                        let detallesProveedorHTML = `
                                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                            <thead>
                                            <tr>
                                                <th style="border: 1px solid #ddd; background-color: #f2f2f2; padding: 8px; text-align: left;">Nombre del Producto</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad Necesaria</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Precio estipulado</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">valor</th>

                                            </tr>
                                            </thead>
                                            <tbody>`;
                        detallesDelProveedor.forEach((detail: any) => {
                            detallesProveedorHTML += `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.productInfo.nombre_producto}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.cantidad_necesaria} ${detail.pesoInfo.simbolo}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${detail.productInfo.precio_proveedor}$</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${(detail.cantidad_necesaria * detail.productInfo.precio_proveedor).toFixed(2)}$</td>
    
                            </tr>
                        `;
                        });
                        detallesProveedorHTML += `</tbody>
                        </table>
            `
    
                        const supplierEmail = detallesDelProveedor.length > 0 ? detallesDelProveedor[0].supplierInfo.email : 'defaultemail@example.com';
                        const mail = await this.emailServ.sendEmail(
                            supplierEmail,
                            'Pedido para el restaurante Pacifico',
                            'Se ha enviado un pedido',
                            `
                                <h3>De acuerdo a lo estipulado en el contrato, el restaurante Pacifico receptara el pedido a mas tardar en la fecha: ${detallesDelProveedor[0].date}</h3>
                                <h3>Detalles del pedido para el proveedor ${detallesDelProveedor[0].supplierInfo.nombre_proveedor}</h3>
                                ${detallesProveedorHTML}
                            `
                        );
                        if (mail !== null) console.log("Mail sent successfully to supplier", supplierId);
                    }
     
                }else if(data.type==='NotRecived'){
                    const detailsnotRecived: any[] = data.detailedOrders as any[];
                    let lotesExpiredHTML = '<ul style="list-style-type:none;">';
                    detailsnotRecived.forEach((detail:any)=>{
                        lotesExpiredHTML+=`
                            <li>
                                <h4>Orden #${detail.orden_id}  Total de la orden:${detail.total}</h4>
                                <h5>Fecha de creación de la orden: ${detail.fecha_orden}</h5>
                                <h5>Fecha estimada de llegada: ${detail.fecha_estimada}</h5>
                                <h5>Productos que aun no han llegado:</h5>
                                <ol>
                            `
                            detail.detallesPendientes.forEach((prod:any) => {
                                lotesExpiredHTML+=`
                                <li>
                                    <strong>${prod.nombreProducto}</strong> - 
                                    Cantidad: ${prod.cantidad_necesaria} ${prod.unidadPeso}, 
                                    Proveedor: ${prod.nombreProveedor}$, 
                                </li>`
                            });
                            lotesExpiredHTML+=`</ol></li>`
    
                    })
                    lotesExpiredHTML+=`</ul>`
    
    
                        const mail = await this.emailServ.sendEmail(
                            process.env.ADMIN_MAIL || '',
                            'Pedidos que no han llegado',
                            'Estos Pedidos aun no han llegado',
                            `
                                <h1>Pedidos que no han llegado:</h1>
                                ${lotesExpiredHTML}
                                
                            `
                        );
                        if (mail !== null) console.log("Mail successfully sent to admin about the orders that have not arrived.");
                }
            }
            
        } catch (error) {
            throw error;
        }
        
        
    }
}
