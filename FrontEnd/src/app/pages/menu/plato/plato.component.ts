import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchIngredienteService } from 'src/app/services/communication/searchs/search-ingrediente.service';
import { PlatosService } from 'src/app/services/platos.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-plato',
  templateUrl: './plato.component.html',
  styleUrls: ['./plato.component.css']
})
export class PlatoComponent implements OnInit{

  @Output() eventFather = new EventEmitter<any>();

  public idPlato:string="0";
  public plato:any;
  public ingredients: any[] = [];
  public listProductosBodega:any[]=[]
  public listpeso:any[]=[]


  selectedProductoId: number = 0; // inicializa según tus necesidades
  selectedCantidad: number = 0; // inicializa según tus necesidades
  selectedPesoId: number = 0; // inicializa según tus necesidades
  public nombrePlato!: string;
  public descripcionPlato!: string;
  public precioPlato!: number;
  public cantidadPlato!: number;

  imgPlato= null
  isIngredienteUpdate=false
  indexIngredienteUpdate=0;
  idIngredienteUpdate=0;


  //Conf page
  imagenVistaPrevia: string | ArrayBuffer | null= null;

  constructor(
    private route:ActivatedRoute,
    private platoServices:PlatosService,
    private router:Router,
    private ingredienteSearch:SearchIngredienteService,
  ){}

  ngOnInit(): void {
    this.loaddata()
    this.getPlatoID();
    this.getLoadInfoPlato();

    this.ingredienteSearch.getSearchParameter$().subscribe((param:any)=>{
      console.log(param)
      this.platoServices.searchIngredient(Number(this.idPlato),param).subscribe((resp:any)=>{
        if(param.paramSeacrh !==''){
          this.ingredients= resp;
        }else{
           this.getLoadInfoPlato()   
        }
      })
    })




  }

  loaddata(){
    this.platoServices.getAllProducts().subscribe((resp:any)=>{
      this.listProductosBodega= resp.entriesList;
    })
    this.platoServices.getAllPeso().subscribe((resp:any)=>{
      this.listpeso= resp.entriesList.filter((objeto:any) => objeto.tipo_uso === 'uso' || objeto.tipo_uso === 'ambos');
    })
  }

  getPlatoID(){
    this.route.queryParams.subscribe(params=>{
      this.idPlato = params['id'] || "0"
    })
  }

  getLoadInfoPlato(){
    if(this.idPlato !== "0"){
      this.platoServices.getInfoPlato(this.idPlato).subscribe(resp=>{
        this.plato= resp;
        this.loadIngredientes()
      })
    }
  }

  loadIngredientes(){
    if(this.idPlato !== "0"){
      this.ingredients = this.plato.ingredientes
    }

  }

