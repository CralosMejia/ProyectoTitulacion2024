import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuService } from 'src/app/services/communication/menu.service';
import { SearchIngredienteService } from 'src/app/services/communication/searchs/search-ingrediente.service';
import { SearchPedidoService } from 'src/app/services/communication/searchs/search-pedido.service';
import { SearchPedidosService } from 'src/app/services/communication/searchs/search-pedidos.service';
import { SearchPlatoService } from 'src/app/services/communication/searchs/search-plato.service';
import { SearchProductService } from 'src/app/services/communication/searchs/search-product.service';
import { SearchProveedoresService } from 'src/app/services/communication/searchs/search-proveedores.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{

  public nameRoute:string=''
  public urlRoute:string=''

  placeHolder='Type here...'
  valueFilter=''

  filtros:any = [];

  filterSelected:any=0
  inputType='text'

  filtrosBodega=[
    {
      name:'Nombre',
      title:'nombre_producto',
      tipo:'text'
    },
    {
      name:'Cantidad en Existencia',
      title:'cantidad_actual',
      tipo:'number'
    },
    {
      name:'Cantidad Máxima Recomenda',
      title:'cantidad_maxima',
      tipo:'number'
    },
    {
      name:'Proveedor',
      title:'Proveedor',
      tipo:'text'
    },
    {
      name:'Precio',
      title:'precio_proveedor',
      tipo:'number'
    },
    {
      name:'Fecha de Vencimiento',
      title:'fecha_vencimiento',
      tipo:'date'
    },
  ,]

  filtrosRecetario=[
    {
      name:'Nombre',
      title:'nombre_plato',
      tipo:'text'
    },
    {
      name:'Precio',
      title:'precio',
      tipo:'number'
    },
    {
      name:'Cantidad de platos',
      title:'numero_platos',
      tipo:'number'
    },
    {
      name:'Estado',
      title:'estado',
      tipo:'text'
    },
    {
      name:'Ingrediente',
      title:'Ingrediente',
      tipo:'text'
    },
  ]

  filtrosIngrediente=[
    {
      name:'Ingrediente',
      title:'Ingrediente',
      tipo:'text'
    }
  ]

  filtrosProveedores=[
    {
      name:'Telefono',
      title:'telefono',
      tipo:'text'
    },
    {
      name:'Nombre',
      title:'nombre_proveedor',
      tipo:'text'
    },
    {
      name:'Correo',
      title:'email',
      tipo:'text'
    },
  ]

  filtrosPedidos=[
    {
      name:'Estado',
      title:'estado',
      tipo:'text'
    },
    {
      name:'Fecha de creación',
      title:'fecha_orden',
      tipo:'date'
    },
    
  ]

  filtrosPedido=[
    {
      name:'Nombre',
      title:'nombre_producto',
      tipo:'text'
    },
    {
      name:'Cantidad',
      title:'cantidad_necesaria',
      tipo:'number'
    },
    {
      name:'Peso',
      title:'unidad',
      tipo:'text'
    },
    {
      name:'Precio provedor',
      title:'precio_proveedor',
      tipo:'number'
    },
    {
      name:'Proveedor',
      title:'nombre_proveedor',
      tipo:'text'
    }
    
  ]

  constructor(
    private router:Router,
    private menuSrv: MenuService,
    private productSearch:SearchProductService,
    private platoSearch:SearchPlatoService,
    private ingredienteSearch:SearchIngredienteService,
    private proveedorSearch:SearchProveedoresService,
    private pedidosSearch:SearchPedidosService,
    private pedidoSearch:SearchPedidoService,




    

  ){}
  ngOnInit() {
    this.router.events.subscribe(event => {
      const url = this.router.url;
      if (event instanceof NavigationEnd) {
        this.menuSrv.geturlNavigationParameter$().subscribe((param:any)=>{
          this.nameRoute=this.formatTitle(param.name);
          this.urlRoute=url
          this.loadFilter()

        })
      }
    });
  }

  loadFilter(){
    // console.log(this.urlRoute)
    if (this.urlRoute === '/bodega') {
      this.filtros = this.filtrosBodega;
    } else if (this.urlRoute === '/menu/listar/plato') {
        this.filtros = this.filtrosRecetario;
    } else if (this.urlRoute.toLowerCase().startsWith("/menu/agregar/plato")) {
        this.filtros=this.filtrosIngrediente
    } else if(this.urlRoute==="/proveedores"){
      this.filtros = this.filtrosProveedores;
    }else if(this.urlRoute==="/pedidos/listar"){
      this.filtros = this.filtrosPedidos;
    }else if(this.urlRoute.toLowerCase().startsWith("/pedidos/agregar")){
      this.filtros = this.filtrosPedido;
    }

  }

  changeFilter(){
    const filter= this.filtros[this.filterSelected]
    this.inputType=filter.tipo
    if(this.inputType==='number') this.placeHolder='0'
    if(this.inputType==='text') this.placeHolder='Type here...'
    this.valueFilter=''

  }

  changeValueFilter(){

    const filter= this.filtros[this.filterSelected]
    if (this.urlRoute === '/bodega') {
      this.productSearch.changeSearchParameter(filter.title,this.valueFilter)
    } else if (this.urlRoute === '/menu/listar/plato') {
      this.platoSearch.changeSearchParameter(filter.title,this.valueFilter)
    } else if (this.urlRoute.toLowerCase().startsWith("/menu/agregar/plato")) {
        this.ingredienteSearch.changeSearchParameter(filter.title,this.valueFilter)
    } else if(this.urlRoute==="/proveedores"){
      this.proveedorSearch.changeSearchParameter(filter.title,this.valueFilter);
    }else if(this.urlRoute==="/pedidos/listar"){
      this.pedidosSearch.changeSearchParameter(filter.title,this.valueFilter)
    }else if(this.urlRoute.toLowerCase().startsWith("/pedidos/agregar")){
      this.pedidoSearch.changeSearchParameter(filter.title,this.valueFilter)
    }
  }

  formatTitle(cadena:string){
    // Obtiene la primera letra de la cadena
    const mayuscula = cadena.charAt(0).toUpperCase();

    return mayuscula + cadena.slice(1);
  }

  navigateToSettings(){
    this.menuSrv.changeurlNavigationParameter('/settings','Settings')
    this.router.navigate(['settings'])
  }
}
