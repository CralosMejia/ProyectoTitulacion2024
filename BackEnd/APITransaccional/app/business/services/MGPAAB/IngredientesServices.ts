import { inject, injectable } from "inversify";
import { lotes } from "../../../data/models/RestaurantePacificoDB/lotes";
import { productosbodega } from "../../../data/models/RestaurantePacificoDB/productosbodega";
import { EntrieRepository } from "../../../data/repository/entrieRepository";
import dotenv from 'dotenv';
import { Observable } from "../common/Observable";
import { peso } from "../../../data/models/RestaurantePacificoDB/peso";
import { proveedor } from "../../../data/models/RestaurantePacificoDB/proveedor";
import { LoggerService } from "../common/logs/LogsAPP";
import { lotes_desperdiciados } from "../../../data/models/RestaurantePacificoDB/lotes_desperdiciados";

dotenv.config();
  
/**
 * Service class for managing 'ingredientes' (ingredients) and related entities.
 */
@injectable()
export class IngredientesServices extends Observable{
    
    private readonly repositoryProductoBodega: EntrieRepository<productosbodega>;
    private readonly repositoryLotes: EntrieRepository<lotes>;
    private readonly repositoryPeso: EntrieRepository<peso>;
    private readonly repositoryProveedor: EntrieRepository<proveedor>;
    private readonly repositoryLotesDesperdiciados: EntrieRepository<lotes_desperdiciados>;



    private DIFMINORMAX:number = Number(process.env.DIFMINORMAX) || 5;
    private DIFDAYSTOEXPIRED:number = Number(process.env.DIFDAYSTOEXPIRED) || 2;


    constructor(
        @inject(LoggerService) private log: LoggerService,
    ){
        super()
        this.repositoryProductoBodega =  new EntrieRepository(productosbodega);
        this.repositoryLotes =  new EntrieRepository(lotes);
        this.repositoryPeso =  new EntrieRepository(peso);
        this.repositoryProveedor =  new EntrieRepository(proveedor);
        this.repositoryLotesDesperdiciados=  new EntrieRepository(lotes_desperdiciados);




    }


