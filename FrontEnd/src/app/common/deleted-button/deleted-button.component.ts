import { Component,ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-deleted-button',
  templateUrl: './deleted-button.component.html',
  styleUrls: ['./deleted-button.component.css']
})
export class DeletedButtonComponent {

  @ViewChild('myModal')
  modal!: ElementRef;

  public graficModal={
    'title':'Eliminar',
    'description':'Estas Seguro que deseas eliminar'
  }

  openModal() {
    this.modal.nativeElement.style.display = 'block';
  }

  closeModal() {
    this.modal.nativeElement.style.display = 'none';
  }
}
