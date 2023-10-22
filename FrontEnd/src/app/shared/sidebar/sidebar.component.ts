import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  public listMenu =[
    {
      id:0,
      name:'Dashboard',
      icon:'fa-tachometer-alt'
    },
    {
      id:1,
      name:'Menú',
      icon:'fa-utensils'
    },
    {
      id:2,
      name:'Bodega',
      icon:'fa-boxes'
    },
    {
      id:3,
      name:'Proveedores',
      icon:'fa-truck-loading'
    },
    {
      id:4,
      name:'Pedido',
      icon:'fa-shopping-cart'
    },
  ]

  // Esta variable almacena el ítem activo
  public activeItem: number | null = null;

  // Método para cambiar el ítem activo
  setActive(index: number) {
    this.activeItem = index;
  }

}
