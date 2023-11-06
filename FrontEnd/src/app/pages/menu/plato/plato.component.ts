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
}
