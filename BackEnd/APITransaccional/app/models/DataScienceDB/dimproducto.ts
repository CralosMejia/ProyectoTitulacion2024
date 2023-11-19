import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { dimunidadmedida, dimunidadmedidaId } from './dimunidadmedida';
import type { hechosdemandaproducto, hechosdemandaproductoId } from './hechosdemandaproducto';

export interface dimproductoAttributes {
  producto_id: number;
  nombre_producto?: string;
  tipo_producto?: string;
  precio_proveedor?: number;
  unidad_medida_id?: number;
}

export type dimproductoPk = "producto_id";
export type dimproductoId = dimproducto[dimproductoPk];
export type dimproductoOptionalAttributes = "nombre_producto" | "tipo_producto" | "precio_proveedor" | "unidad_medida_id";
export type dimproductoCreationAttributes = Optional<dimproductoAttributes, dimproductoOptionalAttributes>;

export class dimproducto extends Model<dimproductoAttributes, dimproductoCreationAttributes> implements dimproductoAttributes {
  producto_id!: number;
  nombre_producto?: string;
  tipo_producto?: string;
  precio_proveedor?: number;
  unidad_medida_id?: number;

  // dimproducto hasMany hechosdemandaproducto via producto_id
  hechosdemandaproductos!: hechosdemandaproducto[];
  getHechosdemandaproductos!: Sequelize.HasManyGetAssociationsMixin<hechosdemandaproducto>;
  setHechosdemandaproductos!: Sequelize.HasManySetAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  addHechosdemandaproducto!: Sequelize.HasManyAddAssociationMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  addHechosdemandaproductos!: Sequelize.HasManyAddAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  createHechosdemandaproducto!: Sequelize.HasManyCreateAssociationMixin<hechosdemandaproducto>;
  removeHechosdemandaproducto!: Sequelize.HasManyRemoveAssociationMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  removeHechosdemandaproductos!: Sequelize.HasManyRemoveAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  hasHechosdemandaproducto!: Sequelize.HasManyHasAssociationMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  hasHechosdemandaproductos!: Sequelize.HasManyHasAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  countHechosdemandaproductos!: Sequelize.HasManyCountAssociationsMixin;
  // dimproducto belongsTo dimunidadmedida via unidad_medida_id
  unidad_medida!: dimunidadmedida;
  getUnidad_medida!: Sequelize.BelongsToGetAssociationMixin<dimunidadmedida>;
  setUnidad_medida!: Sequelize.BelongsToSetAssociationMixin<dimunidadmedida, dimunidadmedidaId>;
  createUnidad_medida!: Sequelize.BelongsToCreateAssociationMixin<dimunidadmedida>;

  static initModel(sequelize: Sequelize.Sequelize): typeof dimproducto {
    return dimproducto.init({
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_producto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipo_producto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    precio_proveedor: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    unidad_medida_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimunidadmedida',
        key: 'unidad_medida_id'
      }
    }
  }, {
    sequelize,
    tableName: 'dimproducto',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "producto_id" },
        ]
      },
      {
        name: "unidad_medida_id",
        using: "BTREE",
        fields: [
          { name: "unidad_medida_id" },
        ]
      },
    ]
  });
  }
}
