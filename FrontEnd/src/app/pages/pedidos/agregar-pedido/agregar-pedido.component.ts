import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { retry } from 'rxjs';
import { BodegaService } from 'src/app/services/bodega.service';
import { SearchPedidoService } from 'src/app/services/communication/searchs/search-pedido.service';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { PlatosService } from 'src/app/services/platos.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';
import { __assign } from 'tslib';

@Component({
  selector: 'app-agregar-pedido',
  templateUrl: './agregar-pedido.component.html',
  styleUrls: ['./agregar-pedido.component.css']
})
export class AgregarPedidoComponent implements OnInit{

  public idPedido:string="0"
  public orden!:any
  public isSeen=false
  public listProv:any[]=[]
  public listProd:any[]=[]
  public listdetalles:any[]=[]

  public provSelect=1
  public prodSelect=1
  public cantidad:number=0
  public detalleSelected=1
  public estimeteDate=''

  public isEdit=false;
  public valorTotal:number=0

  public provToReci=1
  public detailToReci=1

  public selectedFilter='Todo'

  listFilterRecive=[
    'Todo',
    'Proveedores',
    'Porducto'

  ]




  constructor(
    private route:ActivatedRoute,
    private orderServices:OrdenesService,
    private provServices:ProveedoresService,
    private prodServices:PlatosService,
    private router:Router,
    private pedidoSearch:SearchPedidoService,

  ){}

  ngOnInit(): void {
    this.loadData()
    this.getOrderId()
    this.loadOrdenDetalle()
    this.pedidoSearch.getSearchParameter$().subscribe((param:any)=>{
      this.orderServices.searchPedido(this.idPedido,param).subscribe((resp:any)=>{
        if(param.paramSeacrh !==''){
          this.listdetalles= resp.orderDetails;
        }else{
           this.loadOrdenDetalle()   
        }
      })

    })
  }

  getOrderId(){
    this.route.queryParams.subscribe(params=>{
      this.idPedido = params['id'] || "0"
      const modo = params['modo'] || "0"
      if(modo === '-1') this.isSeen=true
  
    })
  }

  loadData(){

    this.prodServices.getAllProducts().subscribe((resp:any)=>{
      this.listProd=resp.entriesList
    })
    this.provServices.getProv().subscribe((resp:any)=>{
      this.listProv= resp.entriesList

    })
    
    
    this.cleanfrom()
  }

  loadOrdenDetalle(){
    if (this.idPedido!=='0'){
        this.orderServices.getOrderComplete(this.idPedido).subscribe((resp:any)=>{
        this.orden=resp.order
        this.listdetalles=resp.orderDetails
      })
    }
  }

  peparateDataToEdit(idDetallePed:number,idprod:number,idProv:number,cant:number){
    this.prodSelect=idprod;
    this.provSelect=idProv;
    this.cantidad=cant
    this.isEdit=true
    this.detalleSelected=idDetallePed
  }

  updateDetalle(){
    if(this.idPedido !== '0'){
      const data:any={
        "cantidad_necesaria":this.cantidad
      }
      this.orderServices.updatedetalleorden(this.detalleSelected,data).subscribe(()=>{
        this.loadData()
        this.loadOrdenDetalle()
      })
    }else{
      const detalle= this.listdetalles[this.detalleSelected]
      detalle.cantidad_necesaria=this.cantidad
      this.calcularValorTotal()
      this.cleanfrom()
    }
  }
  createDetalle(){
    if(!this.validateProd()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La cantidad no puede ser cero o menor!"
      });
      return
    }
    let findprod:any=this.listdetalles.find((detall:any)=> detall.producto_bodega_id === Number(this.prodSelect))
    if(findprod !==undefined){
      if(!confirm('El producto ya existe en el pedido deseas sumar a la cantidad existente'))return
    }
    if(this.idPedido !== '0'){
      const data:any={
        "producto_bodega_id": this.prodSelect,
        "cantidad_necesaria": this.cantidad,
        "orden_id": this.idPedido
      }
      this.orderServices.createDetalle(data).subscribe(()=> {
        this.loadData()
        this.loadOrdenDetalle()
      })
    }else{
      if(findprod !== undefined){
        Object.assign(findprod,{cantidad_necesaria:findprod.cantidad_necesaria+this.cantidad})
      }else{
        const idProv=this.provSelect
        const idProd= this.prodSelect
        const cant=this.cantidad
        let data:any={}
        this.orderServices.getInfoDetalle(idProd).subscribe((resp:any)=>{
          data=resp
          data.cantidad_necesaria=this.cantidad
          this.listdetalles.push(data)
          this.calcularValorTotal()
        })
      }
    }
  }

  deleteDetalle(idDetalle:number){
    if(this.idPedido !== '0'){
      this.orderServices.deleteDetalle(idDetalle).subscribe(()=> {
        this.loadData()
        this.loadOrdenDetalle()
      })
    }else{
      this.listdetalles.splice(this.detalleSelected,1)
      this.calcularValorTotal()
    }
  }

  createPedidoCompleto(){
    const listaTransformada = this.listdetalles.map(objeto => ({
      "producto_bodega_id": objeto.producto_bodega_id,
      "cantidad_necesaria": this.cantidad
    }));
    if(listaTransformada.length <=0 || this.estimeteDate === ''){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se puede crear una orden vacia o sin fecha estimada de entrega!"
      });
      return
    }
    const data:any={
      "orden":{
        estado:'Aprobado',
        fecha_estimada_recepcion:this.estimeteDate
      },
      "detallesOrden":listaTransformada
    }
    this.orderServices.createOrdenComplete(data).subscribe(()=>{
      this.router.navigate([`pedidos/listar`])
    })
  }
  
 toNumber(num:string){
    return Number(num)
  }

  calcularValorTotal() {
    let valorTotal = 0;

    this.listdetalles.forEach(objeto => {
      const cantidadNecesaria = objeto.cantidad_necesaria || 0;
      const precioProveedor = objeto.productInfo?.precio_proveedor || 0;
      const valorObjeto = cantidadNecesaria * precioProveedor;
      valorTotal += valorObjeto;
    });
    this.valorTotal=valorTotal
    
  }

  changeStatuS(newStatus:string){
    const data:any={
      "estado":newStatus
    }
    this.orderServices.updateStatus(Number(this.idPedido),data).subscribe(()=>this.router.navigate([`pedidos/listar`]))
  }

  reciveOrder(){
    let data
    if(this.selectedFilter==='Todo'){
      data={}
    }else if(this.selectedFilter==='Proveedores'){
      console.log(this.listProv)
      console.log(this.provToReci)
      data={
        idProv:this.provToReci
      }
    }else if(this.selectedFilter==='Porducto'){
      data={
        idDetail:this.detailToReci
      }
    }
    this.orderServices.reciveOrder(Number(this.idPedido),data).subscribe(()=>this.router.navigate([`pedidos/listar`]))
    data={}
  }

  chageFilterRecive(){
    if(this.selectedFilter==='Porducto'){
      this.detailToReci=this.listdetalles[0].detalle_orden_id
    }
  }

  validateProd(){
    let resp;
    this.cantidad<=0?resp=false:resp=true;
    return resp
  }

  changeProv(){
    const findprod:any=this.listProd.find((detall:any)=> detall.producto_bodega_id === Number(this.prodSelect))
    this.provSelect=findprod.proveedor_id
  }


  cleanfrom(){
    this.prodSelect=1;
    this.provSelect=1;
    this.cantidad=0
    this.estimeteDate=''
    this.isEdit=false
  }


}
