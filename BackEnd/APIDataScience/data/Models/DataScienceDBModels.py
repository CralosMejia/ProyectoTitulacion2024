# coding: utf-8
from sqlalchemy import Column, DECIMAL, Date, DateTime, ForeignKey, Integer, String, Text, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Dimestado(Base):
    __tablename__ = 'dimestado'

    estado_id = Column(Integer, primary_key=True)
    descripcion_estado = Column(String(255))


class Dimfecha(Base):
    __tablename__ = 'dimfecha'

    fecha_id = Column(Integer, primary_key=True)
    fecha = Column(Date, nullable=False)
    semana = Column(Integer)
    mes = Column(Integer)
    anio = Column(Integer)


class Dimpedido(Base):
    __tablename__ = 'dimpedido'

    pedido_id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer)
    monto_total = Column(DECIMAL(10, 2))
    fecha_creacion = Column(DateTime)


class Dimplato(Base):
    __tablename__ = 'dimplato'

    plato_id = Column(Integer, primary_key=True)
    nombre_plato = Column(String(255))
    descripcion = Column(Text)
    precio = Column(DECIMAL(10, 2))


class Dimunidadmedida(Base):
    __tablename__ = 'dimunidadmedida'

    unidad_medida_id = Column(Integer, primary_key=True)
    unidad = Column(String(50))
    simbolo = Column(String(10))
    tipo = Column(String(50), nullable=False)


class Dimproducto(Base):
    __tablename__ = 'dimproducto'

    producto_id = Column(Integer, primary_key=True)
    nombre_producto = Column(String(255))
    tipo_producto = Column(String(255))
    precio_proveedor = Column(DECIMAL(10, 2))
    unidad_medida_id = Column(ForeignKey('dimunidadmedida.unidad_medida_id'), index=True)

    unidad_medida = relationship('Dimunidadmedida')


class Hechosestadopedido(Base):
    __tablename__ = 'hechosestadopedido'

    estado_pedido_id = Column(Integer, primary_key=True)
    fecha_id = Column(ForeignKey('dimfecha.fecha_id'), index=True)
    pedido_id = Column(ForeignKey('dimpedido.pedido_id'), index=True)
    estado_id = Column(ForeignKey('dimestado.estado_id'), index=True)

    estado = relationship('Dimestado')
    fecha = relationship('Dimfecha')
    pedido = relationship('Dimpedido')


class Hechosventaplato(Base):
    __tablename__ = 'hechosventaplatos'

    venta_plato_id = Column(Integer, primary_key=True)
    venta_id = Column(Integer, nullable=False)
    fecha_id = Column(ForeignKey('dimfecha.fecha_id'), index=True)
    plato_id = Column(ForeignKey('dimplato.plato_id'), index=True)
    unidades_vendidas = Column(Integer)
    precio_total = Column(DECIMAL(10, 2))

    fecha = relationship('Dimfecha')
    plato = relationship('Dimplato')


class Hechosdemandaproducto(Base):
    __tablename__ = 'hechosdemandaproducto'

    demanda_id = Column(Integer, primary_key=True)
    fecha_id = Column(ForeignKey('dimfecha.fecha_id'), index=True)
    producto_id = Column(ForeignKey('dimproducto.producto_id'), index=True)
    cantidad_predicha_modelo_1 = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    cantidad_predicha_modelo_2 = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    cantidad_real = Column(DECIMAL(10, 2), server_default=text("'0.00'"))

    fecha = relationship('Dimfecha')
    producto = relationship('Dimproducto')
