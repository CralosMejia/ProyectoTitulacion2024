import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { hechosestadopedido, hechosestadopedidoId } from './hechosestadopedido';

export interface dimestadoAttributes {
  estado_id: number;
  descripcion_estado?: string;
}

export type dimestadoPk = "estado_id";
export type dimestadoId = dimestado[dimestadoPk];
export type dimestadoOptionalAttributes = "estado_id" | "descripcion_estado";
export type dimestadoCreationAttributes = Optional<dimestadoAttributes, dimestadoOptionalAttributes>;

export class dimestado extends Model<dimestadoAttributes, dimestadoCreationAttributes> implements dimestadoAttributes {
  estado_id!: number;
  descripcion_estado?: string;

  // dimestado hasMany hechosestadopedido via estado_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof dimestado {
    return dimestado.init({
    estado_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descripcion_estado: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dimestado',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "estado_id" },
        ]
      },
    ]
  });
  }
}
