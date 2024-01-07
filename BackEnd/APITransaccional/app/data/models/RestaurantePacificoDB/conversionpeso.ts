import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { peso, pesoId } from './peso';

export interface conversionpesoAttributes {
  conversion_id: number;
  peso_id_origen: number;
  peso_id_destino: number;
  factor_conversion?: number;
}

export type conversionpesoPk = "conversion_id";
export type conversionpesoId = conversionpeso[conversionpesoPk];
export type conversionpesoOptionalAttributes = "conversion_id" | "factor_conversion";
export type conversionpesoCreationAttributes = Optional<conversionpesoAttributes, conversionpesoOptionalAttributes>;

export class conversionpeso extends Model<conversionpesoAttributes, conversionpesoCreationAttributes> implements conversionpesoAttributes {
  conversion_id!: number;
  peso_id_origen!: number;
  peso_id_destino!: number;
  factor_conversion?: number;

  // conversionpeso belongsTo peso via peso_id_origen
  peso_id_origen_peso!: peso;
  getPeso_id_origen_peso!: Sequelize.BelongsToGetAssociationMixin<peso>;
  setPeso_id_origen_peso!: Sequelize.BelongsToSetAssociationMixin<peso, pesoId>;
  createPeso_id_origen_peso!: Sequelize.BelongsToCreateAssociationMixin<peso>;
  // conversionpeso belongsTo peso via peso_id_destino
  peso_id_destino_peso!: peso;
  getPeso_id_destino_peso!: Sequelize.BelongsToGetAssociationMixin<peso>;
  setPeso_id_destino_peso!: Sequelize.BelongsToSetAssociationMixin<peso, pesoId>;
  createPeso_id_destino_peso!: Sequelize.BelongsToCreateAssociationMixin<peso>;

  static initModel(sequelize: Sequelize.Sequelize): typeof conversionpeso {
    return conversionpeso.init({
    conversion_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    peso_id_origen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'peso',
        key: 'peso_id'
      }
    },
    peso_id_destino: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'peso',
        key: 'peso_id'
      }
    },
    factor_conversion: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    }
  }, {
    sequelize,
    tableName: 'conversionpeso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "conversion_id" },
        ]
      },
      {
        name: "peso_id_origen",
        using: "BTREE",
        fields: [
          { name: "peso_id_origen" },
        ]
      },
      {
        name: "peso_id_destino",
        using: "BTREE",
        fields: [
          { name: "peso_id_destino" },
        ]
      },
    ]
  });
  }
}
