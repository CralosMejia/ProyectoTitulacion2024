import type { Sequelize } from "sequelize";
import { detallefactura as _detallefactura } from "./detallefactura";
import type { detallefacturaAttributes, detallefacturaCreationAttributes } from "./detallefactura";
import { detalleordenes as _detalleordenes } from "./detalleordenes";
import type { detalleordenesAttributes, detalleordenesCreationAttributes } from "./detalleordenes";
import { facturas as _facturas } from "./facturas";
import type { facturasAttributes, facturasCreationAttributes } from "./facturas";
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
  _detallefactura as detallefactura,
  _detalleordenes as detalleordenes,
  _facturas as facturas,
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
  detallefacturaAttributes,
  detallefacturaCreationAttributes,
  detalleordenesAttributes,
  detalleordenesCreationAttributes,
  facturasAttributes,
  facturasCreationAttributes,
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
  const detallefactura = _detallefactura.initModel(sequelize);
  const detalleordenes = _detalleordenes.initModel(sequelize);
  const facturas = _facturas.initModel(sequelize);
  const ingredientesporplato = _ingredientesporplato.initModel(sequelize);
  const lotes = _lotes.initModel(sequelize);
  const ordenes = _ordenes.initModel(sequelize);
  const ordenesproveedor = _ordenesproveedor.initModel(sequelize);
  const peso = _peso.initModel(sequelize);
  const platos = _platos.initModel(sequelize);
  const productosbodega = _productosbodega.initModel(sequelize);
  const proveedor = _proveedor.initModel(sequelize);

  detallefactura.belongsTo(facturas, { as: "factura", foreignKey: "factura_id"});
  facturas.hasMany(detallefactura, { as: "detallefacturas", foreignKey: "factura_id"});
  detalleordenes.belongsTo(ordenes, { as: "orden", foreignKey: "orden_id"});
  ordenes.hasMany(detalleordenes, { as: "detalleordenes", foreignKey: "orden_id"});
  ordenesproveedor.belongsTo(ordenes, { as: "orden", foreignKey: "orden_id"});
  ordenes.hasMany(ordenesproveedor, { as: "ordenesproveedors", foreignKey: "orden_id"});
  ingredientesporplato.belongsTo(peso, { as: "peso", foreignKey: "peso_id"});
  peso.hasMany(ingredientesporplato, { as: "ingredientesporplatos", foreignKey: "peso_id"});
  productosbodega.belongsTo(peso, { as: "peso", foreignKey: "peso_id"});
  peso.hasMany(productosbodega, { as: "productosbodegas", foreignKey: "peso_id"});
  detallefactura.belongsTo(platos, { as: "plato", foreignKey: "plato_id"});
  platos.hasMany(detallefactura, { as: "detallefacturas", foreignKey: "plato_id"});
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
    detallefactura: detallefactura,
    detalleordenes: detalleordenes,
    facturas: facturas,
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
