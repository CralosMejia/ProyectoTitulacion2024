import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ordenes, ordenesId } from './ordenes';
import type { proveedor, proveedorId } from './proveedor';

export interface ordenesproveedorAttributes {
  orden_proveedor_id: number;
  orden_id: number;
  proveedor_id: number;
}

export type ordenesproveedorPk = "orden_proveedor_id";
export type ordenesproveedorId = ordenesproveedor[ordenesproveedorPk];
export type ordenesproveedorOptionalAttributes = "orden_proveedor_id";
export type ordenesproveedorCreationAttributes = Optional<ordenesproveedorAttributes, ordenesproveedorOptionalAttributes>;

export class ordenesproveedor extends Model<ordenesproveedorAttributes, ordenesproveedorCreationAttributes> implements ordenesproveedorAttributes {
  orden_proveedor_id!: number;
  orden_id!: number;
  proveedor_id!: number;

  // ordenesproveedor belongsTo ordenes via orden_id
  orden!: ordenes;
  getOrden!: Sequelize.BelongsToGetAssociationMixin<ordenes>;
  setOrden!: Sequelize.BelongsToSetAssociationMixin<ordenes, ordenesId>;
  createOrden!: Sequelize.BelongsToCreateAssociationMixin<ordenes>;
  // ordenesproveedor belongsTo proveedor via proveedor_id
  proveedor!: proveedor;
  getProveedor!: Sequelize.BelongsToGetAssociationMixin<proveedor>;
  setProveedor!: Sequelize.BelongsToSetAssociationMixin<proveedor, proveedorId>;
  createProveedor!: Sequelize.BelongsToCreateAssociationMixin<proveedor>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ordenesproveedor {
    return ordenesproveedor.init({
    orden_proveedor_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ordenes',
        key: 'orden_id'
      }
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proveedor',
        key: 'proveedor_id'
      }
    }
  }, {
    sequelize,
    tableName: 'ordenesproveedor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orden_proveedor_id" },
        ]
      },
      {
        name: "fk_proveedor_id_ordenes_proveedor",
        using: "BTREE",
        fields: [
          { name: "proveedor_id" },
        ]
      },
      {
        name: "fk_orden_id_orden_proveedor",
        using: "BTREE",
        fields: [
          { name: "orden_id" },
        ]
      },
    ]
  });
  }
}
