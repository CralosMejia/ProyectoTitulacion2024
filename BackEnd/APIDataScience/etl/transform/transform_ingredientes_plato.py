import pandas as pd
from sqlalchemy import text



def transform_ingredientes_plato(ses_db_etls):
    """
        consolidates the quantity of each producto bodega needed for each plato
        
        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:

        # extract data of Facturas table and save on data frame
        ingrediente_plato_df = pd.read_sql('SELECT * FROM IngredientesPorPlato_ETL_EXT', con=ses_db_etls)
        peso_df = pd.read_sql('SELECT * FROM peso_ETL_EXT', con=ses_db_etls)

        # create new df where saved new data
        df_ingrediente_plato = pd.DataFrame()

        for index, row in ingrediente_plato_df.iterrows():
            plato_id = ingrediente_plato_df.at[index, "plato_id"]
            producto_bodega_id = ingrediente_plato_df.at[index, "producto_bodega_id"]
            peso_id = ingrediente_plato_df.at[index, "peso_id"]
            cantidad_necesaria = ingrediente_plato_df.at[index, "cantidad_necesaria"]



            df_ingrediente_plato = pd.concat([df_ingrediente_plato, pd.DataFrame([
                {
                    'plato_id': plato_id,
                    'producto_bodega_id': producto_bodega_id,
                    'peso_id':peso_id,
                    'cantidad_necesaria': cantidad_necesaria,
                }
            ])], ignore_index=True)

        # if doesn't exist data on table facturas complete
        if df_ingrediente_plato is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE ingredientesporplato_etl_tra'))
            df_ingrediente_plato.to_sql('ingredientesporplato_etl_tra', ses_db_etls, if_exists="append",
                                        index=False)
            print("Data saved on ingredientesPorPlato_ETL_TRA")

    except:
        raise TypeError("An error occurred in the tranformation of data from the Ingredente por plato  table.")
    finally:
        ses_db_etls.dispose()
