import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchPedidosService } from 'src/app/services/communication/searchs/search-pedidos.service';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  public listPedido!:any[]

  constructor(
    private router:Router,
    private ordenServices:OrdenesService,
    private pedidosSearch:SearchPedidosService,
  ){}

  ngOnInit(): void {
    this.loadData()
    this.pedidosSearch.getSearchParameter$().subscribe((param:any)=>{
      this.ordenServices.search(param).subscribe((resp:any)=>{
        if(param.paramSeacrh !==''){
          this.listPedido= resp;
        }else{
           this.loadData()   
        }
      })

    })
  }

  loadData(){
    this.ordenServices.getOrders().subscribe((resp:any)=>{
      this.listPedido= resp.entriesList
    })
  }

  addPedido(){
    this.router.navigate([`pedidos/agregar`])
  }

  editPedido(id:number){
    this.router.navigate([`pedidos/agregar`],{queryParams: {id}})
  }

  seenPedido(id:number){
    this.router.navigate([`pedidos/agregar`],{queryParams: {id,modo:"-1"}})
  }

}