    /**
     * Adds a new lote (batch) of ingredients.
     * 
     * @param lote - The lote entity to be added.
     * @returns The created lote entity.
     */
    async addLote(lote: lotes) {
        
        try {
            let currentDate = new Date();
            let currentDateISO = currentDate.toISOString();
            
            let loteExpirationDate = new Date(lote.fecha_vencimiento);
        
            if (loteExpirationDate.getTime() <= currentDate.getTime()) {

                let ErroMessage=`The expiration date is less than or equal to the current date` 
                this.log.addLog(ErroMessage,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')

                throw new Error(ErroMessage);
            }

            lote.fecha_ingreso = currentDateISO;
            const resp=await this.repositoryLotes.create(lote);

            let message=`A batch has been successfully added` 
            this.log.addLog(message,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')

            return resp
        } catch (error) {
            const errorMessage=`Error when  try create lote: ${error}`
            this.log.addLog(errorMessage,'Apitransaccional','Módulo pedidos automaticos')
            throw error;
        }
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
    
        // Obtener la información completa y eliminar cada lote vencido
        const detailedExpiredLotes = [];
        for (const lote of expiredLotes) {
            // Obtener información del producto asociado al lote
            const product = await this.repositoryProductoBodega.getById(lote.producto_bodega_id);
    
            // Obtener la información del peso asociado al producto
            const peso = product ? await this.repositoryPeso.getById(product.peso_proveedor_id) : null;
    
            detailedExpiredLotes.push({
                lote_id: lote.lote_id,
                fecha_vencimiento: lote.fecha_vencimiento,
                nombreProducto: product ? product.nombre_producto : '',
                unidadPeso: peso ? peso.unidad : '',
                cantidad: lote.cantidad
            });
    
            // Eliminar el lote
            await this.repositoryLotesDesperdiciados.create(lote);
            await this.repositoryLotes.delete(lote.lote_id);
        }
    
        if (detailedExpiredLotes.length > 0) {
            this.notify({
                type: 'ExpiredLotes',
                detailedExpiredLotes
            });
        }

        let message=`Expired batches correctly obtained: ${detailedExpiredLotes}` 
        this.log.addLog(message,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')
    
        return detailedExpiredLotes;
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

        const detailedExpiredLotes = await Promise.all(lotesToExpire.map(async (lote) => {
            // Obtener información del producto asociado al lote
            const product = await this.repositoryProductoBodega.getById(lote.producto_bodega_id);
    
            // Obtener la información del peso asociado al producto
            const peso = product ? await this.repositoryPeso.getById(product.peso_proveedor_id) : null;
    
            return {
                lote_id: lote.lote_id,
                fecha_vencimiento: lote.fecha_vencimiento,
                nombreProducto: product ? product.nombre_producto : '',
                unidadPeso: peso ? peso.unidad : '',
                cantidad:lote.cantidad
            };
        }));

        if(lotesToExpire !== null ) this.notify({
            type: 'LotesToExpired',
            detailedExpiredLotes
        })

        let message=`Batches were correctly obtained due to expiration date: ${lotesToExpire}` 
        this.log.addLog(message,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')
    
        return lotesToExpire;
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

        let message=`The products that are about to reach their maximum were correctly obtained.: ${productsNearOrAboveMaximum}` 
        this.log.addLog(message,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')
    
        return productsNearOrAboveMaximum;
    }

    /**
     * Searches for products in the 'bodega' (warehouse) based on a specific attribute.
     * 
     * @param attributeName - The name of the attribute to search by.
     * @param searchValue - The value to search for in the attribute.
     * @returns An array of products that match the search criteria.
     */
    async searchProductsBodegaByAttribute(attributeName: keyof productosbodega | 'Proveedor' | 'fecha_vencimiento', searchValue: string) {
        const allProducts = await this.repositoryProductoBodega.getAll();
        let filteredProducts = [];
    
        if (attributeName === 'Proveedor') {
            const allProveedores = await this.repositoryProveedor.getAll();
            const filteredProveedores = allProveedores.filter(proveedor => proveedor.nombre_proveedor.toLowerCase().includes(searchValue.toLowerCase()));
            const filteredProductIds = filteredProveedores.map(proveedor => proveedor.proveedor_id);
            filteredProducts = allProducts.filter(product => filteredProductIds.includes(product.proveedor_id));
        } else if (attributeName === 'fecha_vencimiento') {
            const allLotes = await this.repositoryLotes.getAll();
            const filteredLotes = allLotes.filter(lote => new Date(lote.fecha_vencimiento).toISOString().split('T')[0] === searchValue);
            const filteredProductIds = filteredLotes.map(lote => lote.producto_bodega_id);
            filteredProducts = allProducts.filter(product => filteredProductIds.includes(product.producto_bodega_id));
        } else {
            filteredProducts = allProducts.filter(product => {
                const attributeValue = product[attributeName];
                if (typeof attributeValue === 'string') {
                    return attributeValue.toLowerCase().includes(searchValue.toLowerCase());
                }
                return false;
            });
        }
    
        // Construir la información completa para cada producto filtrado
        const productosConLotes = await Promise.all(filteredProducts.map(async (producto) => {
            const peso = await this.repositoryPeso.getById(producto.peso_proveedor_id);
            const lotes = await this.repositoryLotes.getAllByField('producto_bodega_id', producto.producto_bodega_id);
            const proveedor = await this.repositoryProveedor.getById(producto.proveedor_id);
    
            return {
                prodbodega: {
                    ...producto,
                    unidadPeso: peso ? peso.unidad : '',
                    simboloPeso: peso ? peso.simbolo : '',
                    tipoPeso: peso ? peso.tipo : '',
                    lotes: lotes,
                    proveedor: proveedor || null,
                    isIconoX: false
                }
            };
        }));

        let message=`The search was successful: ${productosConLotes}` 
        this.log.addLog(message,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')
    
        return productosConLotes;
    }
    
    
    
    /**
     * Retrieves detailed information about all products in the warehouse, including their weight and associated lots.
     * 
     * @returns An array of objects, each containing detailed information about a warehouse product, its weight, and its lots.
     */
    async getProductosBodegaWithLotes() {
        try {
            // Obtener todos los productos de bodega
            const productosBodega = await this.repositoryProductoBodega.getAll();
    
            // Construir la información completa para cada producto
            const productosConLotes = await Promise.all(productosBodega.map(async (producto) => {
                // Obtener el peso asociado al producto
                const peso = await this.repositoryPeso.getById(producto.peso_proveedor_id);
    
                // Obtener los lotes asociados a este producto
                const lotes = await this.repositoryLotes.getAllByField('producto_bodega_id', producto.producto_bodega_id);

                const proveedor = await this.repositoryProveedor.getAllByField('proveedor_id', producto.proveedor_id);

    
                // Construir el objeto con información del producto, sus lotes y el peso
                return {
                    prodbodega: {
                        ...producto,
                        unidadPeso: peso ? peso.unidad : '',
                        simboloPeso: peso ? peso.simbolo : '',
                        tipoPeso: peso ? peso.tipo : '',
                        lotes: lotes,
                        proveedor:proveedor[0],
                        isIconoX: false
                    }
                };
            }));

            let message=`The products with their batches were correctly obtained: ${productosConLotes}` 
            this.log.addLog(message,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')
    
            return productosConLotes;
        } catch (error) {
            let errorMessage=`Error al obtener productos con lotes y peso: ${error}` 
            this.log.addLog(errorMessage,'Apitransaccional','Módulo gestion de productos alimenticios almacenados en bodega')
            throw new Error(errorMessage);
        }
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

        if(productsNearOrBelowMinimum !== null ) this.notify({
            type: 'ProductsMinimun',
            productsNearOrBelowMinimum
        })
        

    
        return productsNearOrBelowMinimum;
    }
    
    
    
}