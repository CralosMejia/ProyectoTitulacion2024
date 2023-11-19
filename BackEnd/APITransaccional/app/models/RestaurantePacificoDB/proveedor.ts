import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ordenesproveedor, ordenesproveedorId } from './ordenesproveedor';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface proveedorAttributes {
  proveedor_id: number;
  nombre_proveedor: string;
  email: string;
  telefono: string;
  nivel?: '1' | '2' | '3';
  estado?: 'activo' | 'inactivo';
}

export type proveedorPk = "proveedor_id";
export type proveedorId = proveedor[proveedorPk];
export type proveedorOptionalAttributes = "proveedor_id" | "nivel" | "estado";
export type proveedorCreationAttributes = Optional<proveedorAttributes, proveedorOptionalAttributes>;

export class proveedor extends Model<proveedorAttributes, proveedorCreationAttributes> implements proveedorAttributes {
  proveedor_id!: number;
  nombre_proveedor!: string;
  email!: string;
  telefono!: string;
  nivel?: '1' | '2' | '3';
  estado?: 'activo' | 'inactivo';

  // proveedor hasMany ordenesproveedor via proveedor_id
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
  // proveedor hasMany productosbodega via proveedor_id
  productosbodegas!: productosbodega[];
  getProductosbodegas!: Sequelize.HasManyGetAssociationsMixin<productosbodega>;
  setProductosbodegas!: Sequelize.HasManySetAssociationsMixin<productosbodega, productosbodegaId>;
  addProductosbodega!: Sequelize.HasManyAddAssociationMixin<productosbodega, productosbodegaId>;
  addProductosbodegas!: Sequelize.HasManyAddAssociationsMixin<productosbodega, productosbodegaId>;
  createProductosbodega!: Sequelize.HasManyCreateAssociationMixin<productosbodega>;
  removeProductosbodega!: Sequelize.HasManyRemoveAssociationMixin<productosbodega, productosbodegaId>;
  removeProductosbodegas!: Sequelize.HasManyRemoveAssociationsMixin<productosbodega, productosbodegaId>;
  hasProductosbodega!: Sequelize.HasManyHasAssociationMixin<productosbodega, productosbodegaId>;
  hasProductosbodegas!: Sequelize.HasManyHasAssociationsMixin<productosbodega, productosbodegaId>;
  countProductosbodegas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof proveedor {
    return proveedor.init({
    proveedor_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_proveedor: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.CHAR(23),
      allowNull: false
    },
    nivel: {
      type: DataTypes.ENUM('1','2','3'),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('activo','inactivo'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'proveedor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "proveedor_id" },
        ]
      },
    ]
  });
  }
}
