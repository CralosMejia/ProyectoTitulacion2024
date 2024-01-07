import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface lotesAttributes {
  lote_id: number;
  producto_bodega_id: number;
  fecha_ingreso: string;
  fecha_vencimiento: string;
  cantidad?: number;
}

export type lotesPk = "lote_id";
export type lotesId = lotes[lotesPk];
export type lotesOptionalAttributes = "lote_id" | "cantidad";
export type lotesCreationAttributes = Optional<lotesAttributes, lotesOptionalAttributes>;

export class lotes extends Model<lotesAttributes, lotesCreationAttributes> implements lotesAttributes {
  lote_id!: number;
  producto_bodega_id!: number;
  fecha_ingreso!: string;
  fecha_vencimiento!: string;
  cantidad?: number;

  // lotes belongsTo productosbodega via producto_bodega_id
  producto_bodega!: productosbodega;
  getProducto_bodega!: Sequelize.BelongsToGetAssociationMixin<productosbodega>;
  setProducto_bodega!: Sequelize.BelongsToSetAssociationMixin<productosbodega, productosbodegaId>;
  createProducto_bodega!: Sequelize.BelongsToCreateAssociationMixin<productosbodega>;

  static initModel(sequelize: Sequelize.Sequelize): typeof lotes {
    return lotes.init({
    lote_id: {
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
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    }
  }, {
    sequelize,
    tableName: 'lotes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lote_id" },
        ]
      },
      {
        name: "fk_producto_bodega_lote",
        using: "BTREE",
        fields: [
          { name: "producto_bodega_id" },
        ]
      },
    ]
  });
  }
}
