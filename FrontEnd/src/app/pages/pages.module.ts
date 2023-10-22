import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresComponent } from './proveedores/proveedores.component';



@NgModule({
  declarations: [
    ProveedoresComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ProveedoresComponent
  ]
})
export class PagesModule { }
