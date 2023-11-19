import { Request, Response  } from 'express';
import {peso} from '../models/RestaurantePacificoDB/peso'




export const createPeso = async(req:Request, res:Response)=>{
    try {
        const  newPeso =req.body
        await peso.create(newPeso).then((peso_par)=>{
            console.log(`Peso created correctly: ${JSON.stringify(peso_par)}`)
            return res.status(200).json({
                newPeso: peso_par
            })
        });
    } catch (error) {
        console.log(`an error occurred: ${error}`)
        res.status(400).send(error);
    }
}


export const getPeso = async(_req:Request, res:Response)=>{
    try {
        await peso.findAll({raw: true}).then(pesos => {
            return res.status(200).json({
                pesos
            })
        })
    } catch (error) {
        console.log(`an error occurred: ${error}`)
        res.status(400).send(error);
    }
}


export const getPesoById = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params

        await peso.findByPk(id).then(pesos => {
            return res.status(200).json({
                pesos
            })
        })
    } catch (error) {
        console.log(`an error occurred: ${error}`)
        res.status(400).send(error);
    }
}


export const updatePeso = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentPeso =await peso.findByPk(id)
        const newPeso  =req.body

        if (currentPeso) {

            await currentPeso.update(newPeso).then((pesoUpdated)=>{
                console.log(`Peso updated correctly: ${JSON.stringify(pesoUpdated)}`)
                return res.status(200).json({
                    updatedPeso: pesoUpdated
                })
            })

        } else {
            res.status(404).send('Peso not found');
        }
    } catch (error) {
        console.log(`an error occurred: ${error}`)
        res.status(400).send(error);
    }
}

export const deletePeso = async(req:Request, res:Response)=>{
    try {
        const{id}=req.params
        const currentPeso =await peso.findByPk(id)

        if (currentPeso) {

            await currentPeso.destroy().then(()=>{
                console.log(`Peso deleted correctly: ${JSON.stringify(currentPeso)}`)
                return res.status(200).json({
                    deletedPeso: currentPeso
                })
            })

        } else {
            res.status(404).send('Peso not found');
        }
    } catch (error) {
        console.log(`an error occurred: ${error}`)
        res.status(400).send(error);
    }
}