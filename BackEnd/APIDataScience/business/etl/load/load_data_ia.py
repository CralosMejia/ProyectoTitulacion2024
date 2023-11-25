# import traceback
import pandas as pd
from sqlalchemy import text

def load_data_ia(ses_db_pacifico,ses_db_etls,table_name_extraction:str,table_name_load:str):
    """
    uploads all the transformed information to the database from which the information to train the ia model will be extracted.
    
    Args:
    ses_db_pacifico (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    table_name_extraction (str): name of table source.
    table_name_load(str): name of table destiny.
    """
    try:

        #extract data of table and save on data frame
        table_extract_df =pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)

        #create new df where saved new data
        df_datos_entrenamiento_ia = pd.DataFrame()

        for index, row in table_extract_df.iterrows():
            fecha = table_extract_df.at[index, "fecha"]
            producto_bodega_id = table_extract_df.at[index, "producto_bodega_id"]
            cantidad_total = table_extract_df.at[index, "cantidad_total"]
            simbolo_proveedor = table_extract_df.at[index, "simbolo_proveedor"]
            simbolo_preparacion = table_extract_df.at[index, "simbolo_preparacion"]

            df_datos_entrenamiento_ia = pd.concat([df_datos_entrenamiento_ia,pd.DataFrame([
                {
                    'fecha': fecha,
                    'producto_bodega_id': producto_bodega_id,
                    'cantidad_total': cantidad_total,
                    'simbolo_proveedor': simbolo_proveedor,
                    'simbolo_preparacion': simbolo_preparacion

                }
            ]) ],ignore_index=True)




        #if doesn't exist data on table  
        if not df_datos_entrenamiento_ia.empty:
            ses_db_pacifico.connect().execute(text(f'TRUNCATE TABLE {table_name_load}'))
            df_datos_entrenamiento_ia.to_sql(table_name_load,ses_db_pacifico,if_exists="append",index=False)
            print(f"Data saved on {table_name_load}")
        
    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_extraction} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_pacifico.dispose()