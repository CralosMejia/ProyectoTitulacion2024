import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletedButtonComponent } from './deleted-button/deleted-button.component';



@NgModule({
  declarations: [
    DeletedButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    DeletedButtonComponent
  ]
})
export class CommonComponentsModule { }
