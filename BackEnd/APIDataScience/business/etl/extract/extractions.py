from business.etl.utils.etl_funtions import extract_load_function
import time


def run_extractions(ses_db_pacifico,ses_db_etls):
    """
    extracts all the information from each of the tables
    
    Args:
    ses_db_pacifico (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    """
    t0 = time.perf_counter()
    print("Start extractions")
    extract_load_function(ses_db_pacifico, ses_db_etls, "Platos", "platos_etl_ext")
    extract_load_function(ses_db_pacifico, ses_db_etls, "Facturas", "facturas_etl_ext")
    extract_load_function(ses_db_pacifico, ses_db_etls, "DetalleFactura", "detallefactura_etl_ext")
    extract_load_function(ses_db_pacifico, ses_db_etls, "IngredientesPorPlato", "ingredientesporplato_etl_ext")
    extract_load_function(ses_db_pacifico, ses_db_etls, "Peso", "peso_etl_ext")
    extract_load_function(ses_db_pacifico, ses_db_etls, "ProductosBodega", "productosbodega_etl_ext")
    t1 = time.perf_counter()
    print(f"End extractions in {t1 - t0} sec")




