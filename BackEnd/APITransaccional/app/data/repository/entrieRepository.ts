import { CreationAttributes, Model, ModelStatic } from 'sequelize';

export class EntrieRepository<T extends Model> {
    private model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    // Crear una nueva entrada
    async create(entry: CreationAttributes<T>): Promise<T> {
        try {
            return await this.model.create(entry);
        } catch (error) {
            throw new Error(`Error al crear una nueva entrada: ${error}`);
        }
    }

    // Obtener todas las entradas
    async getAll(): Promise<T[]> {
        try {
            return await this.model.findAll({raw: true});
        } catch (error) {
            throw new Error(`Error al obtener todas las entradas: ${error}`);
        }
    }

    // Obtener una entrada por ID
    async getById(id: number): Promise<T | null> {
        try {
            return await this.model.findByPk(id);
        } catch (error) {
            throw new Error(`Error al obtener la entrada con ID ${id}: ${error}`);
        }
    }

    // Actualizar una entrada por ID
    async update(id: number, updatedData: Partial<T>): Promise<T | null> {
        try {
            const entry = await this.model.findByPk(id);
            if (entry) {
                return await entry.update(updatedData);
            }
            return null;
        } catch (error) {
            throw new Error(`Error al actualizar la entrada con ID ${id}: ${error}`);
        }
    }

    // Eliminar una entrada por ID
    async delete(id: number): Promise<boolean> {
        try {
            const entry = await this.model.findByPk(id);
            if (entry) {
                await entry.destroy();
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Error al eliminar la entrada con ID ${id}: ${error}`);
        }
    }

    // Método para crear entradas en masa
    async bulkCreate(entries: CreationAttributes<T>[]): Promise<T[]> {
        try {
            return await this.model.bulkCreate(entries);
        } catch (error) {
            throw new Error(`Error al realizar inserción masiva: ${error}`);
        }
    }

    // Obtener todas las entradas en función de un campo y valor específico
    async getAllByField(field: keyof T, value: any): Promise<T[]> {
        try {
            const whereClause: any = {};
            whereClause[field] = value;

            return await this.model.findAll({
                where: whereClause,
                raw: true
            });
        } catch (error) {
            throw new Error(`Error al obtener las entradas por ${String(field)}: ${error}`);
        }
    }

    // Eliminar todas las entradas en función de un campo y valor específico
    async deleteAllByField(field: keyof T, value: any): Promise<number> {
        try {
            const whereClause: any = {};
            whereClause[field] = value;

            return await this.model.destroy({
                where: whereClause
            });
        } catch (error) {
            throw new Error(`Error al eliminar las entradas por ${String(field)}: ${error}`);
        }
    }
}
