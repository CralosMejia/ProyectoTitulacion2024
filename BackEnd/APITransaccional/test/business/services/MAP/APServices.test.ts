import { PedidoAutomaticoService } from "../../../../app/business/services/MAP/PedidosAutomaticosServices";


describe('PedidosAutomaticosServices', () => {
    it('should create automatic orders correctly for a given date', async () => {
        const paServices = new PedidoAutomaticoService();
        let errorOccurred = false;

        try {
            await paServices.crearPedidosAutomaticos('2023-01-01');
        } catch (error) {
            errorOccurred = true;
            console.error('Error during test:', error);
        }

        expect(errorOccurred).toBeFalsy();
    });
});
