# import traceback
import pandas as pd
from sqlalchemy import text

from business.etl.utils.transformations_funtions import find_factura_date, get_id_by_date, find_factura_monto_total


def transform_facturas(ses_db_etls):
    """
        consolidates all factura and detalle factura information
        
        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:

        # extract data of Facturas table and save on data frame
        facturas_df = pd.read_sql('SELECT * FROM Facturas_ETL_EXT', con=ses_db_etls)
        detalle_facturas_df = pd.read_sql('SELECT * FROM DetalleFactura_ETL_EXT', con=ses_db_etls)
        fechas_df = pd.read_sql('SELECT * FROM FechaFactura_ETL_TRA', con=ses_db_etls)

        # create new df where saved new data
        df_facturas_complete = pd.DataFrame()

        for index, row in detalle_facturas_df.iterrows():
            plato_id = detalle_facturas_df.at[index, "plato_id"]
            cantidad = detalle_facturas_df.at[index, "cantidad"]
            factura_id = detalle_facturas_df.at[index, "factura_id"]

            monto_total = find_factura_monto_total(factura_id, facturas_df)
            date_factura = find_factura_date(factura_id, facturas_df)
            fecha_id = get_id_by_date(date_factura, fechas_df)

            df_facturas_complete = pd.concat([df_facturas_complete, pd.DataFrame([
                {
                    'factura_id':factura_id,
                    'fecha_id': fecha_id,
                    'plato_id': plato_id,
                    'unidades_vendidas': cantidad,
                    'monto_total': monto_total
                }
            ])], ignore_index=True)

        # if doesn't exist data on table facturas complete
        if df_facturas_complete is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE facturas_completa_etl_tra'))
            df_facturas_complete.to_sql('facturas_completa_etl_tra', ses_db_etls, if_exists="append", index=False)
            print("Data saved on Facturas_completa_ETL_TRA")

    except:
        raise TypeError("An error occurred in the tranformation of data from the Facturas completa table.")
    finally:
        ses_db_etls.dispose()
