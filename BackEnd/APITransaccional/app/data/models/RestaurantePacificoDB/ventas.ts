import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { platos, platosId } from './platos';

export interface ventasAttributes {
  venta_id: number;
  plato_id?: number;
  cantidad?: number;
  precio_unitario?: number;
  precio_total?: number;
  fecha_inicio_semana: string;
  fecha_fin_semana: string;
}

export type ventasPk = "venta_id";
export type ventasId = ventas[ventasPk];
export type ventasOptionalAttributes = "venta_id" | "plato_id" | "cantidad" | "precio_unitario" | "precio_total";
export type ventasCreationAttributes = Optional<ventasAttributes, ventasOptionalAttributes>;

export class ventas extends Model<ventasAttributes, ventasCreationAttributes> implements ventasAttributes {
  venta_id!: number;
  plato_id?: number;
  cantidad?: number;
  precio_unitario?: number;
  precio_total?: number;
  fecha_inicio_semana!: string;
  fecha_fin_semana!: string;

  // ventas belongsTo platos via plato_id
  plato!: platos;
  getPlato!: Sequelize.BelongsToGetAssociationMixin<platos>;
  setPlato!: Sequelize.BelongsToSetAssociationMixin<platos, platosId>;
  createPlato!: Sequelize.BelongsToCreateAssociationMixin<platos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ventas {
    return ventas.init({
    venta_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    precio_total: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    fecha_inicio_semana: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_fin_semana: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ventas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "venta_id" },
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
