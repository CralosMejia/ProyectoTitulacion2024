import pandas as pd
from business.etl.utils.etl_funtions import exists_date_in_df


def load_fecha_dim(ses_db_etls,ses_db_data_science,table_name_extraction: str, table_name_load: str):
    """
    saves all etl date information

    Args:
    ses_db_data_science (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    table_name_extraction (str): name of table source.
    table_name_load(str): name of table destiny.
    """
    try:
        # extract data of Facturas table and save on data frame
        fecha_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)
        fecha_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science)
        # create new df where saved new data
        fecha_df = pd.DataFrame()

        for index, row in fecha_etl_df.iterrows():
            fecha_id = fecha_etl_df.at[index, "fecha_factura_ETL_TRA_id"],
            fecha = fecha_etl_df.at[index, "fecha"],
            dia = fecha_etl_df.at[index, "dia"],
            semana = fecha_etl_df.at[index, "semana"],
            mes = fecha_etl_df.at[index, "mes"],
            anio = fecha_etl_df.at[index, "anio"],
            dia_semana = fecha_etl_df.at[index, "dia_semana"],

            if not exists_date_in_df(fecha, fecha_dim_df):
                fecha_df = pd.concat([fecha_df, pd.DataFrame([
                    {
                        'fecha_id': fecha_id,
                        'fecha': fecha,
                        'dia': dia,
                        'semana': semana,
                        'mes': mes,
                        'anio': anio,
                        'dia_semana': dia_semana
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if fecha_df is not None:
            # ses_db_etls.connect().execute(text(f'TRUNCATE TABLE {table_name_load}'))
            fecha_df.to_sql(table_name_load, ses_db_data_science, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_data_science.dispose()