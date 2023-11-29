import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { dimproducto, dimproductoId } from './dimproducto';

export interface dimunidadmedidaAttributes {
  unidad_medida_id: number;
  unidad?: string;
  simbolo?: string;
  tipo: string;
}

export type dimunidadmedidaPk = "unidad_medida_id";
export type dimunidadmedidaId = dimunidadmedida[dimunidadmedidaPk];
export type dimunidadmedidaOptionalAttributes = "unidad_medida_id" | "unidad" | "simbolo";
export type dimunidadmedidaCreationAttributes = Optional<dimunidadmedidaAttributes, dimunidadmedidaOptionalAttributes>;

export class dimunidadmedida extends Model<dimunidadmedidaAttributes, dimunidadmedidaCreationAttributes> implements dimunidadmedidaAttributes {
  unidad_medida_id!: number;
  unidad?: string;
  simbolo?: string;
  tipo!: string;

  // dimunidadmedida hasMany dimproducto via unidad_medida_id
  dimproductos!: dimproducto[];
  getDimproductos!: Sequelize.HasManyGetAssociationsMixin<dimproducto>;
  setDimproductos!: Sequelize.HasManySetAssociationsMixin<dimproducto, dimproductoId>;
  addDimproducto!: Sequelize.HasManyAddAssociationMixin<dimproducto, dimproductoId>;
  addDimproductos!: Sequelize.HasManyAddAssociationsMixin<dimproducto, dimproductoId>;
  createDimproducto!: Sequelize.HasManyCreateAssociationMixin<dimproducto>;
  removeDimproducto!: Sequelize.HasManyRemoveAssociationMixin<dimproducto, dimproductoId>;
  removeDimproductos!: Sequelize.HasManyRemoveAssociationsMixin<dimproducto, dimproductoId>;
  hasDimproducto!: Sequelize.HasManyHasAssociationMixin<dimproducto, dimproductoId>;
  hasDimproductos!: Sequelize.HasManyHasAssociationsMixin<dimproducto, dimproductoId>;
  countDimproductos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof dimunidadmedida {
    return dimunidadmedida.init({
    unidad_medida_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    unidad: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    simbolo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dimunidadmedida',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "unidad_medida_id" },
        ]
      },
    ]
  });
  }
}
