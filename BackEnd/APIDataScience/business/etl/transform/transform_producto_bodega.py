# import traceback
import pandas as pd
from sqlalchemy import text



def transform_producto_bodega(ses_db_etls):
    """
        consolidates the producto bodega information and the peso.
        
        Args:
        ses_db_etls (connection): connection on DB.
    """
    try:


        #extract data of Facturas table and save on data frame
        producto_bodega_df =pd.read_sql('SELECT * FROM productosbodega_ETL_EXT', con=ses_db_etls)
        #create new df where saved new data
        df_producto_bodega = pd.DataFrame()

        for index, row in producto_bodega_df.iterrows():

            producto_bodega_id = producto_bodega_df.at[index, "producto_bodega_id"]
            nombre = producto_bodega_df.at[index, "nombre_producto"]
            tipo = producto_bodega_df.at[index, "tipo"]
            peso_id = producto_bodega_df.at[index, "peso_id"]
            precio_proveedor = producto_bodega_df.at[index, "precio_proveedor"]



            df_producto_bodega = pd.concat([df_producto_bodega,pd.DataFrame([
                {
                    'producto_bodega_id': producto_bodega_id,
                    'nombre_producto': nombre,
                    'tipo': tipo,
                    'peso_id': peso_id,
                    'precio_proveedor': precio_proveedor
                }
            ]) ],ignore_index=True)



        #if doesn't exist data on table facturas complete
        if df_producto_bodega is not None:
            ses_db_etls.connect().execute(text('TRUNCATE TABLE productosbodega_etl_tra'))
            df_producto_bodega.to_sql('productosbodega_etl_tra',ses_db_etls,if_exists="append",index=False)
            print("Data saved on ProductosBodega_ETL_TRA")
        
    except:
        raise TypeError("An error occurred in the tranformation of data from the Producto Bodega  table.")
    finally:
        ses_db_etls.dispose()

