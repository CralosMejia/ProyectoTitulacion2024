import type { Sequelize } from "sequelize";
import { dimestado as _dimestado } from "./dimestado";
import type { dimestadoAttributes, dimestadoCreationAttributes } from "./dimestado";
import { dimfecha as _dimfecha } from "./dimfecha";
import type { dimfechaAttributes, dimfechaCreationAttributes } from "./dimfecha";
import { dimpedido as _dimpedido } from "./dimpedido";
import type { dimpedidoAttributes, dimpedidoCreationAttributes } from "./dimpedido";
import { dimplato as _dimplato } from "./dimplato";
import type { dimplatoAttributes, dimplatoCreationAttributes } from "./dimplato";
import { dimproducto as _dimproducto } from "./dimproducto";
import type { dimproductoAttributes, dimproductoCreationAttributes } from "./dimproducto";
import { dimunidadmedida as _dimunidadmedida } from "./dimunidadmedida";
import type { dimunidadmedidaAttributes, dimunidadmedidaCreationAttributes } from "./dimunidadmedida";
import { hechosdemandaproducto as _hechosdemandaproducto } from "./hechosdemandaproducto";
import type { hechosdemandaproductoAttributes, hechosdemandaproductoCreationAttributes } from "./hechosdemandaproducto";
import { hechosestadopedido as _hechosestadopedido } from "./hechosestadopedido";
import type { hechosestadopedidoAttributes, hechosestadopedidoCreationAttributes } from "./hechosestadopedido";
import { hechosventaplatos as _hechosventaplatos } from "./hechosventaplatos";
import type { hechosventaplatosAttributes, hechosventaplatosCreationAttributes } from "./hechosventaplatos";

export {
  _dimestado as dimestado,
  _dimfecha as dimfecha,
  _dimpedido as dimpedido,
  _dimplato as dimplato,
  _dimproducto as dimproducto,
  _dimunidadmedida as dimunidadmedida,
  _hechosdemandaproducto as hechosdemandaproducto,
  _hechosestadopedido as hechosestadopedido,
  _hechosventaplatos as hechosventaplatos,
};

export type {
  dimestadoAttributes,
  dimestadoCreationAttributes,
  dimfechaAttributes,
  dimfechaCreationAttributes,
  dimpedidoAttributes,
  dimpedidoCreationAttributes,
  dimplatoAttributes,
  dimplatoCreationAttributes,
  dimproductoAttributes,
  dimproductoCreationAttributes,
  dimunidadmedidaAttributes,
  dimunidadmedidaCreationAttributes,
  hechosdemandaproductoAttributes,
  hechosdemandaproductoCreationAttributes,
  hechosestadopedidoAttributes,
  hechosestadopedidoCreationAttributes,
  hechosventaplatosAttributes,
  hechosventaplatosCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const dimestado = _dimestado.initModel(sequelize);
  const dimfecha = _dimfecha.initModel(sequelize);
  const dimpedido = _dimpedido.initModel(sequelize);
  const dimplato = _dimplato.initModel(sequelize);
  const dimproducto = _dimproducto.initModel(sequelize);
  const dimunidadmedida = _dimunidadmedida.initModel(sequelize);
  const hechosdemandaproducto = _hechosdemandaproducto.initModel(sequelize);
  const hechosestadopedido = _hechosestadopedido.initModel(sequelize);
  const hechosventaplatos = _hechosventaplatos.initModel(sequelize);

  hechosestadopedido.belongsTo(dimestado, { as: "estado", foreignKey: "estado_id"});
  dimestado.hasMany(hechosestadopedido, { as: "hechosestadopedidos", foreignKey: "estado_id"});
  hechosdemandaproducto.belongsTo(dimfecha, { as: "fecha", foreignKey: "fecha_id"});
  dimfecha.hasMany(hechosdemandaproducto, { as: "hechosdemandaproductos", foreignKey: "fecha_id"});
  hechosestadopedido.belongsTo(dimfecha, { as: "fecha", foreignKey: "fecha_id"});
  dimfecha.hasMany(hechosestadopedido, { as: "hechosestadopedidos", foreignKey: "fecha_id"});
  hechosventaplatos.belongsTo(dimfecha, { as: "fecha", foreignKey: "fecha_id"});
  dimfecha.hasMany(hechosventaplatos, { as: "hechosventaplatos", foreignKey: "fecha_id"});
  hechosestadopedido.belongsTo(dimpedido, { as: "pedido", foreignKey: "pedido_id"});
  dimpedido.hasMany(hechosestadopedido, { as: "hechosestadopedidos", foreignKey: "pedido_id"});
  hechosventaplatos.belongsTo(dimplato, { as: "plato", foreignKey: "plato_id"});
  dimplato.hasMany(hechosventaplatos, { as: "hechosventaplatos", foreignKey: "plato_id"});
  hechosdemandaproducto.belongsTo(dimproducto, { as: "producto", foreignKey: "producto_id"});
  dimproducto.hasMany(hechosdemandaproducto, { as: "hechosdemandaproductos", foreignKey: "producto_id"});
  dimproducto.belongsTo(dimunidadmedida, { as: "unidad_medida", foreignKey: "unidad_medida_id"});
  dimunidadmedida.hasMany(dimproducto, { as: "dimproductos", foreignKey: "unidad_medida_id"});

  return {
    dimestado: dimestado,
    dimfecha: dimfecha,
    dimpedido: dimpedido,
    dimplato: dimplato,
    dimproducto: dimproducto,
    dimunidadmedida: dimunidadmedida,
    hechosdemandaproducto: hechosdemandaproducto,
    hechosestadopedido: hechosestadopedido,
    hechosventaplatos: hechosventaplatos,
  };
}
