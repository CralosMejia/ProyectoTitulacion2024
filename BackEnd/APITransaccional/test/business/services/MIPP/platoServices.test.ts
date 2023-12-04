import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { PlatosServices } from '../../../../app/business/services/MIPP/platoServices';
import { container } from '../../../../config/inversify.config';

import { DataScienceDB, PacificoDB } from "../../../../config/db";
import * as modelPacifico from '../../../../app/data/models/RestaurantePacificoDB/init-models'
import * as modelDataScience from '../../../../app/data/models/DataScienceDB/init-models'

//Inicializo los modelos de la base de datos RestaurantePacifico
PacificoDB.authenticate().then(() => console.log('Database RestaurantePacifico connected...'));
modelPacifico.initModels(PacificoDB);

//Inicializo los modelos de la base de datos DataScience
DataScienceDB.authenticate().then(() => console.log('Database DataSciencePacificoDB connected...'));
modelDataScience.initModels(DataScienceDB);

const platosService = container.get<PlatosServices>(PlatosServices)

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
                    "peso_id": 1,
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

    describe('PlatosServices', () => {
        describe('changeState', () => {
            it('should change the state of a plato to "No disponible" by its ID', async () => {
                const platoId = 1; // Suponiendo que este ID existe
        
                const result = await platosService.changeState(platoId);
        
                expect(result).toBeTruthy(); // Verifica que la actualización fue exitosa
                // Aquí podrías añadir más expectativas, como verificar el nuevo estado del plato si es posible.
            });
    
            it('should return false if plato does not exist', async () => {
                const invalidPlatoId = 9999; // Un ID que no existe
    
                const result = await platosService.changeState(invalidPlatoId);
    
                expect(result).toBeFalsy(); // Verifica que la actualización falla para un ID inexistente
            });
    
            // Puedes agregar más pruebas para otros casos especiales o errores.
        });
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
    
});
