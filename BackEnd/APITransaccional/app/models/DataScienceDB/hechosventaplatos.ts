import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { dimfecha, dimfechaId } from './dimfecha';
import type { dimplato, dimplatoId } from './dimplato';

export interface hechosventaplatosAttributes {
  venta_plato_id: number;
  factura_id: number;
  fecha_id?: number;
  plato_id?: number;
  unidades_vendidas?: number;
  precio_total?: number;
}

export type hechosventaplatosPk = "venta_plato_id";
export type hechosventaplatosId = hechosventaplatos[hechosventaplatosPk];
export type hechosventaplatosOptionalAttributes = "venta_plato_id" | "fecha_id" | "plato_id" | "unidades_vendidas" | "precio_total";
export type hechosventaplatosCreationAttributes = Optional<hechosventaplatosAttributes, hechosventaplatosOptionalAttributes>;

export class hechosventaplatos extends Model<hechosventaplatosAttributes, hechosventaplatosCreationAttributes> implements hechosventaplatosAttributes {
  venta_plato_id!: number;
  factura_id!: number;
  fecha_id?: number;
  plato_id?: number;
  unidades_vendidas?: number;
  precio_total?: number;

  // hechosventaplatos belongsTo dimfecha via fecha_id
  fecha!: dimfecha;
  getFecha!: Sequelize.BelongsToGetAssociationMixin<dimfecha>;
  setFecha!: Sequelize.BelongsToSetAssociationMixin<dimfecha, dimfechaId>;
  createFecha!: Sequelize.BelongsToCreateAssociationMixin<dimfecha>;
  // hechosventaplatos belongsTo dimplato via plato_id
  plato!: dimplato;
  getPlato!: Sequelize.BelongsToGetAssociationMixin<dimplato>;
  setPlato!: Sequelize.BelongsToSetAssociationMixin<dimplato, dimplatoId>;
  createPlato!: Sequelize.BelongsToCreateAssociationMixin<dimplato>;

  static initModel(sequelize: Sequelize.Sequelize): typeof hechosventaplatos {
    return hechosventaplatos.init({
    venta_plato_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    factura_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimfecha',
        key: 'fecha_id'
      }
    },
    plato_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimplato',
        key: 'plato_id'
      }
    },
    unidades_vendidas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    precio_total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hechosventaplatos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "venta_plato_id" },
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
        name: "plato_id",
        using: "BTREE",
        fields: [
          { name: "plato_id" },
        ]
      },
    ]
  });
  }
}
