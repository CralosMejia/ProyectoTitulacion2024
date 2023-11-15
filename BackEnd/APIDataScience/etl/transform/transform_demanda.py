import pandas as pd
from sqlalchemy import text



def transform_demanda(ses_db_etls):
    """
        stores the total quantity of each product on each date

        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:

        # extract data of Facturas table and save on data frame
        df_facturas = pd.read_sql(f'SELECT * FROM facturas_completa_ETL_TRA', con=ses_db_etls)
        df_ingredientes_por_plato = pd.read_sql(f'SELECT * FROM IngredientesPorPlato_ETL_TRA', con=ses_db_etls)

        # create new df where saved new data
        df_cantidad_total_por_fecha = pd.DataFrame()


        for index, factura in df_facturas.iterrows():
            # Obtener la fecha de la factura
            cantidad_total=0
            fecha_id = factura['fecha_id']
            unidades_vendidas = factura['unidades_vendidas']


            # Encontrar los ingredientes por plato para esta factura
            ingredientes = df_ingredientes_por_plato[df_ingredientes_por_plato['plato_id'] == factura['plato_id']]

            # Iterar sobre cada ingrediente
            for index, ingrediente in ingredientes.iterrows():
                # Obtener el ID del producto de bodega
                producto_id = ingrediente['producto_bodega_id']
                cantidad_necesaria = ingrediente['cantidad_necesaria']
                cantidad_total = cantidad_total+(cantidad_necesaria* unidades_vendidas)

                df_cantidad_total_por_fecha = pd.concat([df_cantidad_total_por_fecha, pd.DataFrame([
                    {
                        'fecha_id': fecha_id,
                        'producto_id': producto_id,
                        'cantidad_total': cantidad_total
                    }
                ])], ignore_index=True)

        # if doesn't exist data on table facturas complete
        if df_cantidad_total_por_fecha is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE demanda_etl_tra'))
            df_cantidad_total_por_fecha.to_sql('demanda_etl_tra', ses_db_etls, if_exists="append",
                                        index=False)
            print("Data saved on Demanda_ETL_TRA")

    except:
        raise TypeError("An error occurred in the tranformation of data from the  Demanda_ETL_TRA table.")
    finally:
        ses_db_etls.dispose()
