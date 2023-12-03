import { injectable } from "inversify";
import { lotes } from "../../../data/models/RestaurantePacificoDB/lotes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import dotenv from 'dotenv';
import { Observable } from "../common/Observable";

dotenv.config();
  
/**
 * Service class for managing 'ingredientes' (ingredients) and related entities.
 */
@injectable()
export class IngredientesServices extends Observable{
    
    private readonly repositoryProductoBodega: EntrieRepository<productosbodega>;
    private readonly repositoryLotes: EntrieRepository<lotes>;
    private DIFMINORMAX:number = Number(process.env.DIFMINORMAX) || 5;
    private DIFDAYSTOEXPIRED:number = Number(process.env.DIFDAYSTOEXPIRED) || 2;


    constructor(){
        super()
        this.repositoryProductoBodega =  new EntrieRepository(productosbodega);
        this.repositoryLotes =  new EntrieRepository(lotes);

    }


    /**
     * Adds a new lote (batch) of ingredients.
     * 
     * @param lote - The lote entity to be added.
     * @returns The created lote entity.
     */
    async addLote(lote: lotes) {
        let currentDate = new Date();
        let currentDateISO = currentDate.toISOString();
        
        let loteExpirationDate = new Date(lote.fecha_vencimiento);
    
        if (loteExpirationDate.getTime() <= currentDate.getTime()) {
            throw new Error('The expiration date is less than or equal to the current date');
        }

        lote.fecha_ingreso = currentDateISO;
        return await this.repositoryLotes.create(lote);
    }

    /**
     * Retrieves all expired lotes (batches).
     * 
     * @returns An array of expired lotes.
     */
    async getExpiredLotes() {
        let currentDate = new Date();
    
        // Obtener todos los lotes
        const allLotes = await this.repositoryLotes.getAll();
    
        // Filtrar los lotes para encontrar los vencidos
        const expiredLotes = allLotes.filter(lote => {
            let loteExpirationDate = new Date(lote.fecha_vencimiento);
            return loteExpirationDate <= currentDate;
        });
    
        return expiredLotes;
    }
    
    /**
     * Retrieves all lotes (batches) that are about to expire within a given number of days.
     * 
     * @param daysBeforeExpire - The number of days before expiration to filter the lotes.
     * @returns An array of lotes that are about to expire.
     */
    async getLotestoExpire() {
        const daysBeforeExpire = this.DIFDAYSTOEXPIRED;
        let currentDate = new Date();
    
        // Establecer la fecha límite para 'diasAntesCaducidad' días a partir de ahora
        let limitDate = new Date(currentDate.getTime() + (daysBeforeExpire * 24 * 60 * 60 * 1000)); // Convertir días a milisegundos
    
        // Obtener todos los lotes
        const allLotes = await this.repositoryLotes.getAll();
    
        // Filtrar los lotes para encontrar los que están por caducar
        const lotesToExpire = allLotes.filter(lote => {
            let loteExpirationDate = new Date(lote.fecha_vencimiento);
            return loteExpirationDate > currentDate && loteExpirationDate <= limitDate;
        });

        if(lotesToExpire !== null ) this.notify(lotesToExpire)

    
        return lotesToExpire;
    }
    
    /**
     * Retrieves all products that are near or below their minimum stock level.
     * 
     * @param difference - The quantity difference from the minimum stock level to consider.
     * @returns An array of products near or below their minimum stock level.
     */
    async getProductsNearOrBelowMinimum() {
        const difference = this.DIFMINORMAX;
        // Get all products from the repository
        const allProducts = await this.repositoryProductoBodega.getAll();
    
        // Filter products that are near or below their minimum quantity
        const productsNearOrBelowMinimum = allProducts.filter(product => {
            const currentAmount = Number(product.cantidad_actual);
            const minimumAmount = Number(product.cantidad_minima);
    
            // Check if the current amount is within the specified difference of the minimum amount
            return currentAmount <= (minimumAmount + difference);
        });
    
        return productsNearOrBelowMinimum;
    }

    /**
     * Retrieves all products that are near or above their maximum stock level.
     * 
     * @param difference - The quantity difference from the maximum stock level to consider.
     * @returns An array of products near or above their maximum stock level.
     */
    async getProductsNearOrAboveMaximum() {
        const difference = this.DIFMINORMAX;
        // Get all products from the repository
        const allProducts = await this.repositoryProductoBodega.getAll();
    
        // Filter products that are near or above their maximum quantity
        const productsNearOrAboveMaximum = allProducts.filter(product => {
            const currentAmount = Number(product.cantidad_actual);
            const maximumAmount = Number(product.cantidad_maxima);
    
            // Check if the current amount is within the specified difference of the maximum amount
            return currentAmount >= (maximumAmount - difference);
        });
    
        return productsNearOrAboveMaximum;
    }

    /**
     * Searches for products in the 'bodega' (warehouse) based on a specific attribute.
     * 
     * @param attributeName - The name of the attribute to search by.
     * @param searchValue - The value to search for in the attribute.
     * @returns An array of products that match the search criteria.
     */
    async searchProductsBodegaByAttribute(attributeName: keyof productosbodega, searchValue: string) {
        // Get all products from the repository
        const allProducts = await this.repositoryProductoBodega.getAll();
    
        // Filter products based on the attribute and search value
        const filteredProducts = allProducts.filter(product => {
            const attributeValue = product[attributeName];
            if (typeof attributeValue === 'string') {
                return attributeValue.toLowerCase().includes(searchValue.toLowerCase());
            }
            return false;
        });
    
        return filteredProducts;
    }
    
    
    
    
    
}