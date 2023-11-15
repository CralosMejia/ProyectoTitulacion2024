import pandas as pd
from etl.utils.etl_funtions import exists_value_in_df_by_column


def load_plato_dim(ses_db_etls,ses_db_data_science,table_name_extraction: str, table_name_load: str):
    """
    saves all etl plato information

    Args:
    ses_db_data_science (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    table_name_extraction (str): name of table source.
    table_name_load(str): name of table destiny.
    """
    try:
        # extract data of Facturas table and save on data frame
        plato_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)
        plato_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science)
        # create new df where saved new data
        plato_df = pd.DataFrame()

        for index, row in plato_etl_df.iterrows():
            plato_id = plato_etl_df.at[index, "plato_id"],
            nombre_plato = plato_etl_df.at[index, "nombre_plato"],
            descripcion = plato_etl_df.at[index, "descripcion"],
            precio = plato_etl_df.at[index, "precio"]

            if not exists_value_in_df_by_column('plato_id',plato_id, plato_dim_df):
                plato_df = pd.concat([plato_df, pd.DataFrame([
                    {
                        'plato_id': plato_id,
                        'nombre_plato': nombre_plato,
                        'descripcion': descripcion,
                        'precio': precio
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if plato_df is not None:
            # ses_db_etls.connect().execute(text(f'TRUNCATE TABLE {table_name_load}'))
            plato_df.to_sql(table_name_load, ses_db_data_science, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_data_science.dispose()