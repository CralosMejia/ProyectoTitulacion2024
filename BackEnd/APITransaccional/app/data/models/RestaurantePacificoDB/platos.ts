import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { detallefactura, detallefacturaId } from './detallefactura';
import type { ingredientesporplato, ingredientesporplatoId } from './ingredientesporplato';

export interface platosAttributes {
  plato_id: number;
  nombre_plato: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  estado?: 'Disponible' | 'No disponible';
}

export type platosPk = "plato_id";
export type platosId = platos[platosPk];
export type platosOptionalAttributes = "plato_id" | "imagen" | "estado";
export type platosCreationAttributes = Optional<platosAttributes, platosOptionalAttributes>;

export class platos extends Model<platosAttributes, platosCreationAttributes> implements platosAttributes {
  plato_id!: number;
  nombre_plato!: string;
  descripcion!: string;
  precio!: number;
  imagen?: string;
  estado?: 'Disponible' | 'No disponible';

  // platos hasMany detallefactura via plato_id
  detallefacturas!: detallefactura[];
  getDetallefacturas!: Sequelize.HasManyGetAssociationsMixin<detallefactura>;
  setDetallefacturas!: Sequelize.HasManySetAssociationsMixin<detallefactura, detallefacturaId>;
  addDetallefactura!: Sequelize.HasManyAddAssociationMixin<detallefactura, detallefacturaId>;
  addDetallefacturas!: Sequelize.HasManyAddAssociationsMixin<detallefactura, detallefacturaId>;
  createDetallefactura!: Sequelize.HasManyCreateAssociationMixin<detallefactura>;
  removeDetallefactura!: Sequelize.HasManyRemoveAssociationMixin<detallefactura, detallefacturaId>;
  removeDetallefacturas!: Sequelize.HasManyRemoveAssociationsMixin<detallefactura, detallefacturaId>;
  hasDetallefactura!: Sequelize.HasManyHasAssociationMixin<detallefactura, detallefacturaId>;
  hasDetallefacturas!: Sequelize.HasManyHasAssociationsMixin<detallefactura, detallefacturaId>;
  countDetallefacturas!: Sequelize.HasManyCountAssociationsMixin;
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
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Disponible','No disponible'),
      allowNull: true,
      defaultValue: "Disponible"
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
