import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MenuService } from 'src/app/services/communication/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public listMenu =[
    {
      id:0,
      name:'Dashboard',
      icon:'fa-tachometer-alt',
      url:'dashboard'
    },
    {
      id:1,
      name:'Menú',
      icon:'fa-utensils',
      url:'menu/listar/plato'
    },
    {
      id:2,
      name:'Bodega',
      icon:'fa-boxes',
      url:'bodega'
    },
    {
      id:3,
      name:'Proveedores',
      icon:'fa-truck-loading',
      url:'proveedores'
    },
    {
      id:4,
      name:'Pedidos',
      icon:'fa-shopping-cart',
      url:'pedidos/listar'
    },
  ]

  // Esta variable almacena el ítem activo
  public activeItem: number | null = null;

  private searchparameter = new Subject<string>();
  private searchparameter$ = this.searchparameter.asObservable();

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private menuSrv: MenuService
  ){}

  ngOnInit() {
    // Obtiene la URL actual
    const url = this.router.url;
    //this.setActive(2,'bodega')
  }

  // Método para cambiar el ítem activo
  setActive(index: number,url:string,name:string) {
    this.activeItem = index;
    this.navigateByURL(url,name)
  }

  navigateByURL(url:string,name:string){
    this.comunicateNavigation(url,name)
    this.router.navigate([url])

  }

  comunicateNavigation(routeUrl:string,name:string){
    this.menuSrv.changeurlNavigationParameter(routeUrl,name)
  }

}
