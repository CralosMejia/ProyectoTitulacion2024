import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { BodegaComponent } from './pages/bodega/bodega.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MenuComponent } from './pages/menu/menu.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { PlatoComponent } from './pages/menu/plato/plato.component';
import { AgregarPedidoComponent } from './pages/pedidos/agregar-pedido/agregar-pedido.component';
import { SettingsComponent } from './shared/settings/settings.component';
import { PrediccionDemandaComponent } from './pages/dashboard/grafics/prediccion-demanda/prediccion-demanda.component';
import { TendenciaVentasComponent } from './pages/dashboard/grafics/tendencia-ventas/tendencia-ventas.component';
import { AlmacenamientoComponent } from './pages/dashboard/grafics/almacenamiento/almacenamiento.component';
import { InformacionPedidosComponent } from './pages/dashboard/grafics/informacion-pedidos/informacion-pedidos.component';
import { AnalisiPrediccionDemandaComponent } from './pages/dashboard/grafics/analisi-prediccion-demanda/analisi-prediccion-demanda.component';

const routes: Routes = [
  {path:'', redirectTo:'/bodega', pathMatch:'full'},
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'bodega', component: BodegaComponent },
  { path: 'dashboard', children:[
    { path: 'demanda', component: PrediccionDemandaComponent },
    { path: 'tendenciaVentas', component: TendenciaVentasComponent },
    { path: 'estadoBodega', component: AlmacenamientoComponent },
    { path: 'infoPedidos', component: InformacionPedidosComponent },
    { path: 'analisis', component: AnalisiPrediccionDemandaComponent },


  ] },
  { path: 'menu', children:[
    { path: 'listar/plato', component: MenuComponent },
    { path: 'agregar/plato', component: PlatoComponent },
    { path: 'editar/plato', component: PlatoComponent },
  ] },
  { path: 'pedidos',children:[
    { path: 'listar', component: PedidosComponent },
    { path: 'agregar', component: AgregarPedidoComponent },
    { path: 'editar', component: AgregarPedidoComponent },
  ] },
  {path:'settings',component:SettingsComponent}
  






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
