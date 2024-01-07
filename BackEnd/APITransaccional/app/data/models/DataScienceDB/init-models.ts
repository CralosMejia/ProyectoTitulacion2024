import type { Sequelize } from "sequelize";
import { dimfecha as _dimfecha } from "./dimfecha";
import type { dimfechaAttributes, dimfechaCreationAttributes } from "./dimfecha";
import { dimplato as _dimplato } from "./dimplato";
import type { dimplatoAttributes, dimplatoCreationAttributes } from "./dimplato";
import { dimproducto as _dimproducto } from "./dimproducto";
import type { dimproductoAttributes, dimproductoCreationAttributes } from "./dimproducto";
import { dimunidadmedida as _dimunidadmedida } from "./dimunidadmedida";
import type { dimunidadmedidaAttributes, dimunidadmedidaCreationAttributes } from "./dimunidadmedida";
import { hechosdemandaproducto as _hechosdemandaproducto } from "./hechosdemandaproducto";
import type { hechosdemandaproductoAttributes, hechosdemandaproductoCreationAttributes } from "./hechosdemandaproducto";
import { hechosventaplatos as _hechosventaplatos } from "./hechosventaplatos";
import type { hechosventaplatosAttributes, hechosventaplatosCreationAttributes } from "./hechosventaplatos";

export {
  _dimfecha as dimfecha,
  _dimplato as dimplato,
  _dimproducto as dimproducto,
  _dimunidadmedida as dimunidadmedida,
  _hechosdemandaproducto as hechosdemandaproducto,
  _hechosventaplatos as hechosventaplatos,
};

export type {
  dimfechaAttributes,
  dimfechaCreationAttributes,
  dimplatoAttributes,
  dimplatoCreationAttributes,
  dimproductoAttributes,
  dimproductoCreationAttributes,
  dimunidadmedidaAttributes,
  dimunidadmedidaCreationAttributes,
  hechosdemandaproductoAttributes,
  hechosdemandaproductoCreationAttributes,
  hechosventaplatosAttributes,
  hechosventaplatosCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const dimfecha = _dimfecha.initModel(sequelize);
  const dimplato = _dimplato.initModel(sequelize);
  const dimproducto = _dimproducto.initModel(sequelize);
  const dimunidadmedida = _dimunidadmedida.initModel(sequelize);
  const hechosdemandaproducto = _hechosdemandaproducto.initModel(sequelize);
  const hechosventaplatos = _hechosventaplatos.initModel(sequelize);

  hechosdemandaproducto.belongsTo(dimfecha, { as: "fecha", foreignKey: "fecha_id"});
  dimfecha.hasMany(hechosdemandaproducto, { as: "hechosdemandaproductos", foreignKey: "fecha_id"});
  hechosventaplatos.belongsTo(dimfecha, { as: "fecha", foreignKey: "fecha_id"});
  dimfecha.hasMany(hechosventaplatos, { as: "hechosventaplatos", foreignKey: "fecha_id"});
  hechosventaplatos.belongsTo(dimplato, { as: "plato", foreignKey: "plato_id"});
  dimplato.hasMany(hechosventaplatos, { as: "hechosventaplatos", foreignKey: "plato_id"});
  hechosdemandaproducto.belongsTo(dimproducto, { as: "producto", foreignKey: "producto_id"});
  dimproducto.hasMany(hechosdemandaproducto, { as: "hechosdemandaproductos", foreignKey: "producto_id"});
  dimproducto.belongsTo(dimunidadmedida, { as: "unidad_medida", foreignKey: "unidad_medida_id"});
  dimunidadmedida.hasMany(dimproducto, { as: "dimproductos", foreignKey: "unidad_medida_id"});

  return {
    dimfecha: dimfecha,
    dimplato: dimplato,
    dimproducto: dimproducto,
    dimunidadmedida: dimunidadmedida,
    hechosdemandaproducto: hechosdemandaproducto,
    hechosventaplatos: hechosventaplatos,
  };
}
