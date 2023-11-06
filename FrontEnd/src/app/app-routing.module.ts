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

const routes: Routes = [
  {path:'', redirectTo:'/bodega', pathMatch:'full'},
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'bodega', component: BodegaComponent },
  { path: 'dashboard', component: DashboardComponent },
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
