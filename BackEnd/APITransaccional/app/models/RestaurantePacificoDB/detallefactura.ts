import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { facturas, facturasId } from './facturas';
import type { platos, platosId } from './platos';

export interface detallefacturaAttributes {
  detalle_factura_id: number;
  factura_id: number;
  plato_id?: number;
  cantidad: string;
  precio_unitario: number;
}

export type detallefacturaPk = "detalle_factura_id";
export type detallefacturaId = detallefactura[detallefacturaPk];
export type detallefacturaOptionalAttributes = "detalle_factura_id" | "plato_id";
export type detallefacturaCreationAttributes = Optional<detallefacturaAttributes, detallefacturaOptionalAttributes>;

export class detallefactura extends Model<detallefacturaAttributes, detallefacturaCreationAttributes> implements detallefacturaAttributes {
  detalle_factura_id!: number;
  factura_id!: number;
  plato_id?: number;
  cantidad!: string;
  precio_unitario!: number;

  // detallefactura belongsTo facturas via factura_id
  factura!: facturas;
  getFactura!: Sequelize.BelongsToGetAssociationMixin<facturas>;
  setFactura!: Sequelize.BelongsToSetAssociationMixin<facturas, facturasId>;
  createFactura!: Sequelize.BelongsToCreateAssociationMixin<facturas>;
  // detallefactura belongsTo platos via plato_id
  plato!: platos;
  getPlato!: Sequelize.BelongsToGetAssociationMixin<platos>;
  setPlato!: Sequelize.BelongsToSetAssociationMixin<platos, platosId>;
  createPlato!: Sequelize.BelongsToCreateAssociationMixin<platos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof detallefactura {
    return detallefactura.init({
    detalle_factura_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    factura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facturas',
        key: 'factura_id'
      }
    },
    plato_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'platos',
        key: 'plato_id'
      }
    },
    cantidad: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'detallefactura',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "detalle_factura_id" },
        ]
      },
      {
        name: "fk_factura",
        using: "BTREE",
        fields: [
          { name: "factura_id" },
        ]
      },
      {
        name: "fk_plato",
        using: "BTREE",
        fields: [
          { name: "plato_id" },
        ]
      },
    ]
  });
  }
}
