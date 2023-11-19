import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { hechosestadopedido, hechosestadopedidoId } from './hechosestadopedido';

export interface dimpedidoAttributes {
  pedido_id: number;
  cliente_id?: number;
  monto_total?: number;
  fecha_creacion?: Date;
}

export type dimpedidoPk = "pedido_id";
export type dimpedidoId = dimpedido[dimpedidoPk];
export type dimpedidoOptionalAttributes = "pedido_id" | "cliente_id" | "monto_total" | "fecha_creacion";
export type dimpedidoCreationAttributes = Optional<dimpedidoAttributes, dimpedidoOptionalAttributes>;

export class dimpedido extends Model<dimpedidoAttributes, dimpedidoCreationAttributes> implements dimpedidoAttributes {
  pedido_id!: number;
  cliente_id?: number;
  monto_total?: number;
  fecha_creacion?: Date;

  // dimpedido hasMany hechosestadopedido via pedido_id
  hechosestadopedidos!: hechosestadopedido[];
  getHechosestadopedidos!: Sequelize.HasManyGetAssociationsMixin<hechosestadopedido>;
  setHechosestadopedidos!: Sequelize.HasManySetAssociationsMixin<hechosestadopedido, hechosestadopedidoId>;
  addHechosestadopedido!: Sequelize.HasManyAddAssociationMixin<hechosestadopedido, hechosestadopedidoId>;
  addHechosestadopedidos!: Sequelize.HasManyAddAssociationsMixin<hechosestadopedido, hechosestadopedidoId>;
  createHechosestadopedido!: Sequelize.HasManyCreateAssociationMixin<hechosestadopedido>;
  removeHechosestadopedido!: Sequelize.HasManyRemoveAssociationMixin<hechosestadopedido, hechosestadopedidoId>;
  removeHechosestadopedidos!: Sequelize.HasManyRemoveAssociationsMixin<hechosestadopedido, hechosestadopedidoId>;
  hasHechosestadopedido!: Sequelize.HasManyHasAssociationMixin<hechosestadopedido, hechosestadopedidoId>;
  hasHechosestadopedidos!: Sequelize.HasManyHasAssociationsMixin<hechosestadopedido, hechosestadopedidoId>;
  countHechosestadopedidos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof dimpedido {
    return dimpedido.init({
    pedido_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    monto_total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dimpedido',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pedido_id" },
        ]
      },
    ]
  });
  }
}
