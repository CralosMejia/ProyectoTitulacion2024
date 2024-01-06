import type { Sequelize } from "sequelize";
import { conversionpeso as _conversionpeso } from "./conversionpeso";
import type { conversionpesoAttributes, conversionpesoCreationAttributes } from "./conversionpeso";
import { detalleordenes as _detalleordenes } from "./detalleordenes";
import type { detalleordenesAttributes, detalleordenesCreationAttributes } from "./detalleordenes";
import { ingredientesporplato as _ingredientesporplato } from "./ingredientesporplato";
import type { ingredientesporplatoAttributes, ingredientesporplatoCreationAttributes } from "./ingredientesporplato";
import { logsapp as _logsapp } from "./logsapp";
import type { logsappAttributes, logsappCreationAttributes } from "./logsapp";
import { lotes as _lotes } from "./lotes";
import type { lotesAttributes, lotesCreationAttributes } from "./lotes";
import { ordenes as _ordenes } from "./ordenes";
import type { ordenesAttributes, ordenesCreationAttributes } from "./ordenes";
import { peso as _peso } from "./peso";
import type { pesoAttributes, pesoCreationAttributes } from "./peso";
import { platos as _platos } from "./platos";
import type { platosAttributes, platosCreationAttributes } from "./platos";
import { productosbodega as _productosbodega } from "./productosbodega";
import type { productosbodegaAttributes, productosbodegaCreationAttributes } from "./productosbodega";
import { proveedor as _proveedor } from "./proveedor";
import type { proveedorAttributes, proveedorCreationAttributes } from "./proveedor";
import { ventas as _ventas } from "./ventas";
import type { ventasAttributes, ventasCreationAttributes } from "./ventas";

export {
  _conversionpeso as conversionpeso,
  _detalleordenes as detalleordenes,
  _ingredientesporplato as ingredientesporplato,
  _logsapp as logsapp,
  _lotes as lotes,
  _ordenes as ordenes,
  _peso as peso,
  _platos as platos,
  _productosbodega as productosbodega,
  _proveedor as proveedor,
  _ventas as ventas,
};

export type {
  conversionpesoAttributes,
  conversionpesoCreationAttributes,
  detalleordenesAttributes,
  detalleordenesCreationAttributes,
  ingredientesporplatoAttributes,
  ingredientesporplatoCreationAttributes,
  logsappAttributes,
  logsappCreationAttributes,
  lotesAttributes,
  lotesCreationAttributes,
  ordenesAttributes,
  ordenesCreationAttributes,
  pesoAttributes,
  pesoCreationAttributes,
  platosAttributes,
  platosCreationAttributes,
  productosbodegaAttributes,
  productosbodegaCreationAttributes,
  proveedorAttributes,
  proveedorCreationAttributes,
  ventasAttributes,
  ventasCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const conversionpeso = _conversionpeso.initModel(sequelize);
  const detalleordenes = _detalleordenes.initModel(sequelize);
  const ingredientesporplato = _ingredientesporplato.initModel(sequelize);
  const logsapp = _logsapp.initModel(sequelize);
  const lotes = _lotes.initModel(sequelize);
  const ordenes = _ordenes.initModel(sequelize);
  const peso = _peso.initModel(sequelize);
  const platos = _platos.initModel(sequelize);
  const productosbodega = _productosbodega.initModel(sequelize);
  const proveedor = _proveedor.initModel(sequelize);
  const ventas = _ventas.initModel(sequelize);

  detalleordenes.belongsTo(ordenes, { as: "orden", foreignKey: "orden_id"});
  ordenes.hasMany(detalleordenes, { as: "detalleordenes", foreignKey: "orden_id"});
  conversionpeso.belongsTo(peso, { as: "peso_id_origen_peso", foreignKey: "peso_id_origen"});
  peso.hasMany(conversionpeso, { as: "conversionpesos", foreignKey: "peso_id_origen"});
  conversionpeso.belongsTo(peso, { as: "peso_id_destino_peso", foreignKey: "peso_id_destino"});
  peso.hasMany(conversionpeso, { as: "peso_id_destino_conversionpesos", foreignKey: "peso_id_destino"});
  ingredientesporplato.belongsTo(peso, { as: "peso", foreignKey: "peso_id"});
  peso.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "peso_id"});
  productosbodega.belongsTo(peso, { as: "peso_proveedor", foreignKey: "peso_proveedor_id"});
  peso.hasMany(productosbodega, { as: "productosbodegas", foreignKey: "peso_proveedor_id"});
  ingredientesporplato.belongsTo(platos, { as: "plato", foreignKey: "plato_id"});
  platos.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "plato_id"});
  ventas.belongsTo(platos, { as: "plato", foreignKey: "plato_id"});
  platos.hasMany(ventas, { as: "venta", foreignKey: "plato_id"});
  detalleordenes.belongsTo(productosbodega, { as: "producto_bodega", foreignKey: "producto_bodega_id"});
  productosbodega.hasMany(detalleordenes, { as: "detalleordenes", foreignKey: "producto_bodega_id"});
  ingredientesporplato.belongsTo(productosbodega, { as: "producto_bodega", foreignKey: "producto_bodega_id"});
  productosbodega.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "producto_bodega_id"});
  lotes.belongsTo(productosbodega, { as: "producto_bodega", foreignKey: "producto_bodega_id"});
  productosbodega.hasMany(lotes, { as: "lotes", foreignKey: "producto_bodega_id"});
  productosbodega.belongsTo(proveedor, { as: "proveedor", foreignKey: "proveedor_id"});
  proveedor.hasMany(productosbodega, { as: "productosbodegas", foreignKey: "proveedor_id"});

  return {
    conversionpeso: conversionpeso,
    detalleordenes: detalleordenes,
    ingredientesporplato: ingredientesporplato,
    logsapp: logsapp,
    lotes: lotes,
    ordenes: ordenes,
    peso: peso,
    platos: platos,
    productosbodega: productosbodega,
    proveedor: proveedor,
    ventas: ventas,
  };
}
