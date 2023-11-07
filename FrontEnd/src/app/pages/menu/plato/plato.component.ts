import { Component } from '@angular/core';


// ingredient.model.ts
export interface Ingredient {
  name: string;
  amount: number;
  weight: string;
}


@Component({
  selector: 'app-plato',
  templateUrl: './plato.component.html',
  styleUrls: ['./plato.component.css']
})
export class PlatoComponent {


  imagenVistaPrevia: string | ArrayBuffer | null= null;
  ingredients: Ingredient[] = [];
  newIngredientName = '';
  newIngredientAmount = 0;
  newIngredientWeight = '';

  addIngredient() {
    const newIngredient: Ingredient = {
      name: this.newIngredientName,
      amount:this.newIngredientAmount,
      weight: this.newIngredientWeight
    };
    this.ingredients.push(newIngredient);
    this.newIngredientName = 'Papa chola';
    this.newIngredientAmount =20;
    this.newIngredientWeight = 'gr';
  }

  editIngredient(index: number) {
    // Aquí puedes agregar la lógica para editar el ingrediente.
    // Por ejemplo, podrías abrir un modal para editar.
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  mostrarVistaPrevia(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagenVistaPrevia = reader.result;
      reader.readAsDataURL(archivo);
    }
  }

  cambiarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagenVistaPrevia = reader.result;
      reader.readAsDataURL(archivo);
    }
  }
  
}
