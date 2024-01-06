import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { conversionpeso, conversionpesoId } from './conversionpeso';
import type { ingredientesporplato, ingredientesporplatoId } from './ingredientesporplato';
import type { productosbodega, productosbodegaId } from './productosbodega';

export interface pesoAttributes {
  peso_id: number;
  unidad: string;
  simbolo: string;
  tipo?: 'liquidos' | 'solidos';
  tipo_uso?: 'proveedor' | 'uso' | 'ambos';
}

export type pesoPk = "peso_id";
export type pesoId = peso[pesoPk];
export type pesoOptionalAttributes = "peso_id" | "tipo" | "tipo_uso";
export type pesoCreationAttributes = Optional<pesoAttributes, pesoOptionalAttributes>;

export class peso extends Model<pesoAttributes, pesoCreationAttributes> implements pesoAttributes {
  peso_id!: number;
  unidad!: string;
  simbolo!: string;
  tipo?: 'liquidos' | 'solidos';
  tipo_uso?: 'proveedor' | 'uso' | 'ambos';

  // peso hasMany conversionpeso via peso_id_origen
  conversionpesos!: conversionpeso[];
  getConversionpesos!: Sequelize.HasManyGetAssociationsMixin<conversionpeso>;
  setConversionpesos!: Sequelize.HasManySetAssociationsMixin<conversionpeso, conversionpesoId>;
  addConversionpeso!: Sequelize.HasManyAddAssociationMixin<conversionpeso, conversionpesoId>;
  addConversionpesos!: Sequelize.HasManyAddAssociationsMixin<conversionpeso, conversionpesoId>;
  createConversionpeso!: Sequelize.HasManyCreateAssociationMixin<conversionpeso>;
  removeConversionpeso!: Sequelize.HasManyRemoveAssociationMixin<conversionpeso, conversionpesoId>;
  removeConversionpesos!: Sequelize.HasManyRemoveAssociationsMixin<conversionpeso, conversionpesoId>;
  hasConversionpeso!: Sequelize.HasManyHasAssociationMixin<conversionpeso, conversionpesoId>;
  hasConversionpesos!: Sequelize.HasManyHasAssociationsMixin<conversionpeso, conversionpesoId>;
  countConversionpesos!: Sequelize.HasManyCountAssociationsMixin;
  // peso hasMany conversionpeso via peso_id_destino
  peso_id_destino_conversionpesos!: conversionpeso[];
  getPeso_id_destino_conversionpesos!: Sequelize.HasManyGetAssociationsMixin<conversionpeso>;
  setPeso_id_destino_conversionpesos!: Sequelize.HasManySetAssociationsMixin<conversionpeso, conversionpesoId>;
  addPeso_id_destino_conversionpeso!: Sequelize.HasManyAddAssociationMixin<conversionpeso, conversionpesoId>;
  addPeso_id_destino_conversionpesos!: Sequelize.HasManyAddAssociationsMixin<conversionpeso, conversionpesoId>;
  createPeso_id_destino_conversionpeso!: Sequelize.HasManyCreateAssociationMixin<conversionpeso>;
  removePeso_id_destino_conversionpeso!: Sequelize.HasManyRemoveAssociationMixin<conversionpeso, conversionpesoId>;
  removePeso_id_destino_conversionpesos!: Sequelize.HasManyRemoveAssociationsMixin<conversionpeso, conversionpesoId>;
  hasPeso_id_destino_conversionpeso!: Sequelize.HasManyHasAssociationMixin<conversionpeso, conversionpesoId>;
  hasPeso_id_destino_conversionpesos!: Sequelize.HasManyHasAssociationsMixin<conversionpeso, conversionpesoId>;
  countPeso_id_destino_conversionpesos!: Sequelize.HasManyCountAssociationsMixin;
  // peso hasMany ingredientesporplato via peso_id
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
  // peso hasMany productosbodega via peso_proveedor_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof peso {
    return peso.init({
    peso_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    unidad: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    simbolo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('liquidos','solidos'),
      allowNull: true,
      defaultValue: "solidos"
    },
    tipo_uso: {
      type: DataTypes.ENUM('proveedor','uso','ambos'),
      allowNull: true,
      defaultValue: "proveedor"
    }
  }, {
    sequelize,
    tableName: 'peso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "peso_id" },
        ]
      },
    ]
  });
  }
}
