import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { dimfecha, dimfechaId } from './dimfecha';
import type { dimproducto, dimproductoId } from './dimproducto';

export interface hechosdemandaproductoAttributes {
  demanda_id: number;
  fecha_id?: number;
  producto_id?: number;
  cantidad_predicha_modelo_1?: number;
  cantidad_predicha_modelo_2?: number;
  cantidad_real?: number;
}

export type hechosdemandaproductoPk = "demanda_id";
export type hechosdemandaproductoId = hechosdemandaproducto[hechosdemandaproductoPk];
export type hechosdemandaproductoOptionalAttributes = "demanda_id" | "fecha_id" | "producto_id" | "cantidad_predicha_modelo_1" | "cantidad_predicha_modelo_2" | "cantidad_real";
export type hechosdemandaproductoCreationAttributes = Optional<hechosdemandaproductoAttributes, hechosdemandaproductoOptionalAttributes>;

export class hechosdemandaproducto extends Model<hechosdemandaproductoAttributes, hechosdemandaproductoCreationAttributes> implements hechosdemandaproductoAttributes {
  demanda_id!: number;
  fecha_id?: number;
  producto_id?: number;
  cantidad_predicha_modelo_1?: number;
  cantidad_predicha_modelo_2?: number;
  cantidad_real?: number;

  // hechosdemandaproducto belongsTo dimfecha via fecha_id
  fecha!: dimfecha;
  getFecha!: Sequelize.BelongsToGetAssociationMixin<dimfecha>;
  setFecha!: Sequelize.BelongsToSetAssociationMixin<dimfecha, dimfechaId>;
  createFecha!: Sequelize.BelongsToCreateAssociationMixin<dimfecha>;
  // hechosdemandaproducto belongsTo dimproducto via producto_id
  producto!: dimproducto;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<dimproducto>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<dimproducto, dimproductoId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<dimproducto>;

  static initModel(sequelize: Sequelize.Sequelize): typeof hechosdemandaproducto {
    return hechosdemandaproducto.init({
    demanda_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimfecha',
        key: 'fecha_id'
      }
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimproducto',
        key: 'producto_id'
      }
    },
    cantidad_predicha_modelo_1: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    cantidad_predicha_modelo_2: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    cantidad_real: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    }
  }, {
    sequelize,
    tableName: 'hechosdemandaproducto',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "demanda_id" },
        ]
      },
      {
        name: "fecha_id",
        using: "BTREE",
        fields: [
          { name: "fecha_id" },
        ]
      },
      {
        name: "producto_id",
        using: "BTREE",
        fields: [
          { name: "producto_id" },
        ]
      },
    ]
  });
  }
}
