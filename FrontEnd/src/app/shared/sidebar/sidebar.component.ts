import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MenuService } from 'src/app/services/communication/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public subMenuOpen:any = null;
  public listMenu:any =[
    

    {
      id:0,
      name:'Predicciones',
      icon:'fa-tachometer-alt',
      url:'dashboard',
      subMenu: [
        { name: 'Predicción de demanda de productos', url: 'dashboard/demanda',icon: 'fa-solid fa-chart-pie'},
        { name: 'Tendencia de ventas de platos', url: 'dashboard/tendenciaVentas',icon: 'fa-solid fa-money-bill' },
        { name: 'Estado de la bodega', url: 'dashboard/estadoBodega',icon: 'fa-solid fa-shop'},
        // { name: 'Información de los pedidos', url: 'dashboard/infoPedidos',icon: 'fa-solid fa-truck'},

        // ... más submenús si son necesarios
      ],
    },
    {
      id:5,
      name:'Comparación de predicciones',
      icon:' fa-magnifying-glass-chart',
      url:'dashboard/analisis'
    },
    {
      id:1,
      name:'Recetario',
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
    }
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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.getValueFromLocalStorage('index')!==null && this.getValueFromLocalStorage('url')!==null && this.getValueFromLocalStorage('name')!==null){
          this.activeItem=Number(this.getValueFromLocalStorage('index'))
          const name=this.getValueFromLocalStorage('name') || ''
          this.comunicateNavigation('',name)
        }else{
          this.setActive(2,'bodega','Bodega')
        }
      }
    });
    window.addEventListener('unload', function (event) {
      localStorage.removeItem("index");
      localStorage.removeItem("url");
      localStorage.removeItem("name");

    });
    
  }

  // Método para cambiar el ítem activo
  setActive(index: number|null,url:string|null,name:string|null) {
    if(index!==null&&url!==null && name !==null){
      this.activeItem = index;
      this.navigateByURL(url,name)
      localStorage.setItem('index', index.toString());
      localStorage.setItem('url', url);
      localStorage.setItem('name', name);
    }

  }

  navigateByURL(url:string,name:string){
    this.comunicateNavigation(url,name)
    this.router.navigate([url])

  }

  clickButton(index: number|null,url:string|null,name:string|null){
    
  }

  comunicateNavigation(routeUrl:string,name:string){
    this.menuSrv.changeurlNavigationParameter(routeUrl,name)
  }

  getValueFromLocalStorage(clave: string): string | null {
    return localStorage.getItem(clave);
  }

  toggleSubMenu(index: number) {
    this.activeItem = index;
    if (this.subMenuOpen === index) {
      this.subMenuOpen = null; // Si ya está abierto, ciérralo
    } else {
      this.subMenuOpen = index; // Si no, ábrelo
    }
  }
}
