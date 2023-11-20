import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { detallefactura, detallefacturaId } from './detallefactura';

export interface facturasAttributes {
  factura_id: number;
  fecha: string;
  monto_total: number;
  forma_pago: string;
  subtotal: number;
  iva?: number;
}

export type facturasPk = "factura_id";
export type facturasId = facturas[facturasPk];
export type facturasOptionalAttributes = "factura_id" | "iva";
export type facturasCreationAttributes = Optional<facturasAttributes, facturasOptionalAttributes>;

export class facturas extends Model<facturasAttributes, facturasCreationAttributes> implements facturasAttributes {
  factura_id!: number;
  fecha!: string;
  monto_total!: number;
  forma_pago!: string;
  subtotal!: number;
  iva?: number;

  // facturas hasMany detallefactura via factura_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof facturas {
    return facturas.init({
    factura_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    monto_total: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    forma_pago: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    iva: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'facturas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "factura_id" },
        ]
      },
    ]
  });
  }
}
