# import traceback
import pandas as pd
from sqlalchemy import text


def transform_peso(ses_db_etls):
    """
        saves all the plates

        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:

        # extract data of Facturas table and save on data frame
        peso_ext_df = pd.read_sql('SELECT * FROM Peso_ETL_EXT', con=ses_db_etls)

        # create new df where saved new data
        peso_tra_df = pd.DataFrame()

        for index, row in peso_ext_df.iterrows():
            peso_id = peso_ext_df.at[index, "peso_id"],
            unidad = peso_ext_df.at[index, "unidad"],
            simbolo = peso_ext_df.at[index, "simbolo"]


            peso_tra_df = pd.concat([peso_tra_df, pd.DataFrame([
                {
                    'peso_id': peso_id,
                    'unidad': unidad,
                    'simbolo': simbolo
                }
            ])], ignore_index=True)

        # if doesn't exist data on table facturas complete
        if peso_tra_df is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE peso_etl_tra'))
            peso_tra_df.to_sql('peso_etl_tra', ses_db_etls, if_exists="append",
                                        index=False)
            print("Data saved on Peso_ETL_TRA")

    except:
        raise TypeError("An error occurred in the tranformation of data from the peso table.")
    finally:
        ses_db_etls.dispose()
