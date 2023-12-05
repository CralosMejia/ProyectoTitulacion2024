import { injectable } from "inversify";
import { ingredientesporplato } from "../../../data/models/RestaurantePacificoDB/ingredientesporplato";
import { platos } from "../../../data/models/RestaurantePacificoDB/platos";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { ValidatorPlatosServices } from "../../validators/MIPP/validatorPlatosServices";
import { peso } from "../../../data/models/RestaurantePacificoDB/peso";

/**
 * Service class for managing 'platos' (dishes) and their related entities.
 */
@injectable()
export class PlatosServices {

    private readonly validator: ValidatorPlatosServices;

    private readonly respositoryPlato: EntrieRepository<platos>;
    private readonly respositoryIPP: EntrieRepository<ingredientesporplato>;
    private readonly repositoryProductoBodega: EntrieRepository<productosbodega>;
    private readonly repositoryPeso: EntrieRepository<peso>;
    

    constructor(){
        this.validator = new ValidatorPlatosServices()

        this.respositoryPlato = new EntrieRepository(platos);
        this.respositoryIPP = new EntrieRepository(ingredientesporplato);
        this.repositoryProductoBodega =  new EntrieRepository(productosbodega);
        this.repositoryPeso = new EntrieRepository(peso)
    }

    /**
     * Creates a new 'plato' (dish) and associates it with its ingredients.
     *
     * @param plato - The 'plato' entity to be created.
     * @param listIppInter - The list of ingredients to associate with the 'plato'.
     * @returns An object containing the created 'plato' and its ingredients.
     */
    async createPlatoComplete(plato: platos, listIppInter: ingredientesporplato[]) {
        try {

            await Promise.all(
                listIppInter.map(ingrediente => 
                    this.validator.validateWeightConversion(ingrediente.producto_bodega_id, ingrediente.peso_id)
                )
            );

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
            console.error('Error when creating the dish and its ingredients:', error);
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
     * Changes the status of a 'plato' (dish) to 'No disponible' and its associated ingredients by the given ID.
     *
     * @param plato_id - The ID of the 'plato' to update.
     * @returns A boolean indicating if the 'plato' was updated successfully.
     */
    async changeState(plato_id:number) {
        try {
            // Retrieve the plato
            const plato = await this.respositoryPlato.getById(plato_id);
            if (!plato) {
                throw new Error(`Plato with ID ${plato_id} not found.`);
            }

            // Toggle the state
            const newState = plato.estado === 'Disponible' ? 'No disponible' : 'Disponible';

            // Update the plato
            const affectedRows = await this.respositoryPlato.updateSingleFieldById('plato_id', plato_id, 'estado', newState);

            // Check if the update was successful
            return affectedRows > 0;
        } catch (error) {
            console.error(`Error updating the status of the plato with ID ${plato_id}:`, error);
            throw error;
        }
    }


    /**
     * Creates multiple 'platos' (dishes) along with their corresponding ingredients.
     * 
     * @param platosWithIngredients - An array of objects, each containing a 'plato' and its associated 'ingredientes' (ingredients).
     * @returns An array of objects, each representing a created 'plato' with its list of ingredients.
     * @throws An error if there is an issue during the creation process.
     */
    async createMultiplePlatosWithIngredients(platosWithIngredients: Array<{ plato: platos, ingredientes: ingredientesporplato[] }>) {
        try {
            const results = [];
    
            for (const item of platosWithIngredients) {

                await Promise.all(
                    item.ingredientes.map(ingrediente => 
                        this.validator.validateWeightConversion(ingrediente.producto_bodega_id, ingrediente.peso_id)
                    )
                );


                const createdPlato = await this.respositoryPlato.create(item.plato);
                let ingredientsResult = null;
    
                if (item.ingredientes && item.ingredientes.length > 0) {
                    const updatedIppInter = this.addIngredientesToPlate(createdPlato.plato_id, item.ingredientes);
                    ingredientsResult = await this.respositoryIPP.bulkCreate(updatedIppInter);
                }
    
                results.push({
                    "plato": createdPlato,
                    "lista de ingredientes": ingredientsResult
                });
            }
    
            return results;
        } catch (error) {
            console.error('Error al crear los platos y sus ingredientes:', error);
            throw error;
        }
    }

    /**
     * Retrieves complete information about a specific dish, including its associated ingredients.
     * 
     * @param plato_id - The ID of the dish.
     * @returns An object containing detailed information about the dish and its ingredients.
     */
    async getPlatoCompleteInfo(plato_id: number): Promise<any> {
        try {
            // Buscar el plato
            const plato = await this.respositoryPlato.getById(plato_id);
            if (!plato) {
                throw new Error(`Plato with ID ${plato_id} not found.`);
            }
    
            // Extraer y formatear datos relevantes del plato
            const platoInfo = {
                plato_id: plato.plato_id,
                nombre_plato: plato.nombre_plato,
                descripcion: plato.descripcion,
                precio: plato.precio,
                imagen: plato.imagen,
                estado: plato.estado
            };
    
            // Buscar ingredientes asociados al plato
            const ingredientes = await this.respositoryIPP.getAllByField('plato_id', plato_id);
    
            // Obtener información adicional de cada ingrediente
            const ingredientesConInfo = await Promise.all(ingredientes.map(async (ingrediente) => {
                const producto = await this.repositoryProductoBodega.getById(ingrediente.producto_bodega_id);
                const peso = await this.repositoryPeso.getById(ingrediente.peso_id);
    
                return {
                    ingrediente_plato_id: ingrediente.ingrediente_plato_id,
                    producto_bodega_id: ingrediente.producto_bodega_id,
                    peso_id: ingrediente.peso_id,
                    cantidad_necesaria: ingrediente.cantidad_necesaria,
                    nombreProducto: producto ? producto.nombre_producto : '',
                    unidadPeso: peso ? peso.unidad : '',
                    simboloPeso: peso ? peso.simbolo : '',
                    tipoPeso: peso ? peso.tipo : ''
                };
            }));
    
            // Construir el objeto de respuesta
            return {
                plato: platoInfo,
                ingredientes: ingredientesConInfo
            };
        } catch (error) {
            console.error(`Error retrieving complete info for plato with ID ${plato_id}:`, error);
            throw error;
        }
    }


    /**
     * Adds a new ingredient to a dish.
     * 
     * @param newIngrediente - The ingredient to be added.
     * @returns The newly added ingredient.
     */
    async addIngredientToPlato(newIngrediente: ingredientesporplato): Promise<ingredientesporplato> {
        await this.validator.validateWeightConversion(newIngrediente.producto_bodega_id, newIngrediente.peso_id);
        return await this.respositoryIPP.create(newIngrediente);
    }

    /**
     * Deletes an ingredient from a dish.
     * 
     * @param ingrediente_id - The ID of the ingredient to be deleted.
     * @returns True if the deletion was successful, false otherwise.
     */
    async deleteIngredientOfPlato(ingrediente_id: number): Promise<boolean> {
        const ingrediente = await this.respositoryIPP.getById(ingrediente_id);
        if (!ingrediente) {
            throw new Error(`Ingrediente with ID ${ingrediente_id} not found.`);
        }
        return await this.respositoryIPP.delete(ingrediente_id);
    }



    /**
     * Updates an existing ingredient of a dish.
     * 
     * @param ingrediente_id - The ID of the ingredient to be updated.
     * @param updatedData - The new data for the ingredient.
     * @returns The updated ingredient, or null if not found.
     */
    async updateIngredientOfPlato(ingrediente_id: number, updatedData: Partial<ingredientesporplato>): Promise<ingredientesporplato | null> {
        
        const ingrediente = await this.respositoryIPP.getById(ingrediente_id);

        if(ingrediente !== null && updatedData.peso_id !== undefined ){ 
            await this.validator.validateWeightConversion(ingrediente.producto_bodega_id, updatedData.peso_id);
        }
        if (!ingrediente) {
            throw new Error(`Ingrediente with ID ${ingrediente_id} not found.`);
        }
        return await this.respositoryIPP.update(ingrediente_id, updatedData);
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
