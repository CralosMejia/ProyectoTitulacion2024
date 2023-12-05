import { Component,ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-deleted-button',
  templateUrl: './deleted-button.component.html',
  styleUrls: ['./deleted-button.component.css']
})
export class DeletedButtonComponent {
  @Input() functionDelete!: (id: number) => void;
  @Input() ingredientId!: number;

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

  emitEvent() {
    this.functionDelete(this.ingredientId);
  }
}
