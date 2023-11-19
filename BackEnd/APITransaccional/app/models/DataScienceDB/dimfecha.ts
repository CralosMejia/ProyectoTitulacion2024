import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { hechosdemandaproducto, hechosdemandaproductoId } from './hechosdemandaproducto';
import type { hechosestadopedido, hechosestadopedidoId } from './hechosestadopedido';
import type { hechosventaplatos, hechosventaplatosId } from './hechosventaplatos';

export interface dimfechaAttributes {
  fecha_id: number;
  fecha: string;
  dia?: number;
  semana?: number;
  mes?: number;
  anio?: number;
  dia_semana: string;
}

export type dimfechaPk = "fecha_id";
export type dimfechaId = dimfecha[dimfechaPk];
export type dimfechaOptionalAttributes = "dia" | "semana" | "mes" | "anio";
export type dimfechaCreationAttributes = Optional<dimfechaAttributes, dimfechaOptionalAttributes>;

export class dimfecha extends Model<dimfechaAttributes, dimfechaCreationAttributes> implements dimfechaAttributes {
  fecha_id!: number;
  fecha!: string;
  dia?: number;
  semana?: number;
  mes?: number;
  anio?: number;
  dia_semana!: string;

  // dimfecha hasMany hechosdemandaproducto via fecha_id
  hechosdemandaproductos!: hechosdemandaproducto[];
  getHechosdemandaproductos!: Sequelize.HasManyGetAssociationsMixin<hechosdemandaproducto>;
  setHechosdemandaproductos!: Sequelize.HasManySetAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  addHechosdemandaproducto!: Sequelize.HasManyAddAssociationMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  addHechosdemandaproductos!: Sequelize.HasManyAddAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  createHechosdemandaproducto!: Sequelize.HasManyCreateAssociationMixin<hechosdemandaproducto>;
  removeHechosdemandaproducto!: Sequelize.HasManyRemoveAssociationMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  removeHechosdemandaproductos!: Sequelize.HasManyRemoveAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  hasHechosdemandaproducto!: Sequelize.HasManyHasAssociationMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  hasHechosdemandaproductos!: Sequelize.HasManyHasAssociationsMixin<hechosdemandaproducto, hechosdemandaproductoId>;
  countHechosdemandaproductos!: Sequelize.HasManyCountAssociationsMixin;
  // dimfecha hasMany hechosestadopedido via fecha_id
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
  // dimfecha hasMany hechosventaplatos via fecha_id
  hechosventaplatos!: hechosventaplatos[];
  getHechosventaplatos!: Sequelize.HasManyGetAssociationsMixin<hechosventaplatos>;
  setHechosventaplatos!: Sequelize.HasManySetAssociationsMixin<hechosventaplatos, hechosventaplatosId>;
  addHechosventaplato!: Sequelize.HasManyAddAssociationMixin<hechosventaplatos, hechosventaplatosId>;
  addHechosventaplatos!: Sequelize.HasManyAddAssociationsMixin<hechosventaplatos, hechosventaplatosId>;
  createHechosventaplato!: Sequelize.HasManyCreateAssociationMixin<hechosventaplatos>;
  removeHechosventaplato!: Sequelize.HasManyRemoveAssociationMixin<hechosventaplatos, hechosventaplatosId>;
  removeHechosventaplatos!: Sequelize.HasManyRemoveAssociationsMixin<hechosventaplatos, hechosventaplatosId>;
  hasHechosventaplato!: Sequelize.HasManyHasAssociationMixin<hechosventaplatos, hechosventaplatosId>;
  hasHechosventaplatos!: Sequelize.HasManyHasAssociationsMixin<hechosventaplatos, hechosventaplatosId>;
  countHechosventaplatos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof dimfecha {
    return dimfecha.init({
    fecha_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    semana: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dia_semana: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dimfecha',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fecha_id" },
        ]
      },
    ]
  });
  }
}
