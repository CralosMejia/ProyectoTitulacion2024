# import traceback
import pandas as pd
from sqlalchemy import text



def transform_fechas_facturas(ses_db_etls):
    """
        extracts the date and splits each of its components

        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:

        # extract data of Facturas table and save on data frame
        factura_df = pd.read_sql('SELECT * FROM Facturas_ETL_EXT', con=ses_db_etls)
        factura_df['fecha'] = pd.to_datetime(factura_df['fecha'])

        # create new df where saved new data
        fecha_set = set()
        df_fecha_factura = []

        for index, row in factura_df.iterrows():

            fecha = row['fecha']
            # Verificar si la fecha ya existe en el conjunto
            if fecha not in fecha_set:
                fecha_set.add(fecha)
                df_fecha_factura.append({
                    'fecha': fecha,
                    'dia': fecha.day,
                    'mes': fecha.month,
                    'anio': fecha.year,
                    'semana': fecha.week,
                    'dia_semana': fecha.dayofweek
                })

            # Crear el DataFrame a partir de la lista de diccionarios
        df_fecha_factura = pd.DataFrame(df_fecha_factura)

        # if doesn't exist data on table facturas complete
        if df_fecha_factura is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE fechafactura_etl_tra'))
            df_fecha_factura.to_sql('fechafactura_etl_tra', ses_db_etls, if_exists="append",
                                        index=False)
            print("Data saved on FechaFactura_ETL_TRA")

    except:
        raise TypeError("An error occurred in the tranformation of data from the  FechaFactura_ETL_TRA table.")
    finally:
        ses_db_etls.dispose()
