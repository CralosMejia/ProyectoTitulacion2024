# import traceback
import pandas as pd
from sqlalchemy import text

from etl.utils.transformations_funtions import find_peso_unidad, find_peso_simbolo


def transform_platos(ses_db_etls):
    """
        saves all the plates

        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:

        # extract data of Facturas table and save on data frame
        plato_ext_df = pd.read_sql('SELECT * FROM Platos_ETL_EXT', con=ses_db_etls)

        # create new df where saved new data
        plato_tra_df = pd.DataFrame()

        for index, row in plato_ext_df.iterrows():
            plato_id = plato_ext_df.at[index, "plato_id"],
            nombre_plato = plato_ext_df.at[index, "nombre_plato"],
            descripcion = plato_ext_df.at[index, "descripcion"],
            precio = plato_ext_df.at[index, "precio"],
            imagen = plato_ext_df.at[index, "imagen"],


            plato_tra_df = pd.concat([plato_tra_df, pd.DataFrame([
                {
                    'plato_id': plato_id,
                    'nombre_plato': nombre_plato,
                    'descripcion': descripcion,
                    'precio': precio,
                    'imagen': imagen,
                }
            ])], ignore_index=True)

        # if doesn't exist data on table facturas complete
        if plato_tra_df is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE platos_etl_tra'))
            plato_tra_df.to_sql('platos_etl_tra', ses_db_etls, if_exists="append",
                                        index=False)
            print("Data saved on Platos_ETL_TRA")

    except:
        raise TypeError("An error occurred in the tranformation of data from the platos table.")
    finally:
        ses_db_etls.dispose()
