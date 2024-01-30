import { inject, injectable } from "inversify";
import { ingredientesporplato } from "../../../data/models/RestaurantePacificoDB/ingredientesporplato";
import { platos } from "../../../data/models/RestaurantePacificoDB/platos";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import { ValidatorPlatosServices } from "../../validators/MIPP/validatorPlatosServices";
import { peso } from "../../../data/models/RestaurantePacificoDB/peso";
import { LoggerService } from "../common/logs/LogsAPP";

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
    

    constructor(
        @inject(LoggerService) private log: LoggerService,
    ){
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
            const resp= {
                "plato": createdPlato,
                "lista de ingredientes": ingredientsResult
            };

            let message=`A complete plate was created correctly` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')

            return resp
        } catch (error) {
            console.error('Error when creating the dish and its ingredients:', error);
            let errorMessage=`Error when creating the dish and its ingredients: ${error}` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo ingrediente por plato')
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
        let message=`the correct information was obtained from the dishes: ${infoPlatosComplet}` 
        this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
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
            const resp=affectedRows > 0;

            let message=`The condition of the plate was changed correctly: ${resp}` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')

            return resp
        } catch (error) {
            console.error(`Error updating the status of the plato with ID ${plato_id}:`, error);

            let message=`Error updating the status of the plato with ID ${plato_id}: ${error}` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')

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

            let message=`multiple dishes have been created correctly` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
    
            return results;
        } catch (error) {
            console.error('Error when creating the dishes and their ingredients:', error);

            let message=`Error when creating the dishes and their ingredients: ${error}` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')

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
                numero_platos: plato.numero_platos,
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


            let message=`Complete information about the dish was correctly obtained: ${plato_id}` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
    
            // Construir el objeto de respuesta
            return {
                plato: platoInfo,
                ingredientes: ingredientesConInfo
            };
        } catch (error) {
            console.error(`Error retrieving complete info for plato with ID ${plato_id}:`, error);
            let message=`Error retrieving complete info for plato with ID ${plato_id}: ${error}` 
            this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
    
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
        let message=`An ingredient has been added to the dish correctly.` 
        this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
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
            let errorMessage=`Ingrediente with ID ${ingrediente_id} not found.` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo ingrediente por plato')
            throw new Error(errorMessage);
        }
        let message=`One ingredient has been removed from the dish correctly` 
        this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
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
            let errormessage=`Ingrediente with ID ${ingrediente_id} not found.` 
            this.log.addLog(errormessage,'Apitransaccional','Módulo ingrediente por plato')
            throw new Error(errormessage);
        }
        let message=`One ingredient has been updated to the dish correctly.` 
        this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
        return await this.respositoryIPP.update(ingrediente_id, updatedData);
    }

    async searchPlatosWithFullInfo(attributeName: keyof platos | 'Ingrediente', searchValue: string) {
        const allPlatos = await this.respositoryPlato.getAll();
        let filteredPlatos = [];
    
        if (attributeName === 'Ingrediente') {
            const allIngredientes = await this.repositoryProductoBodega.getAll();
            const filteredIngredientes = allIngredientes.filter(ingrediente => ingrediente.nombre_producto.toLowerCase().includes(searchValue.toLowerCase()));
            const filteredIngredientIds = filteredIngredientes.map(ingrediente => ingrediente.producto_bodega_id);
            const allIpp = await this.respositoryIPP.getAll();
            const filteredIpp = allIpp.filter(ipp => filteredIngredientIds.includes(ipp.producto_bodega_id));
            const filteredPlatoIds = filteredIpp.map(ipp => ipp.plato_id);
            filteredPlatos = allPlatos.filter(plato => filteredPlatoIds.includes(plato.plato_id));
        } else {
            filteredPlatos = allPlatos.filter(plato => {
                const attributeValue = plato[attributeName];
                if (typeof attributeValue === 'string') {
                    return attributeValue.toLowerCase().includes(searchValue.toLowerCase());
                }
                return false;
            });
        }
    
        // Utilizar completeInfoPlato para obtener información detallada de los platos filtrados
        const platosConIngredientes = await this.completeInfoPlato(filteredPlatos);
        let message=`The search was successful` 
        this.log.addLog(message,'Apitransaccional','Módulo ingrediente por plato')
        return platosConIngredientes;
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


    async searchIngredientsByProductName(platoId: number, productName: string) {
        // Obtener todos los ingredientes asociados al plato específico
        const allIngredients = await this.respositoryIPP.getAllByField('plato_id', platoId);
    
        // Preparar la lista de ingredientes filtrados con información detallada
        const detailedIngredients = [];
    
        // Iterar sobre cada ingrediente y filtrar basándose en el nombre del producto
        for (const ingredient of allIngredients) {
            const product = await this.repositoryProductoBodega.getById(ingredient.producto_bodega_id);
            
            if (product && product.nombre_producto.toLowerCase().includes(productName.toLowerCase())) {
                // Obtener información adicional del peso
                const weightInfo = await this.repositoryPeso.getById(ingredient.peso_id);
    
                // Construir la información detallada del ingrediente
                detailedIngredients.push({
                    ingrediente_plato_id: ingredient.ingrediente_plato_id,
                    producto_bodega_id: ingredient.producto_bodega_id,
                    peso_id: ingredient.peso_id,
                    cantidad_necesaria: ingredient.cantidad_necesaria,
                    nombreProducto: product.nombre_producto,
                    unidadPeso: weightInfo ? weightInfo.unidad : '',
                    simboloPeso: weightInfo ? weightInfo.simbolo : '',
                    tipoPeso: weightInfo ? weightInfo.tipo : ''
                });
            }
        }
    
        return detailedIngredients;
    }
    
    
    
    
}
