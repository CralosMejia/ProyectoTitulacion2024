import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { hechosventaplatos, hechosventaplatosId } from './hechosventaplatos';

export interface dimplatoAttributes {
  plato_id: number;
  nombre_plato?: string;
  descripcion?: string;
  precio?: number;
}

export type dimplatoPk = "plato_id";
export type dimplatoId = dimplato[dimplatoPk];
export type dimplatoOptionalAttributes = "nombre_plato" | "descripcion" | "precio";
export type dimplatoCreationAttributes = Optional<dimplatoAttributes, dimplatoOptionalAttributes>;

export class dimplato extends Model<dimplatoAttributes, dimplatoCreationAttributes> implements dimplatoAttributes {
  plato_id!: number;
  nombre_plato?: string;
  descripcion?: string;
  precio?: number;

  // dimplato hasMany hechosventaplatos via plato_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof dimplato {
    return dimplato.init({
    plato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_plato: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    }
  }, {
    sequelize,
    tableName: 'dimplato',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plato_id" },
        ]
      },
    ]
  });
  }
}
