import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatosService } from 'src/app/services/platos.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  public platos:any[]=[]

  constructor(
    private router:Router,
    private platoServices:PlatosService
  ){}

  ngOnInit(): void {
    this.loadInfoPlatos()
  }

  loadInfoPlatos(){
    this.platoServices.getCompletePlatos().subscribe((resp:any)=>{
      this.platos= resp;
    })
  }

  addPlato(){
    this.router.navigate(['menu/agregar/plato'])
  }

  changeStatus(id:any){
    this.platoServices.chagePlateStatus(id).subscribe(()=>{
      this.loadInfoPlatos();
    })
  }

  editPlato(id:number){
    this.router.navigate([`menu/agregar/plato`],{queryParams: {id}})
  }
}
