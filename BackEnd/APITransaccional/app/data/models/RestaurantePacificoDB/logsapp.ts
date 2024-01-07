import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface logsappAttributes {
  logs_app_id: number;
  log_description: string;
  fecha_log: Date;
  sistema: string;
  modulo: string;
}

export type logsappPk = "logs_app_id";
export type logsappId = logsapp[logsappPk];
export type logsappOptionalAttributes = "logs_app_id";
export type logsappCreationAttributes = Optional<logsappAttributes, logsappOptionalAttributes>;

export class logsapp extends Model<logsappAttributes, logsappCreationAttributes> implements logsappAttributes {
  logs_app_id!: number;
  log_description!: string;
  fecha_log!: Date;
  sistema!: string;
  modulo!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof logsapp {
    return logsapp.init({
    logs_app_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    log_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha_log: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sistema: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    modulo: {
      type: DataTypes.STRING(250),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'logsapp',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "logs_app_id" },
        ]
      },
    ]
  });
  }
}
