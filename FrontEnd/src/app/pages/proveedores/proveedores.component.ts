import { Component, OnInit } from '@angular/core';
import { SearchProveedoresService } from 'src/app/services/communication/searchs/search-proveedores.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit{

  public selectedprov:number=1
  public listProv!:any[]

  //conf to edit
  public nameProv!:string;
  public emailprov!:string
  public estadoProv:string='activo'
  public nivelPov:string='1'
  public telefonoProv!:string

  //conf visuales
  public title='Agregar Nuevo Proveedor'
  public titleButton='Agregar'

  constructor(
    private provServices:ProveedoresService,
    private proveedorSearch:SearchProveedoresService,


  ){}

  ngOnInit(): void {
    this.loaddata()

    this.proveedorSearch.getSearchParameter$().subscribe((param:any)=>{
      console.log(param)
      this.provServices.searchProve(param).subscribe((resp:any)=>{
        if(param.paramSeacrh !==''){
          this.listProv= resp;
        }else{
           this.loaddata()   
        }
      })
    })

  }

  loaddata(){
    this.provServices.getProv().subscribe((resp:any)=>{
      this.listProv= resp.entriesList
      this.cleanFrom()
    })
  }


  loadDataToEdit(idprov:number,nameProv:string,emailProv:string,estadoProv:string,nivelProv:string,telefonoPrv:string){
    this.title='Editar Proveedor'
    this.nameProv=nameProv
    this.titleButton='Editar'
    this.selectedprov=idprov
    this.emailprov=emailProv
    this.estadoProv=estadoProv
    this.nivelPov=nivelProv
    this.telefonoProv= telefonoPrv
  }
  
  updateProv(){
    if(!this.validateForm()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben ser rellenados!"
      });
      return
    }
    const data:any={
      "nombre_proveedor": this.nameProv,
      "email": this.emailprov,
      "telefono":this.telefonoProv,
      "nivel":this.nivelPov,
      "estado": this.estadoProv
    }
    this.provServices.updateProv(this.selectedprov,data).subscribe(()=>this.loaddata())
    
  }

  createProv(){
    if(!this.validateForm()){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos deben ser rellenados!"
      });
      return
    }
    const data:any={
      "nombre_proveedor": this.nameProv,
      "email": this.emailprov,
      "telefono":this.telefonoProv,
      "nivel":this.nivelPov,
      "estado": this.estadoProv
    }

    this.provServices.createProv(data).subscribe(()=>this.loaddata())
  }


  public cleanFrom(){
    this.title='Agregar Nuevo Proveedor'
    this.titleButton='Agregar'
    this.nameProv=''
    this.emailprov=''
    this.estadoProv='activo'
    this.nivelPov='1'
    this.telefonoProv=''
  }

  public validateForm(){
    let resp =false;
    (this.nameProv===''||this.emailprov===''||this.estadoProv===''||this.nivelPov===''||this.telefonoProv==='')?resp=false:resp=true;
    return resp
  }


}
