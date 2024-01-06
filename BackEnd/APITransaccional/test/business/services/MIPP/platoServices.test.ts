import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { PlatosServices } from '../../../../app/business/services/MIPP/platoServices';
import { container } from '../../../../config/inversify.config';

import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'
import { EntrieRepository } from '../../../../app/data/repository/entrieRepository';

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

const platosService = container.get<PlatosServices>(PlatosServices)

const repositoryIPP =  new EntrieRepository(modelPacifico.ingredientesporplato);


describe('PlatosServices', () => {
    describe('createPlatoComplete', () => {
        it('should create a new plato with its ingredients', async () => {
            const plato:any = {
                "nombre_plato": "Ceviche de coco",
                "descripcion": "ceviche de coco con agua",
                "precio": 16.00,
                "estado": "disponible"
            };
            const listIppInter:any = [
                {
                    "producto_bodega_id": 1,
                    "peso_id": 6,
                    "cantidad_necesaria": "5.00"
                },
                {
                    "producto_bodega_id": 2,
                    "peso_id": 7,
                    "cantidad_necesaria": "7.00"
                }
            ];

            const result = await platosService.createPlatoComplete(plato, listIppInter);

            expect(result).toHaveProperty('plato');
            expect(result).toHaveProperty('lista de ingredientes');
            // Aquí puedes agregar más expectativas según la lógica de tu aplicación.
        });

        // Aquí podrías agregar más pruebas para casos de error, como ingredientes inválidos.
    });

    describe('showInfoPlatos', () => {
        it('should retrieve detailed information for all platos', async () => {
            const result = await platosService.showInfoPlatos();
    
            expect(Array.isArray(result)).toBeTruthy();
            // Verificar que cada objeto en el array tenga la estructura esperada
            // y los campos necesarios.
        });
    
        // Pruebas adicionales podrían incluir casos donde no hay platos disponibles.
    });

    describe('changeState', () => {
        it('should change the state of a plato to "No disponible" by its ID', async () => {
            const platoId = 1; // Suponiendo que este ID existe
    
            const result = await platosService.changeState(platoId);
    
            expect(result).toBeTruthy(); // Verifica que la actualización fue exitosa
            // Aquí podrías añadir más expectativas, como verificar el nuevo estado del plato si es posible.
        });

        it('should return false if plato does not exist', async () => {
            const invalidPlatoId = 9999; // Un ID que no existe


            let errorOccurred = false;
            let capturedError: Error | null = null;
    
            try {
                await platosService.changeState(invalidPlatoId);

            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }
            
    
            // Verificar que se lanzó un error
            expect(errorOccurred).toBeTruthy();

            // Verificar que el error capturado es del tipo o tiene el mensaje esperado
            expect(capturedError).toBeDefined();
        });

        // Puedes agregar más pruebas para otros casos especiales o errores.
    });
    
    
    describe('createMultiplePlatosWithIngredients', () => {
        it('should create multiple platos with their ingredients', async () => {

            const jsonData = fs.readFileSync(path.join(__dirname, './data/platosConIngredientes.json'), 'utf8');

            const platosWithIngredients: any[] = JSON.parse(jsonData);
    
            const result = await platosService.createMultiplePlatosWithIngredients(platosWithIngredients);
    
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toBe(platosWithIngredients.length);
            // Verificar la estructura y contenido de cada objeto en el resultado.
        });
    
        // Pruebas adicionales para manejar errores y casos especiales.
    });

    describe('getPlatoCompleteInfo', () => {
        it('should retrieve complete information for a given plato', async () => {
            const platoId = 1; // Asegúrate de que este ID exista en tu base de datos para la prueba

            let result;
            let errorOccurred = false;

            try {
                result = await platosService.getPlatoCompleteInfo(platoId);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(result).toBeDefined();
            expect(result.plato).toBeDefined();
            expect(result.ingredientes).toBeDefined();
            // Aquí puedes añadir más aserciones específicas sobre los datos retornados
        });

        it('should throw an error if the plato is not found', async () => {
            const platoId = -1; // Un ID que no existe en la base de datos

            let errorOccurred = false;
            let capturedError: Error | null = null;

            try {
                await platosService.getPlatoCompleteInfo(platoId);
            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }

            expect(errorOccurred).toBeTruthy();
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain(`Plato with ID ${platoId} not found.`);
        });
    });

    describe('addIngredientToPlato', () => {
        it('should add a new ingredient to a plato', async () => {
            // Crea un objeto de ingrediente de prueba
            const newIngrediente: any = {
                "plato_id": 1,
                "producto_bodega_id": 1,
                "peso_id": 5,
                "cantidad_necesaria": "5.00"
            };

            let result;
            let errorOccurred = false;

            try {
                result = await platosService.addIngredientToPlato(newIngrediente);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(result).toBeDefined();
            // Aquí puedes añadir más aserciones específicas sobre el ingrediente añadido
        });
    });

    describe('deleteIngredientOfPlato', () => {
        it('should delete an ingredient of a plato', async () => {

            let result;
            let errorOccurred = false;

            const ipp=await repositoryIPP.getAll()
            let ingredienteId=1

            // Verificar si hay detalles de órdenes disponibles
            if (ipp && ipp.length > 0) {
                // Ordenar los detalles por ID en orden descendente
                const sortedIpp = ipp.sort((a, b) => b.ingrediente_plato_id - a.ingrediente_plato_id);

                // El primer elemento ahora es el que tiene el ID más alto
                const lastIpp = sortedIpp[0];

                // Obtener el ID del último detalle de la orden
                ingredienteId = lastIpp.ingrediente_plato_id;

                // Utilizar lastOrderDetailId según sea necesario
            }

            try {
                result = await platosService.deleteIngredientOfPlato(ingredienteId);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(result).toBeTruthy();
            // Aquí puedes añadir más aserciones específicas sobre el resultado de la eliminación
        });

        it('should throw an error if the ingrediente is not found', async () => {
            const ingredienteId = -1; // Un ID que no existe en la base de datos

            let errorOccurred = false;
            let capturedError: Error | null = null;

            try {
                await platosService.deleteIngredientOfPlato(ingredienteId);
            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }

            expect(errorOccurred).toBeTruthy();
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain(`Ingrediente with ID ${ingredienteId} not found.`);
        });

    });

    describe('updateIngredientOfPlato', () => {
        it('should update an ingredient of a plato', async () => {
            const ingredienteId = 1; // Asegúrate de que este ID exista en tu base de datos para la prueba
            const updatedData: any = {
                cantidad_necesaria:10
            };

            let result;
            let errorOccurred = false;

            try {
                result = await platosService.updateIngredientOfPlato(ingredienteId, updatedData);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(result).toBeDefined();
        });

        it('should throw an error if the ingrediente is not found', async () => {
            const ingredienteId = -1; // Un ID que no existe en la base de datos
            const updatedData: any = {
                cantidad_necesaria:10
            };

            let errorOccurred = false;
            let capturedError;

            try {
                await platosService.updateIngredientOfPlato(ingredienteId, updatedData);
            } catch (error) {
                errorOccurred = true;
                capturedError = error as Error;
            }

            expect(errorOccurred).toBeTruthy();
            expect(capturedError).toBeDefined();
            expect(capturedError?.message).toContain(`Ingrediente with ID ${ingredienteId} not found.`);
        });

    });

    describe('searchPlatosWithFullInfo', () => {
        it('should retrieve platos filtered by a specific attribute', async () => {
            const attributeName = 'nombre_plato'; // Ejemplo de atributo
            const searchValue = 'Pap'; // Valor de búsqueda para la prueba

            let result;
            let errorOccurred = false;

            try {
                result = await platosService.searchPlatosWithFullInfo(attributeName, searchValue);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(Array.isArray(result)).toBeTruthy();
        });

        it('should retrieve platos filtered by ingredient', async () => {
            const attributeName = 'Ingrediente'; // Búsqueda por ingrediente
            const searchValue = 'ingrediente'; // Valor de búsqueda para la prueba

            let result;
            let errorOccurred = false;

            try {
                result = await platosService.searchPlatosWithFullInfo(attributeName, searchValue);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(Array.isArray(result)).toBeTruthy();
        });

    });

    describe('searchIngredientsByProductName', () => {
        it('should retrieve ingredients of a plato filtered by product name', async () => {
            const platoId = 1; // Asegúrate de que este ID exista en tu base de datos para la prueba
            const productName = 'acei'; // Valor de búsqueda para la prueba

            let result;
            let errorOccurred = false;

            try {
                result = await platosService.searchIngredientsByProductName(platoId, productName);
            } catch (error) {
                errorOccurred = true;
                console.error('Error during test:', error);
            }

            expect(errorOccurred).toBeFalsy();
            expect(Array.isArray(result)).toBeTruthy();
            // Aquí puedes añadir más aserciones específicas sobre los ingredientes filtrados
        });

        // Aquí puedes añadir más casos de prueba según sea necesario, por ejemplo, para verificar qué pasa
        // cuando no hay ingredientes que coincidan con el nombre del producto
    });

    
});
