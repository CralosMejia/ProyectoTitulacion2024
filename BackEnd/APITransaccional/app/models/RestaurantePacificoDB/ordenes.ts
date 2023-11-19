import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { detalleordenes, detalleordenesId } from './detalleordenes';
import type { ordenesproveedor, ordenesproveedorId } from './ordenesproveedor';

export interface ordenesAttributes {
  orden_id: number;
  fecha_orden: string;
  estado: string;
  subtotal: number;
  total: number;
}

export type ordenesPk = "orden_id";
export type ordenesId = ordenes[ordenesPk];
export type ordenesOptionalAttributes = "orden_id";
export type ordenesCreationAttributes = Optional<ordenesAttributes, ordenesOptionalAttributes>;

export class ordenes extends Model<ordenesAttributes, ordenesCreationAttributes> implements ordenesAttributes {
  orden_id!: number;
  fecha_orden!: string;
  estado!: string;
  subtotal!: number;
  total!: number;

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
  // ordenes hasMany ordenesproveedor via orden_id
  ordenesproveedors!: ordenesproveedor[];
  getOrdenesproveedors!: Sequelize.HasManyGetAssociationsMixin<ordenesproveedor>;
  setOrdenesproveedors!: Sequelize.HasManySetAssociationsMixin<ordenesproveedor, ordenesproveedorId>;
  addOrdenesproveedor!: Sequelize.HasManyAddAssociationMixin<ordenesproveedor, ordenesproveedorId>;
  addOrdenesproveedors!: Sequelize.HasManyAddAssociationsMixin<ordenesproveedor, ordenesproveedorId>;
  createOrdenesproveedor!: Sequelize.HasManyCreateAssociationMixin<ordenesproveedor>;
  removeOrdenesproveedor!: Sequelize.HasManyRemoveAssociationMixin<ordenesproveedor, ordenesproveedorId>;
  removeOrdenesproveedors!: Sequelize.HasManyRemoveAssociationsMixin<ordenesproveedor, ordenesproveedorId>;
  hasOrdenesproveedor!: Sequelize.HasManyHasAssociationMixin<ordenesproveedor, ordenesproveedorId>;
  hasOrdenesproveedors!: Sequelize.HasManyHasAssociationsMixin<ordenesproveedor, ordenesproveedorId>;
  countOrdenesproveedors!: Sequelize.HasManyCountAssociationsMixin;

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
      type: DataTypes.CHAR(20),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ordenes',
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
