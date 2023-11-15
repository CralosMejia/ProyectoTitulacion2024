from .transfrom_facturas import transform_facturas
from .transform_producto_bodega import transform_producto_bodega
from .transform_ingredientes_plato import transform_ingredientes_plato
from .transform_fecha_facturas import transform_fechas_facturas
from .transform_platos import transform_platos
from .transform_peso import transform_peso
from .transform_demanda import transform_demanda


import time


def run_transformations(ses_db_etls):
    """
    Transforms all necessary information
    
    Args:
    ses_db_pacifico (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    """
    t0 = time.perf_counter()
    print("Start transformations")

    transform_fechas_facturas(ses_db_etls)
    transform_facturas(ses_db_etls)
    transform_platos(ses_db_etls)
    transform_peso(ses_db_etls)
    transform_ingredientes_plato(ses_db_etls)
    transform_producto_bodega(ses_db_etls)
    transform_demanda(ses_db_etls)


    t1 = time.perf_counter()
    print(f"End transformations in {t1 - t0} sec")