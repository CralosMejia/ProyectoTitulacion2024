import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredientesporplato, ingredientesporplatoId } from './ingredientesporplato';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface pesoAttributes {
  peso_id: number;
  unidad: string;
  simbolo: string;
}

export type pesoPk = "peso_id";
export type pesoId = peso[pesoPk];
export type pesoOptionalAttributes = "peso_id";
export type pesoCreationAttributes = Optional<pesoAttributes, pesoOptionalAttributes>;

export class peso extends Model<pesoAttributes, pesoCreationAttributes> implements pesoAttributes {
  peso_id!: number;
  unidad!: string;
  simbolo!: string;

  // peso hasMany ingredientesporplato via peso_id
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
  // peso hasMany productosbodega via peso_id
  productosbodegas!: productosbodega[];
  getProductosbodegas!: Sequelize.HasManyGetAssociationsMixin<productosbodega>;
  setProductosbodegas!: Sequelize.HasManySetAssociationsMixin<productosbodega, productosbodegaId>;
  addProductosbodega!: Sequelize.HasManyAddAssociationMixin<productosbodega, productosbodegaId>;
  addProductosbodegas!: Sequelize.HasManyAddAssociationsMixin<productosbodega, productosbodegaId>;
  createProductosbodega!: Sequelize.HasManyCreateAssociationMixin<productosbodega>;
  removeProductosbodega!: Sequelize.HasManyRemoveAssociationMixin<productosbodega, productosbodegaId>;
  removeProductosbodegas!: Sequelize.HasManyRemoveAssociationsMixin<productosbodega, productosbodegaId>;
  hasProductosbodega!: Sequelize.HasManyHasAssociationMixin<productosbodega, productosbodegaId>;
  hasProductosbodegas!: Sequelize.HasManyHasAssociationsMixin<productosbodega, productosbodegaId>;
  countProductosbodegas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof peso {
    return peso.init({
    peso_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    unidad: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    simbolo: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'peso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "peso_id" },
        ]
      },
    ]
  });
  }

  toString():string{
    return `{peso_id: ${this.peso_id}, unidad: ${this.unidad}, simbolo: ${this.simbolo} }`
  }
}
