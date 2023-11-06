import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {

  constructor(
    private router:Router,
  ){}

  addPedido(){
    this.router.navigate(['pedidos/agregar'])
  }

}
