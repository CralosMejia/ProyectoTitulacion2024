import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ordenes, ordenesId } from './ordenes';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface detalleordenesAttributes {
  detalle_orden_id: number;
  producto_bodega_id: number;
  orden_id: number;
  cantidad_necesaria?: number;
}

export type detalleordenesPk = "detalle_orden_id";
export type detalleordenesId = detalleordenes[detalleordenesPk];
export type detalleordenesOptionalAttributes = "detalle_orden_id" | "cantidad_necesaria";
export type detalleordenesCreationAttributes = Optional<detalleordenesAttributes, detalleordenesOptionalAttributes>;

export class detalleordenes extends Model<detalleordenesAttributes, detalleordenesCreationAttributes> implements detalleordenesAttributes {
  detalle_orden_id!: number;
  producto_bodega_id!: number;
  orden_id!: number;
  cantidad_necesaria?: number;

  // detalleordenes belongsTo ordenes via orden_id
  orden!: ordenes;
  getOrden!: Sequelize.BelongsToGetAssociationMixin<ordenes>;
  setOrden!: Sequelize.BelongsToSetAssociationMixin<ordenes, ordenesId>;
  createOrden!: Sequelize.BelongsToCreateAssociationMixin<ordenes>;
  // detalleordenes belongsTo productosbodega via producto_bodega_id
  producto_bodega!: productosbodega;
  getProducto_bodega!: Sequelize.BelongsToGetAssociationMixin<productosbodega>;
  setProducto_bodega!: Sequelize.BelongsToSetAssociationMixin<productosbodega, productosbodegaId>;
  createProducto_bodega!: Sequelize.BelongsToCreateAssociationMixin<productosbodega>;

  static initModel(sequelize: Sequelize.Sequelize): typeof detalleordenes {
    return detalleordenes.init({
    detalle_orden_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    producto_bodega_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productosbodega',
        key: 'producto_bodega_id'
      }
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ordenes',
        key: 'orden_id'
      }
    },
    cantidad_necesaria: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'detalleordenes',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "detalle_orden_id" },
        ]
      },
      {
        name: "fk_producto_bodega_detalle_orden",
        using: "BTREE",
        fields: [
          { name: "producto_bodega_id" },
        ]
      },
      {
        name: "fk_orden_id_detalle_orden",
        using: "BTREE",
        fields: [
          { name: "orden_id" },
        ]
      },
    ]
  });
  }
}
