import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { detalleordenes, detalleordenesId } from './detalleordenes';

export interface ordenesAttributes {
  orden_id: number;
  fecha_orden: string;
  estado?: 'En espera' | 'Enviado' | 'Cancelado' | 'Aprobado' | 'Recibido';
  estado_edicion?: number;
  total?: number;
  modo_creacion?: 'Manual' | 'Automatico';
}

export type ordenesPk = "orden_id";
export type ordenesId = ordenes[ordenesPk];
export type ordenesOptionalAttributes = "orden_id" | "estado" | "estado_edicion" | "total" | "modo_creacion";
export type ordenesCreationAttributes = Optional<ordenesAttributes, ordenesOptionalAttributes>;

export class ordenes extends Model<ordenesAttributes, ordenesCreationAttributes> implements ordenesAttributes {
  orden_id!: number;
  fecha_orden!: string;
  estado?: 'En espera' | 'Enviado' | 'Cancelado' | 'Aprobado' | 'Recibido';
  estado_edicion?: number;
  total?: number;
  modo_creacion?: 'Manual' | 'Automatico';

  // ordenes hasMany detalleordenes via orden_id
  detalleordenes!: detalleordenes[];
  getDetalleordenes!: Sequelize.HasManyGetAssociationsMixin<detalleordenes>;
  setDetalleordenes!: Sequelize.HasManySetAssociationsMixin<detalleordenes, detalleordenesId>;
  addDetalleordene!: Sequelize.HasManyAddAssociationMixin<detalleordenes, detalleordenesId>;
  addDetalleordenes!: Sequelize.HasManyAddAssociationsMixin<detalleordenes, detalleordenesId>;
  createDetalleordene!: Sequelize.HasManyCreateAssociationMixin<detalleordenes>;
  removeDetalleordene!: Sequelize.HasManyRemoveAssociationMixin<detalleordenes, detalleordenesId>;
  removeDetalleordenes!: Sequelize.HasManyRemoveAssociationsMixin<detalleordenes, detalleordenesId>;
  hasDetalleordene!: Sequelize.HasManyHasAssociationMixin<detalleordenes, detalleordenesId>;
  hasDetalleordenes!: Sequelize.HasManyHasAssociationsMixin<detalleordenes, detalleordenesId>;
  countDetalleordenes!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof ordenes {
    return ordenes.init({
    orden_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_orden: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('En espera','Enviado','Cancelado','Aprobado','Recibido'),
      allowNull: true,
      defaultValue: "En espera"
    },
    estado_edicion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
      defaultValue: 0.000000
    },
    modo_creacion: {
      type: DataTypes.ENUM('Manual','Automatico'),
      allowNull: true,
      defaultValue: "Manual"
    }
  }, {
    sequelize,
    tableName: 'ordenes',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orden_id" },
        ]
      },
    ]
  });
  }
}
