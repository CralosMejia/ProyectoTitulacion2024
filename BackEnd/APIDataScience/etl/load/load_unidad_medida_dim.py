import pandas as pd
from etl.utils.etl_funtions import  exists_value_in_df_by_column


def load_unidad_medida_dim(ses_db_etls,ses_db_data_science,table_name_extraction: str, table_name_load: str):
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
        peso_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)
        unidad_medida_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science)
        # create new df where saved new data
        peso_df = pd.DataFrame()

        for index, row in peso_etl_df.iterrows():
            peso_id = peso_etl_df.at[index, "peso_id"],
            unidad = peso_etl_df.at[index, "unidad"],
            simbolo = peso_etl_df.at[index, "simbolo"]

            if not exists_value_in_df_by_column('unidad_medida_id',peso_id, unidad_medida_dim_df):
                peso_df = pd.concat([peso_df, pd.DataFrame([
                    {
                        'unidad_medida_id': peso_id,
                        'unidad': unidad,
                        'simbolo': simbolo
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if peso_df is not None:
            # ses_db_etls.connect().execute(text(f'TRUNCATE TABLE {table_name_load}'))
            peso_df.to_sql(table_name_load, ses_db_data_science, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_data_science.dispose()