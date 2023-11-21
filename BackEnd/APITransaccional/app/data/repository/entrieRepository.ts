import { CreationAttributes, Model, ModelStatic } from 'sequelize';

/**
 * A generic repository class for handling database operations.
 */
export class EntrieRepository<T extends Model> {
    private model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    /**
     * Creates a new entry in the database.
     * 
     * @param entry - The data for the new entry.
     * @returns A promise that resolves to the created entry.
     */
    async create(entry: CreationAttributes<T>): Promise<T> {
        try {
            return await this.model.create(entry);
        } catch (error) {
            throw new Error(`Error al crear una nueva entrada: ${error}`);
        }
    }

   /**
     * Retrieves all entries from the database.
     * 
     * @returns A promise that resolves to an array of entries.
     */
    async getAll(): Promise<T[]> {
        try {
            return await this.model.findAll({raw: true});
        } catch (error) {
            throw new Error(`Error al obtener todas las entradas: ${error}`);
        }
    }

    /**
     * Retrieves an entry by its ID.
     * 
     * @param id - The ID of the entry to retrieve.
     * @returns A promise that resolves to the found entry or null if not found.
     */
    async getById(id: number): Promise<T | null> {
        try {
            return await this.model.findByPk(id);
        } catch (error) {
            throw new Error(`Error al obtener la entrada con ID ${id}: ${error}`);
        }
    }

    /**
     * Updates an entry by its ID.
     * 
     * @param id - The ID of the entry to update.
     * @param updatedData - The data to update the entry with.
     * @returns A promise that resolves to the updated entry or null if not found.
     */
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

    /**
     * Deletes an entry by its ID.
     * 
     * @param id - The ID of the entry to delete.
     * @returns A promise that resolves to true if the entry was deleted, or false otherwise.
     */
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

    /**
     * Creates multiple entries in a bulk operation.
     * 
     * @param entries - An array of entry data to create.
     * @returns A promise that resolves to an array of created entries.
     */
    async bulkCreate(entries: CreationAttributes<T>[]): Promise<T[]> {
        try {
            return await this.model.bulkCreate(entries);
        } catch (error) {
            throw new Error(`Error al realizar inserción masiva: ${error}`);
        }
    }

    /**
     * Retrieves all entries that match a specific field and value.
     * 
     * @param field - The field to match.
     * @param value - The value to match against the field.
     * @returns A promise that resolves to an array of matching entries.
     */
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

    /**
     * Deletes all entries that match a specific field and value.
     * 
     * @param field - The field to match.
     * @param value - The value to match against the field.
     * @returns A promise that resolves to the number of entries deleted.
     */
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
