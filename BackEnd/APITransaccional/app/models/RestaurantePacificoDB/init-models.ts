import type { Sequelize } from "sequelize";
import { detalleordenes as _detalleordenes } from "./detalleordenes";
import type { detalleordenesAttributes, detalleordenesCreationAttributes } from "./detalleordenes";
import { ingredientesporplato as _ingredientesporplato } from "./ingredientesporplato";
import type { ingredientesporplatoAttributes, ingredientesporplatoCreationAttributes } from "./ingredientesporplato";
import { lotes as _lotes } from "./lotes";
import type { lotesAttributes, lotesCreationAttributes } from "./lotes";
import { ordenes as _ordenes } from "./ordenes";
import type { ordenesAttributes, ordenesCreationAttributes } from "./ordenes";
import { ordenesproveedor as _ordenesproveedor } from "./ordenesproveedor";
import type { ordenesproveedorAttributes, ordenesproveedorCreationAttributes } from "./ordenesproveedor";
import { peso as _peso } from "./peso";
import type { pesoAttributes, pesoCreationAttributes } from "./peso";
import { platos as _platos } from "./platos";
import type { platosAttributes, platosCreationAttributes } from "./platos";
import { productosbodega as _productosbodega } from "./productosbodega";
import type { productosbodegaAttributes, productosbodegaCreationAttributes } from "./productosbodega";
import { proveedor as _proveedor } from "./proveedor";
import type { proveedorAttributes, proveedorCreationAttributes } from "./proveedor";

export {
  _detalleordenes as detalleordenes,
  _ingredientesporplato as ingredientesporplato,
  _lotes as lotes,
  _ordenes as ordenes,
  _ordenesproveedor as ordenesproveedor,
  _peso as peso,
  _platos as platos,
  _productosbodega as productosbodega,
  _proveedor as proveedor,
};

export type {
  detalleordenesAttributes,
  detalleordenesCreationAttributes,
  ingredientesporplatoAttributes,
  ingredientesporplatoCreationAttributes,
  lotesAttributes,
  lotesCreationAttributes,
  ordenesAttributes,
  ordenesCreationAttributes,
  ordenesproveedorAttributes,
  ordenesproveedorCreationAttributes,
  pesoAttributes,
  pesoCreationAttributes,
  platosAttributes,
  platosCreationAttributes,
  productosbodegaAttributes,
  productosbodegaCreationAttributes,
  proveedorAttributes,
  proveedorCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const detalleordenes = _detalleordenes.initModel(sequelize);
  const ingredientesporplato = _ingredientesporplato.initModel(sequelize);
  const lotes = _lotes.initModel(sequelize);
  const ordenes = _ordenes.initModel(sequelize);
  const ordenesproveedor = _ordenesproveedor.initModel(sequelize);
  const peso = _peso.initModel(sequelize);
  const platos = _platos.initModel(sequelize);
  const productosbodega = _productosbodega.initModel(sequelize);
  const proveedor = _proveedor.initModel(sequelize);

  detalleordenes.belongsTo(ordenes, { as: "orden", foreignKey: "orden_id"});
  ordenes.hasMany(detalleordenes, { as: "detalleordenes", foreignKey: "orden_id"});
  ordenesproveedor.belongsTo(ordenes, { as: "orden", foreignKey: "orden_id"});
  ordenes.hasMany(ordenesproveedor, { as: "ordenesproveedors", foreignKey: "orden_id"});
  ingredientesporplato.belongsTo(peso, { as: "peso", foreignKey: "peso_id"});
  peso.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "peso_id"});
  productosbodega.belongsTo(peso, { as: "peso", foreignKey: "peso_id"});
  peso.hasMany(productosbodega, { as: "productosbodegas", foreignKey: "peso_id"});
  ingredientesporplato.belongsTo(platos, { as: "plato", foreignKey: "plato_id"});
  platos.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "plato_id"});
  detalleordenes.belongsTo(productosbodega, { as: "producto_bodega", foreignKey: "producto_bodega_id"});
  productosbodega.hasMany(detalleordenes, { as: "detalleordenes", foreignKey: "producto_bodega_id"});
  ingredientesporplato.belongsTo(productosbodega, { as: "producto_bodega", foreignKey: "producto_bodega_id"});
  productosbodega.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "producto_bodega_id"});
  lotes.belongsTo(productosbodega, { as: "producto_bodega", foreignKey: "producto_bodega_id"});
  productosbodega.hasMany(lotes, { as: "lotes", foreignKey: "producto_bodega_id"});
  ordenesproveedor.belongsTo(proveedor, { as: "proveedor", foreignKey: "proveedor_id"});
  proveedor.hasMany(ordenesproveedor, { as: "ordenesproveedors", foreignKey: "proveedor_id"});
  productosbodega.belongsTo(proveedor, { as: "proveedor", foreignKey: "proveedor_id"});
  proveedor.hasMany(productosbodega, { as: "productosbodegas", foreignKey: "proveedor_id"});

  return {
    detalleordenes: detalleordenes,
    ingredientesporplato: ingredientesporplato,
    lotes: lotes,
    ordenes: ordenes,
    ordenesproveedor: ordenesproveedor,
    peso: peso,
    platos: platos,
    productosbodega: productosbodega,
    proveedor: proveedor,
  };
}
