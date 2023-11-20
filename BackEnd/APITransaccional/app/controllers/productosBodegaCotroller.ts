import { Request, Response  } from 'express';
import {productosbodega} from '../models/RestaurantePacificoDB/productosbodega'


const nameTable:string= 'Producto bodega';

export const createProductoBodega = async(req:Request, res:Response)=>{
    try {
        const  newOBJ =req.body
        await productosbodega.create(newOBJ).then((objectPar)=>{
            console.log(`${nameTable} created correctly: ${JSON.stringify(objectPar)}`)
            return res.status(200).json({
                newEntrie: objectPar
            })
        });
    } catch (error) {
        console.log(`An error has occurred in the process of creating ${nameTable}: ${error}`)
        res.status(400).send(error);
    }
}


export const getProductoBodega = async(_req:Request, res:Response)=>{
    try {
        await productosbodega.findAll({raw: true}).then(objectPar => {
            return res.status(200).json({
                entriesList: objectPar
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get ${nameTable}: ${error}`)
        res.status(400).send(error);
    }
}


export const getproductoBodegaById = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params

        await productosbodega.findByPk(id).then(objectPar => {
            return res.status(200).json({
                entrie: objectPar
            })
        })
    } catch (error) {
        console.log(`An error has occurred in the process of get ${nameTable} by id: ${error}`)
        res.status(400).send(error);
    }
}


export const updateProductoBodega = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentOBJ =await productosbodega.findByPk(id)
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
}


export const deleteProductoBodega = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentOBJ =await productosbodega.findByPk(id)

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
}