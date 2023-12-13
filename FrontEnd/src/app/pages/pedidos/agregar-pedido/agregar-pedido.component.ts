import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BodegaService } from 'src/app/services/bodega.service';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { PlatosService } from 'src/app/services/platos.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';

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

  public isEdit=false;
  public valorTotal:number=0



  constructor(
    private route:ActivatedRoute,
    private orderServices:OrdenesService,
    private provServices:ProveedoresService,
    private prodServices:PlatosService,
    private router:Router,
  ){}

  ngOnInit(): void {
    this.loadData()
    this.getOrderId()
    this.loadOrdenDetalle()

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
      this.orderServices.updatedetalleorden(this.detalleSelected,data).subscribe(()=>this.loadData())
    }else{
      const detalle= this.listdetalles[this.detalleSelected]
      detalle.cantidad_necesaria=this.cantidad
      this.calcularValorTotal()
      this.cleanfrom()
    }
  }
  createDetalle(){
    if(this.idPedido !== '0'){
      const data:any={
        "producto_bodega_id": this.prodSelect,
        "cantidad_necesaria": this.cantidad,
        "orden_id": this.idPedido
      }
      this.orderServices.createDetalle(data).subscribe(()=> this.loadData())
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

  deleteDetalle(idDetalle:number){
    if(this.idPedido !== '0'){
      this.orderServices.deleteDetalle(idDetalle).subscribe(()=> this.loadData())
    }else{
      this.listdetalles.splice(this.detalleSelected,1)
      this.calcularValorTotal()
    }
  }

  createPedidoCompleto(){
    console.log('creando prod')
    const listaTransformada = this.listdetalles.map(objeto => ({
      "producto_bodega_id": objeto.producto_bodega_id,
      "cantidad_necesaria": 6  // Asigna aquí el valor que necesitas
    }));
    const data:any={
      "orden":{
        estado:'Aprobado'
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


  cleanfrom(){
    this.prodSelect=1;
    this.provSelect=1;
    this.cantidad=0
    this.isEdit=false
  }


}
