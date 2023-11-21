import { PlatosServices } from "../../../../app/MIPP/business/services/platoServices";
// import { ingredientesporplatoInterface } from "../../../../app/data/models/iterfacesModels/ingredientePorPlatoInt";
// import { platosInterface } from "../../../../app/data/models/iterfacesModels/platoInt";


const plato:any ={
    nombre_plato: "Ceviche de coco",
    descripcion: "ceviche de coco con agua",
    precio: 16.00,
    estado: "disponible"
    
}
// const listIppInterRes:ingredientesporplatoInterface[]=[
//     {
//         plato_id: 1,
//         producto_bodega_id:1,
//         peso_id: 1,
//         cantidad_necesaria:2.5,
//     },
//     {
//         plato_id: 1,
//         producto_bodega_id:1,
//         peso_id: 1,
//         cantidad_necesaria:2.5,
        
//     },

// ]

// const listIppInter:ingredientesporplatoInterface[]=[
//     {
//         producto_bodega_id:1,
//         peso_id: 1,
//         cantidad_necesaria:2.5
//     },
//     {
//         producto_bodega_id:1,
//         peso_id: 1,
//         cantidad_necesaria:2.5
//     },

// ]





describe('platoServices', () => {
    // it('should correctly calculate VAT at default rate', () => {
    //     const paltoC = new PlatosServices(plato,listIppInter)

    //     const res = paltoC.createPlato();
    //     console.log(res)

    //     expect(res).toEqual(listIppInterRes);
    // });

    // it('should correctly calculate VAT at default rate', () => {
    //     const paltoC = new PlatosServices()

    //     const res = paltoC.createPlatoComplete(plato,listIppInter);
    //     console.log(res)

    //     expect(res).toBeNull();
    // });

    it('should correctly calculate VAT at default rate', () => {
        const paltoC = new PlatosServices()

        const res = paltoC.createPlato(plato).then();

        expect(res).toBeTruthy();
    });

});
