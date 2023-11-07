import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  public graphics =[
    {
      'title':'Predicciones de Demanda',
      'img':'https://i.ibb.co/yPmdp4H/image-7.png',
      'description':'Gráfico de ventas por mes'
    },
    {
      'title':'Tendencias de Ventas',
      'img':'https://i.ibb.co/HtSkxjX/image-9.jpg',
      'description':'Ventas por tipo de plato'
    },
    {
      'title':'Estado de los productos en bodega',
      'img':'https://i.ibb.co/mb0LTML/Chart-1.jpg',
      'description':'Distribución de ventas por producto'
    },
    {
      'title':'Informacion de pedidos',
      'img':'https://i.ibb.co/WBdHcY7/image-8.jpg',
      'description':'Ventas por tipo de plato'
    },
  ]

  @ViewChild('myModal')
  modal!: ElementRef;

  public isFilter:boolean = true;

  openModal() {
    this.modal.nativeElement.style.display = 'block';
  }

  closeModal() {
    this.modal.nativeElement.style.display = 'none';
  }

  printContent() {
    window.print();
  }


  //-----------------
  options = [
    { name: 'Mote pillo', checked: false },
    { name: 'Papas con cuero', checked: false },
    // Añadir más opciones aquí
  ];

  toggleDropdown = true;

  get selectedOptions() {
    return this.options
      .filter(option => option.checked)
      .map(option => option.name);
  }
  
}
