import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from 'src/app/services/proveedores.service';

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
    private provServices:ProveedoresService
  ){}

  ngOnInit(): void {
    this.loaddata()
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
    const data:any={
      "nombre_proveedor": this.nameProv,
      "email": this.emailprov,
      "telefono":this.telefonoProv,
      "nivel":this.nivelPov,
      "estado": this.estadoProv
    }

    this.provServices.createProv(data).subscribe(()=>this.loaddata())
  }


  private cleanFrom(){
    this.title='Agregar Nuevo Proveedor'
    this.titleButton='Agregar'
    this.nameProv=''
    this.emailprov=''
    this.estadoProv='activo'
    this.nivelPov='1'
    this.telefonoProv=''
  }


}
