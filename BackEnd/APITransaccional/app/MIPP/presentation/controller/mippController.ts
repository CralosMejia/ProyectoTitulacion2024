import { Request, Response  } from 'express';
import { PlatosServices } from '../../business/services/platoServices';



export const create = async(req:Request, res:Response)=>{
    const platosServ=  new PlatosServices();
    const plato = req.body.plato
    const ingredientesList = req.body.ingredientes

    await platosServ.createPlatoComplete(plato, ingredientesList).then(resp=>{
        console.log(`Created correctly: ${JSON.stringify(resp)}`)
        return res.status(200).json(resp)
    }).catch( error => console.error('Error al crear el plato y sus ingredientes:', error))
}



export const getInfoPlatos = async(_req:Request, res:Response)=>{
    const platosServ=  new PlatosServices();

    await platosServ.showInfoPlatos().then(resp=>{
        return res.status(200).json(resp)
    }).catch( error => console.error('Error al obtener la informaciondel plato  y sus ingredientes:', error))
}


export const deletePlatoComplete = async(req:Request, res:Response)=>{
    const platosServ=  new PlatosServices();
    const{id}=req.params

    await platosServ.deletePlato(Number(id)).then(resp=>{
        console.log(`Deleted correctly: ${JSON.stringify(resp)}`)
        return res.status(200).json(resp)
    }).catch( error => console.error('Error al eliminar el plato y sus ingredientes:', error))
}
