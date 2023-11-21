import { lotes } from "../../../data/models/RestaurantePacificoDB/lotes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";


export class IngredientesServices{
    
    private readonly repositoryProductoBodega: EntrieRepository<productosbodega>;
    private readonly repositoryLotes: EntrieRepository<lotes>;


    constructor(){
        this.repositoryProductoBodega =  new EntrieRepository(productosbodega);
        this.repositoryLotes =  new EntrieRepository(lotes);

    }


    addLote(lote:lotes){

    }
}