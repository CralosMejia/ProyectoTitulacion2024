
from sqlalchemy import CHAR, Column, DECIMAL, Date, Enum, Integer, String, text
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class ConversionpesoEtlExt(Base):
    __tablename__ = 'conversionpeso_etl_ext'

    conversion_ETL_EXT_id = Column(Integer, primary_key=True)
    conversion_id = Column(Integer, nullable=False)
    peso_id_origen = Column(Integer, nullable=False)
    peso_id_destino = Column(Integer, nullable=False)
    factor_conversion = Column(DECIMAL(10, 4), server_default=text("'0.0000'"))


class DemandaEtlTra(Base):
    __tablename__ = 'demanda_etl_tra'

    demanda_ETL_TRA_id = Column(Integer, primary_key=True)
    fecha_id = Column(Integer, nullable=False)
    producto_id = Column(Integer, nullable=False)
    cantidad_total = Column(DECIMAL(10, 2), server_default=text("'0.00'"))


class FechaEtlTra(Base):
    __tablename__ = 'fecha_etl_tra'

    fecha_ETL_TRA_id = Column(Integer, primary_key=True)
    fecha = Column(String(50), nullable=False)
    mes = Column(Integer, nullable=False)
    anio = Column(Integer, nullable=False)
    semana = Column(Integer, nullable=False)


class IngredientesporplatoEtlExt(Base):
    __tablename__ = 'ingredientesporplato_etl_ext'

    ingrediente_plato_ETL_EXT_id = Column(Integer, primary_key=True)
    ingrediente_plato_id = Column(Integer, nullable=False)
    plato_id = Column(Integer, nullable=False)
    producto_bodega_id = Column(Integer, nullable=False)
    peso_id = Column(Integer, server_default=text("'0'"))
    cantidad_necesaria = Column(DECIMAL(10, 2), server_default=text("'0.00'"))


class IngredientesporplatoEtlTra(Base):
    __tablename__ = 'ingredientesporplato_etl_tra'

    ingrediente_plato_ETL_TRA_id = Column(Integer, primary_key=True)
    plato_id = Column(Integer, nullable=False)
    producto_bodega_id = Column(Integer, nullable=False)
    cantidad_usada = Column(DECIMAL(10, 2), server_default=text("'0.00'"))


class PesoEtlExt(Base):
    __tablename__ = 'peso_etl_ext'

    peso_ETL_EXT_id = Column(Integer, primary_key=True)
    peso_id = Column(Integer, nullable=False)
    unidad = Column(VARCHAR(50), nullable=False)
    simbolo = Column(VARCHAR(50), nullable=False)
    tipo = Column(String(50))
    tipo_uso = Column(String(50))


class PesoEtlTra(Base):
    __tablename__ = 'peso_etl_tra'

    peso_ETL_TRA_id = Column(Integer, primary_key=True)
    peso_id = Column(Integer, nullable=False)
    unidad = Column(VARCHAR(50), nullable=False)
    simbolo = Column(VARCHAR(50), nullable=False)
    tipo = Column(String(50), nullable=False)
    tipo_uso = Column(String(50))


class PlatosEtlExt(Base):
    __tablename__ = 'platos_etl_ext'

    plato_ETL_EXT_id = Column(Integer, primary_key=True)
    plato_id = Column(Integer, nullable=False)
    nombre_plato = Column(VARCHAR(50), nullable=False)
    descripcion = Column(CHAR(70), nullable=False)
    precio = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    numero_platos = Column(Integer, server_default=text("'1'"))
    imagen = Column(VARCHAR(255))
    estado = Column(Enum('Disponible', 'No disponible'), server_default=text("'Disponible'"))


class PlatosEtlTra(Base):
    __tablename__ = 'platos_etl_tra'

    plato_ETL_TRA_id = Column(Integer, primary_key=True)
    plato_id = Column(Integer, nullable=False)
    nombre_plato = Column(VARCHAR(50), nullable=False)
    descripcion = Column(CHAR(70), nullable=False)
    precio = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    numero_platos = Column(Integer, server_default=text("'1'"))
    imagen = Column(VARCHAR(255))
    estado = Column(Enum('Disponible', 'No disponible'), server_default=text("'Disponible'"))


class ProductosbodegaEtlExt(Base):
    __tablename__ = 'productosbodega_etl_ext'

    producto_bodega_ETL_EXT_id = Column(Integer, primary_key=True)
    producto_bodega_id = Column(Integer, nullable=False)
    proveedor_id = Column(Integer, nullable=False)
    peso_proveedor_id = Column(Integer, nullable=False)
    nombre_producto = Column(VARCHAR(50), nullable=False)
    cantidad_actual = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    cantidad_maxima = Column(DECIMAL(10, 2), server_default=text("'0.00'"))
    tipo = Column(CHAR(10), nullable=False)
    precio_proveedor = Column(DECIMAL(6, 2), server_default=text("'0.00'"))


class ProductosbodegaEtlTra(Base):
    __tablename__ = 'productosbodega_etl_tra'

    productosBodega_ETL_TRA_id = Column(Integer, primary_key=True)
    producto_bodega_id = Column(Integer, nullable=False)
    nombre_producto = Column(VARCHAR(50), nullable=False)
    tipo = Column(CHAR(10), nullable=False)
    precio_proveedor = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    peso_proveedor_id = Column(Integer, nullable=False)


class VentasEtlExt(Base):
    __tablename__ = 'ventas_etl_ext'

    venta_ETL_EXT_id = Column(Integer, primary_key=True)
    venta_id = Column(Integer, nullable=False)
    plato_id = Column(Integer)
    cantidad = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    precio_unitario = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    precio_total = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    fecha_inicio_semana = Column(Date, nullable=False)
    fecha_fin_semana = Column(Date, nullable=False)


class VentasEtlTra(Base):
    __tablename__ = 'ventas_etl_tra'

    venta_ETL_TRA_id = Column(Integer, primary_key=True)
    venta_id = Column(Integer, nullable=False)
    plato_id = Column(Integer)
    fecha_id = Column(Integer, nullable=False)
    cantidad = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    precio_unitario = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
    precio_total = Column(DECIMAL(6, 2), server_default=text("'0.00'"))
