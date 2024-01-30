import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface analisispredicciondemandaAttributes {
  id: number;
  name: string;
  create_date: string;
  info: string;
}

export type analisispredicciondemandaPk = "id";
export type analisispredicciondemandaId = analisispredicciondemanda[analisispredicciondemandaPk];
export type analisispredicciondemandaOptionalAttributes = "id";
export type analisispredicciondemandaCreationAttributes = Optional<analisispredicciondemandaAttributes, analisispredicciondemandaOptionalAttributes>;

export class analisispredicciondemanda extends Model<analisispredicciondemandaAttributes, analisispredicciondemandaCreationAttributes> implements analisispredicciondemandaAttributes {
  id!: number;
  name!: string;
  create_date!: string;
  info!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof analisispredicciondemanda {
    return analisispredicciondemanda.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'analisispredicciondemanda',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
