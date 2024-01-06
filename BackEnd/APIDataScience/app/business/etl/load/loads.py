from datetime import datetime

import pandas as pd
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.business.etl.utils.etl_funtions import exists_row_in_df, get_value_in_df_by_list, exists_date_in_df, \
    exists_value_in_df_by_column
from app.data.Models.DataScienceDBModels import Hechosdemandaproducto, Dimfecha


def load_demanda_producto_facts(ses_db_etls: Session, ses_db_data_science: Session, table_name_extraction: str, table_name_load: str):
    """
    Saves all ETL plato information.

    Args:
    ses_db_data_science (Session): Session for the Data Science database.
    ses_db_etls (Session): Session for the ETL database.
    table_name_extraction (str): Name of table source.
    table_name_load(str): Name of table destiny.
    """
    try:
        # Extract data from the table and save in a DataFrame
        demanda_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls.bind)
        demanda_producto_fact_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science.bind)

        # Create new DataFrame for the new data
        demanda_df = pd.DataFrame()

        for index, row in demanda_etl_df.iterrows():
            fecha_id = row["fecha_id"]
            producto_id = row["producto_id"]
            cantidad_total = row["cantidad_total"]

            values = [('fecha_id', fecha_id), ('producto_id', producto_id)]
            if not exists_row_in_df(demanda_producto_fact_df, values):
                demanda_df = pd.concat([demanda_df, pd.DataFrame([{
                    'fecha_id': fecha_id,
                    'producto_id': producto_id,
                    'cantidad_real': cantidad_total
                }])], ignore_index=True)
            elif get_value_in_df_by_list(demanda_producto_fact_df, 'cantidad_real', values) == 0:
                demanda_id = int(get_value_in_df_by_list(demanda_producto_fact_df, 'demanda_id', values))
                registro_a_actualizar = ses_db_data_science.query(Hechosdemandaproducto).filter_by(demanda_id=demanda_id).first()
                registro_a_actualizar.cantidad_real = cantidad_total
                ses_db_data_science.commit()

        # If the DataFrame is not empty, append data to the table
        if not demanda_df.empty:
            demanda_df.to_sql(table_name_load, ses_db_data_science.bind, if_exists="append", index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. Error: {e}")

def load_fecha_dim(ses_db_etls: Session, ses_db_data_science: Session, table_name_extraction: str, table_name_load: str):
    """
    Saves all ETL date information.

    Args:
    ses_db_data_science (Session): Session for the Data Science database.
    ses_db_etls (Session): Session for the ETL database.
    table_name_extraction (str): Name of table source.
    table_name_load(str): Name of table destiny.
    """
    try:
        # Extract data from the table and save in a DataFrame
        fecha_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls.bind)
        fecha_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science.bind)

        # Create new DataFrame for the new data
        fecha_df = pd.DataFrame()

        # Obtener el ID máximo actual
        #max_fecha_id = ses_db_data_science.query(func.max(Dimfecha.fecha_id)).scalar() or 0

        for index, row in fecha_etl_df.iterrows():
            fecha_id = row["fecha_ETL_TRA_id"]
            fecha = str(row["fecha"]).split('/')[0]
            semana = row["semana"]
            mes = row["mes"]
            anio = row["anio"]

            if not exists_date_in_df(fecha, fecha_dim_df):
                if not exists_date_in_df(fecha, fecha_df):

                    #max_fecha_id += 1  # Incrementar el ID
                    fecha_df = pd.concat([fecha_df, pd.DataFrame([{
                        'fecha_id': fecha_id,
                        'fecha': datetime.strptime(fecha, "%Y-%m-%d").date(),
                        'semana': semana,
                        'mes': mes,
                        'anio': anio,
                    }])], ignore_index=True)

        # If the DataFrame is not empty, append data to the table
        if not fecha_df.empty:
            fecha_df.to_sql(table_name_load, ses_db_data_science.bind, if_exists="append", index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. Error: {e}")

def load_plato_dim(ses_db_etls: Session, ses_db_data_science: Session, table_name_extraction: str, table_name_load: str):
    """
    Saves all ETL plato information.

    Args:
    ses_db_data_science (Session): Session for the Data Science database.
    ses_db_etls (Session): Session for the ETL database.
    table_name_extraction (str): Name of table source.
    table_name_load(str): Name of table destiny.
    """
    try:
        # Extract data from the table and save in a DataFrame
        plato_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls.bind)
        plato_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science.bind)

        # Create new DataFrame for the new data
        plato_df = pd.DataFrame()

        for index, row in plato_etl_df.iterrows():
            plato_id = row["plato_id"]
            nombre_plato = row["nombre_plato"]
            descripcion = row["descripcion"]
            precio = row["precio"]

            if not exists_value_in_df_by_column('plato_id', plato_id, plato_dim_df):
                plato_df = pd.concat([plato_df, pd.DataFrame([{
                    'plato_id': plato_id,
                    'nombre_plato': nombre_plato,
                    'descripcion': descripcion,
                    'precio': precio
                }])], ignore_index=True)

        # If the DataFrame is not empty, append data to the table
        if not plato_df.empty:
            plato_df.to_sql(table_name_load, ses_db_data_science.bind, if_exists="append", index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. Error: {e}")

def load_producto_dim(ses_db_etls:Session,ses_db_data_science:Session,table_name_extraction: str, table_name_load: str):
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
        producto_bodega_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls.bind)
        producto_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science.bind)
        # create new df where saved new data
        producto_df = pd.DataFrame()

        for index, row in producto_bodega_etl_df.iterrows():
            producto_bodega_id = producto_bodega_etl_df.at[index, "producto_bodega_id"],
            peso_id = producto_bodega_etl_df.at[index, "peso_proveedor_id"],
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
            producto_df.to_sql(table_name_load, ses_db_data_science.bind, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")

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
        peso_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls.bind)
        unidad_medida_dim_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science.bind)
        # create new df where saved new data
        peso_df = pd.DataFrame()

        for index, row in peso_etl_df.iterrows():
            peso_id = peso_etl_df.at[index, "peso_id"],
            unidad = peso_etl_df.at[index, "unidad"],
            simbolo = peso_etl_df.at[index, "simbolo"]
            tipo = peso_etl_df.at[index, "tipo"]


            if not exists_value_in_df_by_column('unidad_medida_id',peso_id, unidad_medida_dim_df):
                peso_df = pd.concat([peso_df, pd.DataFrame([
                    {
                        'unidad_medida_id': peso_id,
                        'unidad': unidad,
                        'simbolo': simbolo,
                        'tipo': tipo
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if peso_df is not None:
            # ses_db_etls.connect().execute(text(f'TRUNCATE TABLE {table_name_load}'))
            peso_df.to_sql(table_name_load, ses_db_data_science.bind, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")

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
        ventas_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls.bind)
        ventas_plato_fact_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science.bind)
        # create new df where saved new data
        ventas_platos_df = pd.DataFrame()

        for index, row in ventas_etl_df.iterrows():
            venta_id = ventas_etl_df.at[index, "venta_id"],
            fecha_id = ventas_etl_df.at[index, "fecha_id"],
            plato_id = ventas_etl_df.at[index, "plato_id"]
            cantidad = ventas_etl_df.at[index, "cantidad"]
            precio_total = ventas_etl_df.at[index, "precio_total"]

            values = [('venta_id', venta_id), ('fecha_id', fecha_id), ('plato_id', plato_id)]
            if not exists_row_in_df(ventas_plato_fact_df,values):
                ventas_platos_df = pd.concat([ventas_platos_df, pd.DataFrame([
                    {
                        'venta_id': venta_id,
                        'fecha_id': fecha_id,
                        'plato_id': plato_id,
                        'unidades_vendidas': cantidad,
                        'precio_total': precio_total
                    }
                ])], ignore_index=True)
        # if doesn't exist data on table facturas complete
        if ventas_platos_df is not None:
            ventas_platos_df.to_sql(table_name_load, ses_db_data_science.bind, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
