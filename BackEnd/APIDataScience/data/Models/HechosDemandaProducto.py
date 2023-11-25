from sqlalchemy import Column, Integer, DECIMAL, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class HechosDemandaProducto(Base):
    __tablename__ = 'HechosDemandaProducto'
    demanda_id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_id = Column(Integer)
    producto_id = Column(Integer)
    cantidad_predicha = Column(DECIMAL(10, 2), default=0)
    cantidad_real = Column(DECIMAL(10, 2), default=0)