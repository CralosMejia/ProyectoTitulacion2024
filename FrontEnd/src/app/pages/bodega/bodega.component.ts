import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { isFormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BodegaService } from 'src/app/services/bodega.service';
import { SearchProductService } from 'src/app/services/communication/searchs/search-product.service';
import { PlatosService } from 'src/app/services/platos.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {

  @Output() eventFather = new EventEmitter<any>();

  //general attributes
  public listProductsWithAllInfo!:any[];
  public pesoList!:any[]
  public proveedoresList!:any[]

  public productoSeleccionado: number=1;



  //Visual Attributes
  public buttonState:string='createProducto'
  public NameButton:string = 'Crear nuevo producto'

  //ATTIBUTES TO LOTE
  //Create
  public isLote= false
  public valueFiltro:string='Producto'
  public listProductosBodega:any[]=[]
  public idLoteSelected!:number
  public quantityNewLot:number=0;
  public dateNewLote!:string;
  //Edit
  public isLoteUpdate=false;

  //ATTIBUTES TO Producto
  //Create
  public minQuantityProd:number=0;
  public maxQuantityProd:number=0;
  public pesoSeleccionado: number=1;
  public provSeleccionado:number=1
  public priceProv:number=0;
  public nameProd:string=''

  //edit
  public isProdUpdate=false




  options =['Producto','lote' ]

  constructor(
    private platoServices:PlatosService,
    private bodegaServices:BodegaService,
    private proveedorServices:ProveedoresService,
    private router:Router,
    private productSearch:SearchProductService


  ){}

  ngOnInit(): void {
    this.loaddata()
    this.productSearch.getSearchParameter$().subscribe((param:any)=>{
      this.bodegaServices.search(param).subscribe((resp:any)=>{
        if(param.paramSeacrh !==''){
          this.listProductsWithAllInfo= resp;
        }else{
          this.loaddata()
        }

      })
    })
  }

  loaddata(){
    this.platoServices.getAllProducts().subscribe((resp:any)=>{
      this.listProductosBodega= resp.entriesList;
    })
    this.bodegaServices.getAllInfoproducts().subscribe((resp:any)=>{
      this.listProductsWithAllInfo= resp;

    })
    this.platoServices.getAllPeso().subscribe((resp:any)=>{
      this.pesoList=resp.entriesList.filter((objeto:any) => objeto.tipo_uso === 'proveedor' || objeto.tipo_uso === 'ambos');
    })
    this.proveedorServices.getProv().subscribe((resp:any)=>{
      this.proveedoresList=resp.entriesList
    })
    this.cleanForm()
  }

  chageFilterLoteproducto(){
    this.valueFiltro==='Producto'?this.valueFiltro='lote':this.valueFiltro='Producto';
    this.buttonState==='createProducto'?this.buttonState='createLote':this.buttonState='createProducto';
    this.valueFiltro==='Producto'?this.isLote=false:this.isLote=true;
    this.chageNameButton()
    this.cleanForm()
  }
  
  toggleIcono(product:any) {
    product.isIconoX = !product.isIconoX;
  }

  addnewLote(){
    if(!this.validateLoteForm()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben ser rellenados, los campos numericos deben ser mayor a cero y la fecha debe ser mayor a la actual!"
      });
      return
    }
    const data = {
      "producto_bodega_id": this.productoSeleccionado,
      "fecha_vencimiento": this.dateNewLote,
      "cantidad": this.quantityNewLot
    }

    this.bodegaServices.addNewLote(data).subscribe(()=>this.loaddata())
    this.cancel()

  }

  updatelote(){
    if(!this.validateLoteForm()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben ser rellenados, los campos numericos deben ser mayor a cero y la fecha debe ser mayor a la actual!"
      });
      return
    }
    const data={
      "producto_bodega_id": this.productoSeleccionado,
      "cantidad": this.quantityNewLot,
      "fecha_vencimiento":this.dateNewLote
    }
    this.bodegaServices.updateLote(this.idLoteSelected,data).subscribe(()=>{
      this.loaddata()
      this.cancel()
    })
  }

  deleteLote(id:number){
    this.bodegaServices.deleteLote(id).subscribe(()=> this.loaddata())

  }

  createProd(){
    if(!this.validateProdForm()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben ser rellenados y los campos numericos deben ser mayor a cero!"
      });
      return
    }
    const data:any={
      "proveedor_id": this.provSeleccionado,
      "peso_proveedor_id": this.pesoSeleccionado,
      "nombre_producto": this.nameProd,
      "cantidad_minima": this.minQuantityProd,
      "cantidad_maxima": this.maxQuantityProd,
      "precio_proveedor": this.priceProv
    }

    this.bodegaServices.createProd(data).subscribe(()=>this.loaddata())
    this.cancel()

  }

  peparateToEditLote(idLote:number,amount:number,date:string,prodBodSelect:number){
    this.cancel()
    this.valueFiltro=='Nuevo Producto'
    this.chageFilterLoteproducto()
    this.valueFiltro=='Seleccionar'
    this.productoSeleccionado = prodBodSelect
    this.idLoteSelected=idLote
    this.quantityNewLot= amount
    this.dateNewLote=date
    this.isLoteUpdate=true
    this.buttonState='updateLote'
    this.chageNameButton()
  }

  preparateToEditProd(idProd:number,cantMin:number,cantMax:number,price:number,wigth:number,name:string,proveedor_id:string){
    this.cancel()
    this.minQuantityProd=cantMin
    this.maxQuantityProd=cantMax
    this.priceProv=price
    this.pesoSeleccionado=wigth
    this.isProdUpdate=true
    this.buttonState='updateProd'
    this.productoSeleccionado=idProd
    this.nameProd=name
    this.provSeleccionado=Number(proveedor_id)
    //agregar el prov
    this.chageNameButton()
  }

  updateProd(){
    if(!this.validateProdForm()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben ser rellenados y los campos numericos deben ser mayor a cero!"
      });
      return
    }
    const data:any={
      "peso_id": this.pesoSeleccionado,
      "cantidad_minima":this.minQuantityProd,
      "cantidad_maxima": this.maxQuantityProd,
      "precio_proveedor": this.priceProv,
      "nombre_producto":this.nameProd,
      "proveedor_id":this.provSeleccionado
      ,"peso_proveedor_id":this.pesoSeleccionado
    }
    this.bodegaServices.upodateProd(this.productoSeleccionado,data).subscribe(()=>{
      this.loaddata()
      this.cancel()
    })
  }

  handleButtonClick() {
    switch(this.buttonState){
      case 'createProducto':
        this.createProd()
        break;
      case 'createLote':
        this.addnewLote()
        break;
      case 'updateLote':
        this.updatelote()
        break;
      case 'updateProd':
        this.updateProd()
        break;

    }
  }

  private chageNameButton(){
    switch(this.buttonState){
      case 'createProducto':
        this.NameButton='Crear nuevo producto'
        break;
      case 'createLote':
        this.NameButton='Crear nuevo lote'
        break;
      case 'updateLote':
        this.NameButton='Actualizar lote'
        break;
      case 'updateProd':
        this.NameButton='Actualizar producto'
        break;

    }
  }

  public cleanForm(){
    this.productoSeleccionado=1;
    this.dateNewLote=''
    this.quantityNewLot=0
    this.isLoteUpdate=false
    this.provSeleccionado=1
    this.pesoSeleccionado=1
    this.nameProd=''
    this.minQuantityProd=0
    this.maxQuantityProd=0
    this.priceProv=0
    this.isProdUpdate=false
  }

  public cancel(){
    this.productoSeleccionado=1;
    this.dateNewLote=''
    this.quantityNewLot=0
    this.isLoteUpdate=false
    this.provSeleccionado=1
    this.pesoSeleccionado=1
    this.nameProd=''
    this.minQuantityProd=0
    this.maxQuantityProd=0
    this.priceProv=0
    this.isProdUpdate=false
    this.valueFiltro='lote'
    this.chageFilterLoteproducto()
  }

  public validateProdForm(){
    let resp = false;
    (this.nameProd === '' ||this.maxQuantityProd<=0||this.priceProv<=0)?resp=false:resp=true;
    return resp
  }

  public validateLoteForm(){
    let resp = false;
    let currentDate= new Date();
    const newDate = new Date(this.dateNewLote);

    (this.quantityNewLot<=0 ||this.dateNewLote ===''|| newDate < currentDate)?resp=false:resp=true;
    return resp
  }


}
