import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {

  public pedidos=[
    {
      numPedido:'1234',
      valorOrden:300,
      fechaCreacion:'10/10/2023',
      estado:'En espera'
    },
    {
      numPedido:'1234',
      valorOrden:300,
      fechaCreacion:'10/10/2023',
      estado:'Enviado'
    },
    {
      numPedido:'1234',
      valorOrden:300,
      fechaCreacion:'10/10/2023',
      estado:'Cancelado'
    },
    {
      numPedido:'1234',
      valorOrden:300,
      fechaCreacion:'10/10/2023',
      estado:'Aprobado'
    },
  ]
  constructor(
    private router:Router,
  ){}

  addPedido(){
    this.router.navigate(['pedidos/agregar'])
  }

}
