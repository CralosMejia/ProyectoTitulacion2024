from business.etl.extract.extractions import run_extractions
from business.etl.transform.transformations import run_transformations
from business.etl.load.load import run_loads
from config.properties import getProperty
from data.DB import connect


name_DB_ETLS = getProperty('DATABASEETLS')
name_DB_PACIFICO = getProperty('DATABASESOURCENAME')
name_DB_DATASCIENCE = getProperty('DATABASEDSC')

ses_db_etls = connect(name_DB_ETLS)
ses_db_pacifico = connect(name_DB_PACIFICO)
ses_db_data_science = connect(name_DB_DATASCIENCE)

def run_etl():
    """
    consolidates each of the activities of the etl

    """
    try:

        run_extractions(ses_db_pacifico,ses_db_etls)
        run_transformations(ses_db_etls)
        run_loads(ses_db_etls,ses_db_data_science)
    
    except ValueError as e:
        raise TypeError(f"An error occurred while trying to run ETL of Demand prediction module. ERROR: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_pacifico.dispose()
        ses_db_data_science.dispose()