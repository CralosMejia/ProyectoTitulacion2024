import { Request, Response  } from 'express';
import { Model, ModelStatic } from 'sequelize';



/**
 * Returns a function to handle the retrieval of all entries from a specified table.
 * 
 * @param model - The Sequelize model representing the table.
 * @param nameTable - The name of the table.
 * @returns An asynchronous function that handles the request and response for getting all entries.
 */
export const getEntries= <T extends ModelStatic<Model>> (
    model: T,
    nameTable: string
    ) => {
    return async (_req: Request, res: Response) => {
        try {
            await model.findAll({raw: true}).then(objectPar => {
                return res.status(200).json({
                    entriesList: objectPar
                })
            })
        } catch (error) {
            console.log(`An error has occurred in the process of get ${nameTable}: ${error}`)
            res.status(400).send(error);
        }
    };
};

/**
 * Returns a function to handle the creation of a new entry in a specified table.
 * 
 * @param model - The Sequelize model representing the table.
 * @param nameTable - The name of the table.
 * @returns An asynchronous function that handles the request and response for creating a new entry.
 */
export const createEntrie= <T extends ModelStatic<Model>> (
    model: T,
    nameTable: string
    ) => {
    return async (req: Request, res: Response) => {
        try {
            const  newOBJ =req.body
            await model.create(newOBJ).then((objectPar)=>{
                console.log(`${nameTable} created correctly: ${JSON.stringify(objectPar)}`)
                return res.status(200).json({
                    newEntrie: objectPar
                })
            });
        } catch (error) {
            console.log(`An error has occurred in the process of creating ${nameTable}: ${error}`)
            res.status(400).send(error);
        }
    };
};

/**
 * Returns a function to handle the retrieval of a specific entry by ID from a specified table.
 * 
 * @param model - The Sequelize model representing the table.
 * @param nameTable - The name of the table.
 * @returns An asynchronous function that handles the request and response for getting an entry by ID.
 */
export const getEntrieById= <T extends ModelStatic<Model>> (
    model: T,
    nameTable: string
    ) => {
    return async (req: Request, res: Response) => {
        try {
            const{id}=req.params
    
            await model.findByPk(id).then(objectPar => {
                return res.status(200).json({
                    entrie: objectPar
                })
            })
        } catch (error) {
            console.log(`An error has occurred in the process of get ${nameTable} by id: ${error}`)
            res.status(400).send(error);
        }
    };
};

/**
 * Returns a function to handle the update of an existing entry in a specified table.
 * 
 * @param model - The Sequelize model representing the table.
 * @param nameTable - The name of the table.
 * @returns An asynchronous function that handles the request and response for updating an entry.
 */
export const updateEntrie= <T extends ModelStatic<Model>> (
    model: T,
    nameTable: string
    ) => {
    return async (req: Request, res: Response) => {
        try {
            const{id}=req.params
            const currentOBJ =await model.findByPk(id)
            const newOBJ  =req.body
    
            if (currentOBJ) {
    
                await currentOBJ.update(newOBJ).then((objectPar)=>{
                    console.log(`${nameTable} updated correctly: ${JSON.stringify(objectPar)}`)
                    return res.status(200).json({
                        entrieUpdate: objectPar
                    })
                })
    
            } else {
                res.status(404).send(`${nameTable} not found`);
            }
        } catch (error) {
            console.log(`An error has occurred in the ${nameTable} update process: ${error}`)
            res.status(400).send(error);
        }
    };
};

/**
 * Returns a function to handle the deletion of an entry from a specified table.
 * 
 * @param model - The Sequelize model representing the table.
 * @param nameTable - The name of the table.
 * @returns An asynchronous function that handles the request and response for deleting an entry.
 */
export const deleteEntrie= <T extends ModelStatic<Model>> (
    model: T,
    nameTable: string
    ) => {
    return async (req: Request, res: Response) => {
        try {
            const{id}=req.params
            const currentOBJ =await model.findByPk(id)
    
            if (currentOBJ) {
    
                await currentOBJ.destroy().then(()=>{
                    console.log(`${nameTable} deleted correctly: ${JSON.stringify(currentOBJ)}`)
                    return res.status(200).json({
                        deletedEntrie: currentOBJ
                    })
                })
    
            } else {
                res.status(404).send(`${nameTable} not found`);
            }
        } catch (error) {
            console.log(`An error has occurred in the ${nameTable} delete process: ${error}`)
            res.status(400).send(error);
        }
    };
};
