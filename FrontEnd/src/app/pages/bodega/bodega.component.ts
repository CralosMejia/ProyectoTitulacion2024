import { Component } from '@angular/core';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent {
  products = [
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    },
    { 
      nombre: 'Mote', 
      isIconoX: false,
      lotes: [
        { nombre: 'Lote 1', cantidad: '5 lb', fecha: '17/07/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 2', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' },
        { nombre: 'Lote 3', cantidad: '5 lb', fecha: '15/08/2023', proveedor: 'PRONACA' }
      ]
    }
  ];

  toggleIcono(product:any) {
    product.isIconoX = !product.isIconoX;
  }

}
