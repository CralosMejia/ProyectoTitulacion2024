import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface lotes_desperdiciadosAttributes {
  lote_desperdiciado_id: number;
  producto_bodega_id: number;
  fecha_ingreso: string;
  fecha_vencimiento: string;
  cantidad?: number;
}

export type lotes_desperdiciadosPk = "lote_desperdiciado_id";
export type lotes_desperdiciadosId = lotes_desperdiciados[lotes_desperdiciadosPk];
export type lotes_desperdiciadosOptionalAttributes = "lote_desperdiciado_id" | "cantidad";
export type lotes_desperdiciadosCreationAttributes = Optional<lotes_desperdiciadosAttributes, lotes_desperdiciadosOptionalAttributes>;

export class lotes_desperdiciados extends Model<lotes_desperdiciadosAttributes, lotes_desperdiciadosCreationAttributes> implements lotes_desperdiciadosAttributes {
  lote_desperdiciado_id!: number;
  producto_bodega_id!: number;
  fecha_ingreso!: string;
  fecha_vencimiento!: string;
  cantidad?: number;

  // lotes_desperdiciados belongsTo productosbodega via producto_bodega_id
  producto_bodega!: productosbodega;
  getProducto_bodega!: Sequelize.BelongsToGetAssociationMixin<productosbodega>;
  setProducto_bodega!: Sequelize.BelongsToSetAssociationMixin<productosbodega, productosbodegaId>;
  createProducto_bodega!: Sequelize.BelongsToCreateAssociationMixin<productosbodega>;

  static initModel(sequelize: Sequelize.Sequelize): typeof lotes_desperdiciados {
    return lotes_desperdiciados.init({
    lote_desperdiciado_id: {
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
    tableName: 'lotes_desperdiciados',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lote_desperdiciado_id" },
        ]
      },
      {
        name: "fk_producto_bodega_lote_desperdiciado",
        using: "BTREE",
        fields: [
          { name: "producto_bodega_id" },
        ]
      },
    ]
  });
  }
}
