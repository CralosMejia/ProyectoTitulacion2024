import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { dimestado, dimestadoId } from './dimestado';
import type { dimfecha, dimfechaId } from './dimfecha';
import type { dimpedido, dimpedidoId } from './dimpedido';

export interface hechosestadopedidoAttributes {
  estado_pedido_id: number;
  fecha_id?: number;
  pedido_id?: number;
  estado_id?: number;
}

export type hechosestadopedidoPk = "estado_pedido_id";
export type hechosestadopedidoId = hechosestadopedido[hechosestadopedidoPk];
export type hechosestadopedidoOptionalAttributes = "estado_pedido_id" | "fecha_id" | "pedido_id" | "estado_id";
export type hechosestadopedidoCreationAttributes = Optional<hechosestadopedidoAttributes, hechosestadopedidoOptionalAttributes>;

export class hechosestadopedido extends Model<hechosestadopedidoAttributes, hechosestadopedidoCreationAttributes> implements hechosestadopedidoAttributes {
  estado_pedido_id!: number;
  fecha_id?: number;
  pedido_id?: number;
  estado_id?: number;

  // hechosestadopedido belongsTo dimestado via estado_id
  estado!: dimestado;
  getEstado!: Sequelize.BelongsToGetAssociationMixin<dimestado>;
  setEstado!: Sequelize.BelongsToSetAssociationMixin<dimestado, dimestadoId>;
  createEstado!: Sequelize.BelongsToCreateAssociationMixin<dimestado>;
  // hechosestadopedido belongsTo dimfecha via fecha_id
  fecha!: dimfecha;
  getFecha!: Sequelize.BelongsToGetAssociationMixin<dimfecha>;
  setFecha!: Sequelize.BelongsToSetAssociationMixin<dimfecha, dimfechaId>;
  createFecha!: Sequelize.BelongsToCreateAssociationMixin<dimfecha>;
  // hechosestadopedido belongsTo dimpedido via pedido_id
  pedido!: dimpedido;
  getPedido!: Sequelize.BelongsToGetAssociationMixin<dimpedido>;
  setPedido!: Sequelize.BelongsToSetAssociationMixin<dimpedido, dimpedidoId>;
  createPedido!: Sequelize.BelongsToCreateAssociationMixin<dimpedido>;

  static initModel(sequelize: Sequelize.Sequelize): typeof hechosestadopedido {
    return hechosestadopedido.init({
    estado_pedido_id: {
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
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimpedido',
        key: 'pedido_id'
      }
    },
    estado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dimestado',
        key: 'estado_id'
      }
    }
  }, {
    sequelize,
    tableName: 'hechosestadopedido',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "estado_pedido_id" },
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
        name: "pedido_id",
        using: "BTREE",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "estado_id",
        using: "BTREE",
        fields: [
          { name: "estado_id" },
        ]
      },
    ]
  });
  }
}
