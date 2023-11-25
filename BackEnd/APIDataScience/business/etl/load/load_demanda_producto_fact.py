import pandas as pd
from sqlalchemy.orm import sessionmaker

from data.Models.HechosDemandaProducto import HechosDemandaProducto
from business.etl.utils.etl_funtions import exists_row_in_df, get_value_in_df_by_list


def load_demanda_producto_facts(ses_db_etls,ses_db_data_science,table_name_extraction: str, table_name_load: str):
    """
    saves all etl plato information

    Args:
    ses_db_data_science (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    table_name_extraction (str): name of table source.
    table_name_load(str): name of table destiny.
    """
    try:
        Session = sessionmaker(bind=ses_db_data_science)
        session = Session()
        # extract data of Facturas table and save on data frame
        demanda_etl_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_etls)
        demanda_producto_fact_df = pd.read_sql(f'SELECT * FROM {table_name_load}', con=ses_db_data_science)
        # create new df where saved new data
        demanda_df = pd.DataFrame()

        for index, row in demanda_etl_df.iterrows():
            fecha_id = demanda_etl_df.at[index, "fecha_id"],
            producto_id = demanda_etl_df.at[index, "producto_id"]
            cantidad_total = demanda_etl_df.at[index, "cantidad_total"]

            values = [('fecha_id', fecha_id), ('producto_id', producto_id)]
            if not exists_row_in_df(demanda_producto_fact_df,values):
                demanda_df = pd.concat([demanda_df, pd.DataFrame([
                    {
                        'fecha_id': fecha_id,
                        'producto_id': producto_id,
                        'cantidad_real': cantidad_total,
                    }
                ])], ignore_index=True)
            elif get_value_in_df_by_list(demanda_producto_fact_df,'cantidad_real',values)==0:
                demanda_id = int(get_value_in_df_by_list(demanda_producto_fact_df,'demanda_id',values))
                registro_a_actualizar = session.query(HechosDemandaProducto).filter_by(demanda_id=demanda_id).first()
                registro_a_actualizar.cantidad_real = cantidad_total
                session.commit()


        # if doesn't exist data on table  complete
        if not demanda_df.empty:
            demanda_df.to_sql(table_name_load, ses_db_data_science, if_exists="append",
                                    index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(f"An error occurred in the load of data from the {table_name_load} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_data_science.dispose()