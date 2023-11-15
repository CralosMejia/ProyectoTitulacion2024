import pandas as pd

from etl.utils.etl_funtions import exists_row_in_df


def load_venta_platos_facts(ses_db_etls,ses_db_data_science,table_name_extraction: str, table_name_load: str):
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
        factura_completa_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)
        ventas_plato_fact_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science)
        # create new df where saved new data
        ventas_platos_df = pd.DataFrame()

        for index, row in factura_completa_etl_df.iterrows():
            factura_id = factura_completa_etl_df.at[index, "factura_id"],
            fecha_id = factura_completa_etl_df.at[index, "fecha_id"],
            plato_id = factura_completa_etl_df.at[index, "plato_id"]
            unidades_vendidas = factura_completa_etl_df.at[index, "unidades_vendidas"]
            monto_total = factura_completa_etl_df.at[index, "monto_total"]

            values = [('factura_id', factura_id), ('fecha_id', fecha_id), ('plato_id', plato_id)]
            if not exists_row_in_df(ventas_plato_fact_df,values):
                ventas_platos_df = pd.concat([ventas_platos_df, pd.DataFrame([
                    {
                        'factura_id': factura_id,
                        'fecha_id': fecha_id,
                        'plato_id': plato_id,
                        'unidades_vendidas': unidades_vendidas,
                        'precio_total': monto_total
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if ventas_platos_df is not None:
            ventas_platos_df.to_sql(table_name_load, ses_db_data_science, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_data_science.dispose()