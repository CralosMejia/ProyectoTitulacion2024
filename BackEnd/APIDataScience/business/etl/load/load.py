import time
from .load_data_ia import load_data_ia
from .load_fecha_dim import load_fecha_dim
from .load_plato_dim import load_plato_dim
from .load_unidad_medida_dim import load_unidad_medida_dim
from .load_producto_dim import load_producto_dim
from .load_venta_platos_fact import load_venta_platos_facts
from .load_demanda_producto_fact import load_demanda_producto_facts




def run_loads(ses_db_etls,ses_db_data_science):
    """
    load all data necesary to train the model
    
    Args:
    ses_db_pacifico (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    """
    t0 = time.perf_counter()
    print("Start load")

    # load_data_ia(ses_db_pacifico,ses_db_etls,'ia_etl_mpd_tra','datosentrenamientoia')
    load_fecha_dim(ses_db_etls,ses_db_data_science,'fechafactura_etl_tra','dimfecha')
    load_plato_dim(ses_db_etls,ses_db_data_science,'platos_etl_tra','dimplato')
    load_unidad_medida_dim(ses_db_etls,ses_db_data_science,'peso_etl_tra','dimunidadmedida')
    load_producto_dim(ses_db_etls,ses_db_data_science,'productosbodega_etl_tra','dimproducto')
    load_venta_platos_facts(ses_db_etls, ses_db_data_science, 'facturas_completa_etl_tra', 'hechosventaplatos')
    load_demanda_producto_facts(ses_db_etls, ses_db_data_science, 'demanda_etl_tra', 'hechosdemandaproducto')

    t1 = time.perf_counter()
    print(f"End load in {t1 - t0} sec")