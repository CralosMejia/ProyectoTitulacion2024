import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { detalleordenes, detalleordenesId } from './detalleordenes';
import type { ingredientesporplato, ingredientesporplatoId } from './ingredientesporplato';
import type { lotes, lotesId } from './lotes';
import type { lotes_desperdiciados, lotes_desperdiciadosId } from './lotes_desperdiciados';
import type { peso, pesoId } from './peso';
import type { proveedor, proveedorId } from './proveedor';

export interface productosbodegaAttributes {
  producto_bodega_id: number;
  proveedor_id: number;
  peso_proveedor_id: number;
  nombre_producto: string;
  cantidad_actual?: number;
  cantidad_maxima?: number;
  tipo?: 'liquidos' | 'solidos';
  precio_proveedor?: number;
  cantidad_minima?: number;
}

export type productosbodegaPk = "producto_bodega_id";
export type productosbodegaId = productosbodega[productosbodegaPk];
export type productosbodegaOptionalAttributes = "producto_bodega_id" | "cantidad_actual" | "cantidad_maxima" | "tipo" | "precio_proveedor" | "cantidad_minima";
export type productosbodegaCreationAttributes = Optional<productosbodegaAttributes, productosbodegaOptionalAttributes>;

export class productosbodega extends Model<productosbodegaAttributes, productosbodegaCreationAttributes> implements productosbodegaAttributes {
  producto_bodega_id!: number;
  proveedor_id!: number;
  peso_proveedor_id!: number;
  nombre_producto!: string;
  cantidad_actual?: number;
  cantidad_maxima?: number;
  tipo?: 'liquidos' | 'solidos';
  precio_proveedor?: number;
  cantidad_minima?: number;

  // productosbodega belongsTo peso via peso_proveedor_id
  peso_proveedor!: peso;
  getPeso_proveedor!: Sequelize.BelongsToGetAssociationMixin<peso>;
  setPeso_proveedor!: Sequelize.BelongsToSetAssociationMixin<peso, pesoId>;
  createPeso_proveedor!: Sequelize.BelongsToCreateAssociationMixin<peso>;
  // productosbodega hasMany detalleordenes via producto_bodega_id
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
  // productosbodega hasMany ingredientesporplato via producto_bodega_id
  ingredientesporplatos!: ingredientesporplato[];
  getIngredientesporplatos!: Sequelize.HasManyGetAssociationsMixin<ingredientesporplato>;
  setIngredientesporplatos!: Sequelize.HasManySetAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  addIngredientesporplato!: Sequelize.HasManyAddAssociationMixin<ingredientesporplato, ingredientesporplatoId>;
  addIngredientesporplatos!: Sequelize.HasManyAddAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  createIngredientesporplato!: Sequelize.HasManyCreateAssociationMixin<ingredientesporplato>;
  removeIngredientesporplato!: Sequelize.HasManyRemoveAssociationMixin<ingredientesporplato, ingredientesporplatoId>;
  removeIngredientesporplatos!: Sequelize.HasManyRemoveAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  hasIngredientesporplato!: Sequelize.HasManyHasAssociationMixin<ingredientesporplato, ingredientesporplatoId>;
  hasIngredientesporplatos!: Sequelize.HasManyHasAssociationsMixin<ingredientesporplato, ingredientesporplatoId>;
  countIngredientesporplatos!: Sequelize.HasManyCountAssociationsMixin;
  // productosbodega hasMany lotes via producto_bodega_id
  lotes!: lotes[];
  getLotes!: Sequelize.HasManyGetAssociationsMixin<lotes>;
  setLotes!: Sequelize.HasManySetAssociationsMixin<lotes, lotesId>;
  addLote!: Sequelize.HasManyAddAssociationMixin<lotes, lotesId>;
  addLotes!: Sequelize.HasManyAddAssociationsMixin<lotes, lotesId>;
  createLote!: Sequelize.HasManyCreateAssociationMixin<lotes>;
  removeLote!: Sequelize.HasManyRemoveAssociationMixin<lotes, lotesId>;
  removeLotes!: Sequelize.HasManyRemoveAssociationsMixin<lotes, lotesId>;
  hasLote!: Sequelize.HasManyHasAssociationMixin<lotes, lotesId>;
  hasLotes!: Sequelize.HasManyHasAssociationsMixin<lotes, lotesId>;
  countLotes!: Sequelize.HasManyCountAssociationsMixin;
  // productosbodega hasMany lotes_desperdiciados via producto_bodega_id
  lotes_desperdiciados!: lotes_desperdiciados[];
  getLotes_desperdiciados!: Sequelize.HasManyGetAssociationsMixin<lotes_desperdiciados>;
  setLotes_desperdiciados!: Sequelize.HasManySetAssociationsMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  addLotes_desperdiciado!: Sequelize.HasManyAddAssociationMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  addLotes_desperdiciados!: Sequelize.HasManyAddAssociationsMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  createLotes_desperdiciado!: Sequelize.HasManyCreateAssociationMixin<lotes_desperdiciados>;
  removeLotes_desperdiciado!: Sequelize.HasManyRemoveAssociationMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  removeLotes_desperdiciados!: Sequelize.HasManyRemoveAssociationsMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  hasLotes_desperdiciado!: Sequelize.HasManyHasAssociationMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  hasLotes_desperdiciados!: Sequelize.HasManyHasAssociationsMixin<lotes_desperdiciados, lotes_desperdiciadosId>;
  countLotes_desperdiciados!: Sequelize.HasManyCountAssociationsMixin;
  // productosbodega belongsTo proveedor via proveedor_id
  proveedor!: proveedor;
  getProveedor!: Sequelize.BelongsToGetAssociationMixin<proveedor>;
  setProveedor!: Sequelize.BelongsToSetAssociationMixin<proveedor, proveedorId>;
  createProveedor!: Sequelize.BelongsToCreateAssociationMixin<proveedor>;

  static initModel(sequelize: Sequelize.Sequelize): typeof productosbodega {
    return productosbodega.init({
    producto_bodega_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proveedor',
        key: 'proveedor_id'
      }
    },
    peso_proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'peso',
        key: 'peso_id'
      }
    },
    nombre_producto: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cantidad_actual: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    cantidad_maxima: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    tipo: {
      type: DataTypes.ENUM('liquidos','solidos'),
      allowNull: true,
      defaultValue: "solidos"
    },
    precio_proveedor: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    },
    cantidad_minima: {
      type: DataTypes.DECIMAL(14,3),
      allowNull: true,
      defaultValue: 0.000
    }
  }, {
    sequelize,
    tableName: 'productosbodega',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "producto_bodega_id" },
        ]
      },
      {
        name: "fk_proveedor",
        using: "BTREE",
        fields: [
          { name: "proveedor_id" },
        ]
      },
      {
        name: "fk_peso_proveedor_id_producto_bodega",
        using: "BTREE",
        fields: [
          { name: "peso_proveedor_id" },
        ]
      },
    ]
  });
  }
}
