import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { peso, pesoId } from './peso';
import type { platos, platosId } from './platos';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface ingredientesporplatoAttributes {
  ingrediente_plato_id: number;
  plato_id: number;
  producto_bodega_id: number;
  peso_id: number;
  cantidad_necesaria?: number;
}

export type ingredientesporplatoPk = "ingrediente_plato_id";
export type ingredientesporplatoId = ingredientesporplato[ingredientesporplatoPk];
export type ingredientesporplatoOptionalAttributes = "ingrediente_plato_id" | "cantidad_necesaria";
export type ingredientesporplatoCreationAttributes = Optional<ingredientesporplatoAttributes, ingredientesporplatoOptionalAttributes>;

export class ingredientesporplato extends Model<ingredientesporplatoAttributes, ingredientesporplatoCreationAttributes> implements ingredientesporplatoAttributes {
  ingrediente_plato_id!: number;
  plato_id!: number;
  producto_bodega_id!: number;
  peso_id!: number;
  cantidad_necesaria?: number;

  // ingredientesporplato belongsTo peso via peso_id
  peso!: peso;
  getPeso!: Sequelize.BelongsToGetAssociationMixin<peso>;
  setPeso!: Sequelize.BelongsToSetAssociationMixin<peso, pesoId>;
  createPeso!: Sequelize.BelongsToCreateAssociationMixin<peso>;
  // ingredientesporplato belongsTo platos via plato_id
  plato!: platos;
  getPlato!: Sequelize.BelongsToGetAssociationMixin<platos>;
  setPlato!: Sequelize.BelongsToSetAssociationMixin<platos, platosId>;
  createPlato!: Sequelize.BelongsToCreateAssociationMixin<platos>;
  // ingredientesporplato belongsTo productosbodega via producto_bodega_id
  producto_bodega!: productosbodega;
  getProducto_bodega!: Sequelize.BelongsToGetAssociationMixin<productosbodega>;
  setProducto_bodega!: Sequelize.BelongsToSetAssociationMixin<productosbodega, productosbodegaId>;
  createProducto_bodega!: Sequelize.BelongsToCreateAssociationMixin<productosbodega>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ingredientesporplato {
    return ingredientesporplato.init({
    ingrediente_plato_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    plato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'platos',
        key: 'plato_id'
      }
    },
    producto_bodega_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productosbodega',
        key: 'producto_bodega_id'
      }
    },
    peso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'peso',
        key: 'peso_id'
      }
    },
    cantidad_necesaria: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    }
  }, {
    sequelize,
    tableName: 'ingredientesporplato',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ingrediente_plato_id" },
        ]
      },
      {
        name: "fk_plato_ingrediente",
        using: "BTREE",
        fields: [
          { name: "plato_id" },
        ]
      },
      {
        name: "fk_producto_bodega",
        using: "BTREE",
        fields: [
          { name: "producto_bodega_id" },
        ]
      },
      {
        name: "fk_peso_ingrediente_plato",
        using: "BTREE",
        fields: [
          { name: "peso_id" },
        ]
      },
    ]
  });
  }
}
