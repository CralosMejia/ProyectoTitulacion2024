import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredientesporplato, ingredientesporplatoId } from './ingredientesporplato';
import type { ventas, ventasId } from './ventas';

export interface platosAttributes {
  plato_id: number;
  nombre_plato: string;
  descripcion?: string;
  precio?: number;
  imagen?: string;
  estado?: 'Disponible' | 'No disponible';
  numero_platos?: number;
}

export type platosPk = "plato_id";
export type platosId = platos[platosPk];
export type platosOptionalAttributes = "plato_id" | "descripcion" | "precio" | "imagen" | "estado" | "numero_platos";
export type platosCreationAttributes = Optional<platosAttributes, platosOptionalAttributes>;

export class platos extends Model<platosAttributes, platosCreationAttributes> implements platosAttributes {
  plato_id!: number;
  nombre_plato!: string;
  descripcion?: string;
  precio?: number;
  imagen?: string;
  estado?: 'Disponible' | 'No disponible';
  numero_platos?: number;

  // platos hasMany ingredientesporplato via plato_id
  ingredientesporplatos!: ingredientesporplato[];
  getIngredientesporplatos!: Sequelize.HasManyGetAssociationsMixin<ingredientesporplato>;
  setIngredientesporplatos!: Sequelize.HasManySetAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  addIngredientesporplato!: Sequelize.HasManyAddAssociationMixin<ingredientesporplato, ingredientesporplatoId>;
  addIngredientesporplatos!: Sequelize.HasManyAddAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  createIngredientesporplato!: Sequelize.HasManyCreateAssociationMixin<ingredientesporplato>;
  removeIngredientesporplato!: Sequelize.HasManyRemoveAssociationMixin<ingredientesporplato, ingredientesporplatoId>;
  removeIngredientesporplatos!: Sequelize.HasManyRemoveAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  hasIngredientesporplato!: Sequelize.HasManyHasAssociationMixin<ingredientesporplato, ingredientesporplatoId>;
  hasIngredientesporplatos!: Sequelize.HasManyHasAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  countIngredientesporplatos!: Sequelize.HasManyCountAssociationsMixin;
  // platos hasMany ventas via plato_id
  venta!: ventas[];
  getVenta!: Sequelize.HasManyGetAssociationsMixin<ventas>;
  setVenta!: Sequelize.HasManySetAssociationsMixin<ventas, ventasId>;
  addVentum!: Sequelize.HasManyAddAssociationMixin<ventas, ventasId>;
  addVenta!: Sequelize.HasManyAddAssociationsMixin<ventas, ventasId>;
  createVentum!: Sequelize.HasManyCreateAssociationMixin<ventas>;
  removeVentum!: Sequelize.HasManyRemoveAssociationMixin<ventas, ventasId>;
  removeVenta!: Sequelize.HasManyRemoveAssociationsMixin<ventas, ventasId>;
  hasVentum!: Sequelize.HasManyHasAssociationMixin<ventas, ventasId>;
  hasVenta!: Sequelize.HasManyHasAssociationsMixin<ventas, ventasId>;
  countVenta!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof platos {
    return platos.init({
    plato_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_plato: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.CHAR(70),
      allowNull: true,
      defaultValue: ""
    },
    precio: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Disponible','No disponible'),
      allowNull: true,
      defaultValue: "Disponible"
    },
    numero_platos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'platos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plato_id" },
        ]
      },
    ]
  });
  }
}
