# coding: utf-8
from sqlalchemy import CHAR, Column, DECIMAL, Date, DateTime, Enum, ForeignKey, Integer, String, text
from sqlalchemy.dialects.mysql import LONGTEXT, TINYINT, VARCHAR
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Logsapp(Base):
    __tablename__ = 'logsapp'

    logs_app_id = Column(Integer, primary_key=True)
    log_description = Column(LONGTEXT, nullable=False)
    fecha_log = Column(DateTime, nullable=False)
    sistema = Column(String(250), nullable=False)
    modulo = Column(String(250), nullable=False)


class Ordene(Base):
    __tablename__ = 'ordenes'

    orden_id = Column(Integer, primary_key=True)
    fecha_orden = Column(Date, nullable=False)
    estado = Column(Enum('En espera', 'Enviado', 'Cancelado', 'Aprobado', 'Recibido'), server_default=text("'En espera'"))
    estado_edicion = Column(TINYINT(1), server_default=text("'0'"))
    total = Column(DECIMAL(10, 6), server_default=text("'0.000000'"))
    modo_creacion = Column(Enum('Manual', 'Automatico'), server_default=text("'Manual'"))


class Peso(Base):
    __tablename__ = 'peso'

    peso_id = Column(Integer, primary_key=True)
    unidad = Column(VARCHAR(50), nullable=False)
    simbolo = Column(VARCHAR(50), nullable=False)
    tipo = Column(Enum('liquidos', 'solidos'), server_default=text("'solidos'"))
    tipo_uso = Column(Enum('proveedor', 'uso', 'ambos'), server_default=text("'proveedor'"))


class Plato(Base):
    __tablename__ = 'platos'

    plato_id = Column(Integer, primary_key=True)
    nombre_plato = Column(VARCHAR(50), nullable=False)
    descripcion = Column(CHAR(70), server_default=text("''"))
    precio = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    imagen = Column(VARCHAR(255))
    estado = Column(Enum('Disponible', 'No disponible'), server_default=text("'Disponible'"))
    numero_platos = Column(Integer, server_default=text("'1'"))


class Proveedor(Base):
    __tablename__ = 'proveedor'

    proveedor_id = Column(Integer, primary_key=True)
    nombre_proveedor = Column(VARCHAR(25), nullable=False)
    email = Column(VARCHAR(50), nullable=False)
    telefono = Column(CHAR(23), nullable=False)
    nivel = Column(Enum('1', '2', '3'))
    estado = Column(Enum('activo', 'inactivo'), server_default=text("'activo'"))


class Conversionpeso(Base):
    __tablename__ = 'conversionpeso'

    conversion_id = Column(Integer, primary_key=True)
    peso_id_origen = Column(ForeignKey('peso.peso_id'), nullable=False, index=True)
    peso_id_destino = Column(ForeignKey('peso.peso_id'), nullable=False, index=True)
    factor_conversion = Column(DECIMAL(10, 4), server_default=text("'0.0000'"))

    peso = relationship('Peso', primaryjoin='Conversionpeso.peso_id_destino == Peso.peso_id')
    peso1 = relationship('Peso', primaryjoin='Conversionpeso.peso_id_origen == Peso.peso_id')


class Productosbodega(Base):
    __tablename__ = 'productosbodega'

    producto_bodega_id = Column(Integer, primary_key=True)
    proveedor_id = Column(ForeignKey('proveedor.proveedor_id'), nullable=False, index=True)
    peso_proveedor_id = Column(ForeignKey('peso.peso_id'), nullable=False, index=True)
    nombre_producto = Column(VARCHAR(50), nullable=False)
    cantidad_actual = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    cantidad_maxima = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    tipo = Column(Enum('liquidos', 'solidos'), server_default=text("'solidos'"))
    precio_proveedor = Column(DECIMAL(8, 6), server_default=text("'0.000000'"))

    peso_proveedor = relationship('Peso')
    proveedor = relationship('Proveedor')


class Venta(Base):
    __tablename__ = 'ventas'

    venta_id = Column(Integer, primary_key=True)
    plato_id = Column(ForeignKey('platos.plato_id'), index=True)
    cantidad = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    precio_unitario = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    precio_total = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    fecha_inicio_semana = Column(Date, nullable=False)
    fecha_fin_semana = Column(Date, nullable=False)

    plato = relationship('Plato')


class Detalleordene(Base):
    __tablename__ = 'detalleordenes'

    detalle_orden_id = Column(Integer, primary_key=True)
    producto_bodega_id = Column(ForeignKey('productosbodega.producto_bodega_id'), nullable=False, index=True)
    orden_id = Column(ForeignKey('ordenes.orden_id'), nullable=False, index=True)
    cantidad_necesaria = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    estado = Column(Enum('Por recibir', 'Recibido'), server_default=text("'Por recibir'"))

    orden = relationship('Ordene')
    producto_bodega = relationship('Productosbodega')


class Ingredientesporplato(Base):
    __tablename__ = 'ingredientesporplato'

    ingrediente_plato_id = Column(Integer, primary_key=True)
    plato_id = Column(ForeignKey('platos.plato_id'), nullable=False, index=True)
    producto_bodega_id = Column(ForeignKey('productosbodega.producto_bodega_id'), nullable=False, index=True)
    peso_id = Column(ForeignKey('peso.peso_id'), nullable=False, index=True)
    cantidad_necesaria = Column(DECIMAL(10, 2), server_default=text("'0.00'"))

    peso = relationship('Peso')
    plato = relationship('Plato')
    producto_bodega = relationship('Productosbodega')


class Lote(Base):
    __tablename__ = 'lotes'

    lote_id = Column(Integer, primary_key=True)
    producto_bodega_id = Column(ForeignKey('productosbodega.producto_bodega_id'), nullable=False, index=True)
    fecha_ingreso = Column(Date, nullable=False)
    fecha_vencimiento = Column(Date, nullable=False)
    cantidad = Column(DECIMAL(10, 2), server_default=text("'0.00'"))

    producto_bodega = relationship('Productosbodega')
