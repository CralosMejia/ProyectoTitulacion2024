import pandas as pd

from business.etl.utils.etl_funtions import exists_value_in_df_by_column


def load_producto_dim(ses_db_etls,ses_db_data_science,table_name_extraction: str, table_name_load: str):
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
        producto_bodega_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)
        producto_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science)
        # create new df where saved new data
        producto_df = pd.DataFrame()

        for index, row in producto_bodega_etl_df.iterrows():
            producto_bodega_id = producto_bodega_etl_df.at[index, "producto_bodega_id"],
            peso_id = producto_bodega_etl_df.at[index, "peso_id"],
            nombre_producto = producto_bodega_etl_df.at[index, "nombre_producto"]
            tipo = producto_bodega_etl_df.at[index, "tipo"]
            precio_proveedor = producto_bodega_etl_df.at[index, "precio_proveedor"]


            if not exists_value_in_df_by_column('producto_id',producto_bodega_id, producto_dim_df):
                producto_df = pd.concat([producto_df, pd.DataFrame([
                    {
                        'producto_id': producto_bodega_id,
                        'unidad_medida_id': peso_id,
                        'nombre_producto': nombre_producto,
                        'tipo_producto': tipo,
                        'precio_proveedor': precio_proveedor
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if producto_df is not None:
            producto_df.to_sql(table_name_load, ses_db_data_science, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_data_science.dispose()