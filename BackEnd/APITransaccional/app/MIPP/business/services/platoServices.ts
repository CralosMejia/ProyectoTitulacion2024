import { ingredientesporplato } from "../../../data/models/RestaurantePacificoDB/ingredientesporplato";
import { platos } from "../../../data/models/RestaurantePacificoDB/platos";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";

/**
 * Service class for managing 'platos' (dishes) and their related entities.
 */
export class PlatosServices {
    private readonly respositoryPlato: EntrieRepository<platos>;
    private readonly respositoryIPP: EntrieRepository<ingredientesporplato>;
    private readonly repositoryProductoBodega: EntrieRepository<productosbodega>;

    constructor(){
        this.respositoryPlato = new EntrieRepository(platos);
        this.respositoryIPP = new EntrieRepository(ingredientesporplato);
        this.repositoryProductoBodega =  new EntrieRepository(productosbodega);
    }

    /**
     * Creates a new 'plato' (dish) and associates it with its ingredients.
     *
     * @param plato - The 'plato' entity to be created.
     * @param listIppInter - The list of ingredients to associate with the 'plato'.
     * @returns An object containing the created 'plato' and its ingredients.
     */
    async createPlatoComplete(plato: platos, listIppInter: ingredientesporplato[] | null) {
        try {
            const createdPlato = await this.respositoryPlato.create(plato);
            let ingredientsResult = null;

            if (listIppInter && listIppInter.length > 0) {
                const updatedIppInter = this.addIngredientesToPlate(createdPlato.plato_id, listIppInter);
                ingredientsResult = await this.respositoryIPP.bulkCreate(updatedIppInter);
            }

            return {
                "plato": createdPlato,
                "lista de ingredientes": ingredientsResult
            };
        } catch (error) {
            console.error('Error al crear el plato y sus ingredientes:', error);
            throw error;
        }
    }

    /**
     * Retrieves detailed information for all 'platos' (dishes) including their ingredients.
     *
     * @returns An array of objects, each containing a 'plato' and its ingredients.
     */
    async showInfoPlatos() {
        const platosFound = await this.respositoryPlato.getAll();
        const infoPlatosComplet = await this.completeInfoPlato(platosFound);
        return infoPlatosComplet;
    }

    /**
     * Deletes a 'plato' (dish) and its associated ingredients by the given ID.
     *
     * @param plato_id - The ID of the 'plato' to delete.
     * @returns A boolean indicating if the 'plato' was deleted successfully.
     */
    async deletePlato(plato_id:number) {
        await this.respositoryIPP.deleteAllByField('plato_id',plato_id);
        const platoDeleted = await this.respositoryPlato.delete(plato_id);
        return platoDeleted;
    }

    /**
     * Associates a list of ingredients with a 'plato' (dish).
     *
     * @param plato_id - The ID of the 'plato'.
     * @param listIppInter - A list of ingredients to associate with the 'plato'.
     * @returns The updated list of ingredients associated with the 'plato'.
     */
    private addIngredientesToPlate(plato_id: number, listIppInter: ingredientesporplato[]): ingredientesporplato[] {
        listIppInter.forEach((ippPar: any) => {
            ippPar.plato_id = plato_id;
        });
        return listIppInter;
    }

    /**
     * Complements 'platos' (dishes) information with their ingredients.
     *
     * @param listPlatos - An array of 'platos'.
     * @returns An array of 'platos' with detailed information including ingredients.
     */
    private async completeInfoPlato(listPlatos: any[]): Promise<any[]> {
        let listInfoPlatosComplete: any[] = [];
    
        // Obtener todos los ingredientes para todos los platos de una vez
        const allIngredientesPP = await this.respositoryIPP.getAll();
    
        for (const plato of listPlatos) {
            const ingredientesPPFound = allIngredientesPP.filter(ipp => ipp.plato_id === plato.plato_id);
            let ingredientes = '';
    
            for (const ipp of ingredientesPPFound) {
                const ingrediente = await this.repositoryProductoBodega.getById(ipp.producto_bodega_id);
                if (ingrediente != null) {
                    ingredientes += ingredientes.length != 0 ? ', ' + ingrediente.nombre_producto : ingrediente.nombre_producto;
                }
            }
    
            const infoPlato = {
                ...plato,
                ingredientes
            };
            listInfoPlatosComplete.push(infoPlato);
        }
    
        return listInfoPlatosComplete;
    }
    
}
