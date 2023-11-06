import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Mis modulos
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { BodegaComponent } from './bodega/bodega.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PlatoComponent } from './menu/plato/plato.component';
import { AgregarPedidoComponent } from './pedidos/agregar-pedido/agregar-pedido.component';
import { PrediccionDemandaComponent } from './dashboard/grafics/prediccion-demanda/prediccion-demanda.component';

//<odulos externos
import { TendenciaVentasComponent } from './dashboard/grafics/tendencia-ventas/tendencia-ventas.component';
import { NgChartsModule } from 'ng2-charts';
import { AlmacenamientoComponent } from './dashboard/grafics/almacenamiento/almacenamiento.component';
import { InformacionPedidosComponent } from './dashboard/grafics/informacion-pedidos/informacion-pedidos.component';




@NgModule({
  declarations: [
    ProveedoresComponent,
    BodegaComponent,
    DashboardComponent,
    MenuComponent,
    PedidosComponent,
    PlatoComponent,
    AgregarPedidoComponent,
    PrediccionDemandaComponent,
    TendenciaVentasComponent,
    AlmacenamientoComponent,
    InformacionPedidosComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports:[
    ProveedoresComponent,
    BodegaComponent,
    DashboardComponent,
    MenuComponent,
    PedidosComponent,
    PlatoComponent,
    AgregarPedidoComponent
  ]
})
export class PagesModule { }
