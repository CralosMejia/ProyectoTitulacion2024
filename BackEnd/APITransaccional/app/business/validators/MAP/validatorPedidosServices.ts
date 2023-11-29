import { OrderStatus } from "../../../data/models/AuxModels/OrderStatus";
import { ordenes } from "../../../data/models/RestaurantePacificoDB/ordenes";
import { EntrieRepository } from "../../../data/repository/entrieRepository";

/**
 * Service class for validating operations related to orders.
 */
export class ValidatorPedidosServices{

    private readonly repositoryOrdenes: EntrieRepository<ordenes>;

    constructor(){
        this.repositoryOrdenes =  new EntrieRepository(ordenes);
    }

    /**
     * Validates whether an order can be managed (updated, deleted) based on its current state.
     * 
     * @param ordenId - The ID of the order to be validated.
     * @returns True if the order is in a state that allows management.
     * @throws An error if the order does not exist or is in an unmanageable state.
     */
    async validateManageDeatelleOrden(ordenId: number){
        const order = await this.repositoryOrdenes.getById(ordenId);
        if (!order) throw new Error(`Order with ID ${ordenId} does not exist.`);
        
        if (order.estado !== 'En espera' && order.estado !== 'Aprobado') {
            throw new Error(`Order with ID ${ordenId} is not in 'En espera' or 'Aprobado' state. Current state is '${order.estado}'.`);
        }

        return true;
    }

    /**
     * Validates the transition from the current order status to a new status.
     * 
     * @param currentStatus - The current status of the order.
     * @param newStatus - The new status to transition to.
     * @throws An error if the transition is invalid.
     */
    validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
        if (!this.validTransitions[currentStatus] || !this.validTransitions[currentStatus].includes(newStatus)) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}.`);
        }
    }

    // A map of valid status transitions for orders
    private validTransitions: Record<OrderStatus, OrderStatus[]> = {
        'En espera': ['Aprobado', 'Cancelado'],
        'Aprobado': ['Cancelado', 'En espera','Enviado'],
        'Enviado': ['Recibido'],
        'Recibido': [],
        'Cancelado': []
    };
}