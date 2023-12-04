import { conversionpeso } from "../../../data/models/RestaurantePacificoDB/conversionpeso";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";

/**
 * Service class for validating weight conversions related to dishes (platos) and warehouse products.
 */
export class ValidatorPlatosServices{

    private readonly repositoryConversionPeso: EntrieRepository<conversionpeso>;
    private readonly repositoryProductosBodega: EntrieRepository<productosbodega>;


    constructor() {
        // Assuming you have repositories for these models
        this.repositoryProductosBodega = new EntrieRepository(productosbodega);
        this.repositoryConversionPeso = new EntrieRepository(conversionpeso);
    }

        /**
     * Validates whether there exists a weight conversion for a given warehouse product and a specified weight unit.
     * 
     * @param productoBodegaId - The ID of the warehouse product.
     * @param pesoId - The ID of the weight unit to be validated.
     * @returns True if a valid conversion exists, otherwise throws an error.
     */
    async validateWeightConversion(productoBodegaId:number, pesoId:number) {
        // Get the supplier weight ID for the warehouse product
        const producto = await this.repositoryProductosBodega.getById(productoBodegaId);
        if (!producto) throw new Error('Warehouse product not found.');

        // Check if there exists a weight conversion
        const conversiones = await this.repositoryConversionPeso.getAllByField('peso_id_origen', pesoId);
        const conversionValida = conversiones.some(conversion => conversion.peso_id_destino === producto.peso_proveedor_id  );

        if (!conversionValida && producto.peso_proveedor_id !== pesoId) {
            throw new Error(`There is no id weight conversion ${pesoId} a ${producto.peso_proveedor_id}`);
        }

        return true; // La conversión existe
    }
    
}