  addIngredient() {
    if(!this.validateIngredient()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben estar llenos y la cantidad debe ser mayor a cero!"
      });
      return
    }
    if(this.idPlato !== "0"){
      //llama al servicio
      this.platoServices.addIngredient({
          "plato_id": this.idPlato,
          "producto_bodega_id": this.selectedProductoId,
          "peso_id": this.selectedPesoId,
          "cantidad_necesaria": this.selectedCantidad
      }).subscribe(()=>{this.getLoadInfoPlato()})
    }else{
      //agrega a lalista de ingredientes
      const producto = this.listProductosBodega.find(prod=>prod.producto_bodega_id == this.selectedProductoId)
      const peso = this.listpeso.find(peso=>peso.peso_id == this.selectedPesoId)
      const ingredient = {
            "producto_bodega_id": producto.producto_bodega_id,
            "peso_id": peso.peso_id,
            "cantidad_necesaria": this.selectedCantidad,
            "nombreProducto": producto.nombre_producto,
            "unidadPeso": peso.unidad,
            "simboloPeso": peso.simbolo,
            "tipoPeso": peso.tipo
      }
      this.ingredients.push(ingredient)
      this.selectedProductoId = 0
      this.selectedCantidad = 0
      this.selectedPesoId = 0

    }
  }



  deleteIngredient(id: number) {
    if(this.idPlato !== "0"){
      this.platoServices.deleteIngredient(id).subscribe(Res=>{
        this.getLoadInfoPlato()
      })
    }else{
      this.ingredients.splice(id,1)
    }
  }

  loadDataUpdate(index:number){
    const ingredient = this.ingredients[index];
    this.indexIngredienteUpdate = index
    this.isIngredienteUpdate =true
    // Suponiendo que tienes las siguientes propiedades en tu componente:
    this.selectedProductoId = ingredient.producto_bodega_id;
    this.selectedCantidad = ingredient.cantidad_necesaria;
    this.selectedPesoId = ingredient.peso_id;
    if(this.idPlato !== "0"){
      this.idIngredienteUpdate=ingredient.ingrediente_plato_id
    }
  }

  editIngredient(){
    if(!this.validateIngredient()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben estar llenos y la cantidad debe ser mayor a cero!"
      });
      return
    }
    if(this.idPlato !== "0"){
      this.platoServices.editIngredient(this.idIngredienteUpdate,{
        "producto_bodega_id": this.selectedProductoId ,
        "peso_id": this.selectedPesoId,
        "cantidad_necesaria": this.selectedCantidad
      }).subscribe(()=>{
        this.getLoadInfoPlato()
      })
    }else{
        const ingredienteupdate = this.ingredients[this.indexIngredienteUpdate]
        ingredienteupdate.cantidad_necesaria=this.selectedCantidad
        ingredienteupdate.peso_id = this.selectedPesoId
    }
    this.selectedProductoId = 0
    this.selectedCantidad = 0
    this.selectedPesoId = 0
    this.isIngredienteUpdate = false
  }
  
  editPlato(){
    if(!this.validatePlato()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben estar llenos y los valores numericos deben ser mayor a cero!"
      });
      return
    }
    const plato={
      "nombre_plato": this.nombrePlato,
      "descripcion": this.descripcionPlato,
      "precio": this.precioPlato,
      "numero_platos": this.cantidadPlato,
      "imagen": this.imgPlato
    }
    this.platoServices.editPlato(Number(this.idPlato),plato).subscribe(()=>{
        this.router.navigate(['menu/listar/plato'])
    })
  }

  createPlatoComplete(){
    if(!this.validatePlato()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben estar llenos y los valores numericos deben ser mayor a cero!"
      });
      return
    }

    const newListaIngredientes = this.ingredients.map(objeto => ({
      producto_bodega_id: objeto.producto_bodega_id,
      peso_id: objeto.peso_id,
      cantidad_necesaria: objeto.cantidad_necesaria
    }));
    const plato={
      "plato":{
        "nombre_plato": this.nombrePlato,
        "descripcion": this.descripcionPlato,
        "precio": this.precioPlato,
        "imagen": this.imgPlato
      },"ingredientes": newListaIngredientes
      
    }

    this.platoServices.createNewPlato(plato).subscribe(()=>{
      this.router.navigate(['menu/listar/plato'])
    })

  }

  showPreview(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagenVistaPrevia = reader.result;
      reader.readAsDataURL(archivo);
    }
  }

  changeImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagenVistaPrevia = reader.result;
      reader.readAsDataURL(archivo);
    }
  }

  ///PRIVATE METhODS
  private validateIngredient(){
    let resp=false;
    (this.selectedCantidad<=0 || this.selectedProductoId <=0 || this.selectedPesoId<=0)?resp=false:resp=true;
    return resp
  }

  private validatePlato(){
    let resp= false;
    (this.nombrePlato === '' || this.descripcionPlato===''||this.precioPlato <=0 || this.cantidadPlato<=0)?resp=false:resp=true;
    return resp;
  }
  
}
