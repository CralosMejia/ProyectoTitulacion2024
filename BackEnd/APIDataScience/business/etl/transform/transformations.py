import pandas as pd
from sqlalchemy import text
from sqlalchemy.orm import Session

from business.etl.utils.etl_funtions import find_peso_id_by_ingredienteid, find_value_by_two_ids, get_id_by_dates, \
    exists_row_in_df, get_value_in_df_by_list, update_value_by_filters, exists_date_in_df


def transform_demanda(ses_db_etls: Session):
    """
    Stores the total quantity of each product on each date.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de las tablas Ventas_ETL_TRA y IngredientesPorPlato_ETL_TRA
        df_ventas = pd.read_sql('SELECT * FROM Ventas_ETL_TRA', con=engine_etls)
        df_ingredientes_por_plato = pd.read_sql('SELECT * FROM IngredientesPorPlato_ETL_TRA', con=engine_etls)


        # Crear nuevo DataFrame para almacenar los resultados
        df_cantidad_total_por_fecha = pd.DataFrame()

        # Procesar cada venta
        for index, venta in df_ventas.iterrows():
            fecha_id = venta['fecha_id']
            cantidad_total = 0
            cantidad = venta['cantidad']

            # Encontrar ingredientes para el plato actual
            ingredientes = df_ingredientes_por_plato[df_ingredientes_por_plato['plato_id'] == venta['plato_id']]

            # Calcular la cantidad total para cada ingrediente
            for index, ingrediente in ingredientes.iterrows():
                producto_id = ingrediente['producto_bodega_id']
                cantidad_usada = ingrediente['cantidad_usada']
                cantidad_total = cantidad_usada * cantidad

                values = [('fecha_id', fecha_id), ('producto_id', producto_id)]
                if not exists_row_in_df(df_cantidad_total_por_fecha, values):
                    df_cantidad_total_por_fecha = pd.concat([
                        df_cantidad_total_por_fecha,
                        pd.DataFrame([{
                            'fecha_id': fecha_id,
                            'producto_id': producto_id,
                            'cantidad_total': cantidad_total
                        }])
                    ], ignore_index=True)
                else:
                    exist_cantidad_total= get_value_in_df_by_list(df_cantidad_total_por_fecha, 'cantidad_total', values)
                    cantidad_total = cantidad_total + exist_cantidad_total;
                    update_value_by_filters(df_cantidad_total_por_fecha,values,'cantidad_total',exist_cantidad_total)



        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not df_cantidad_total_por_fecha.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE demanda_etl_tra'))
            df_cantidad_total_por_fecha.to_sql('demanda_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on Demanda_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the Demanda_ETL_TRA table. Error: {e}")


def transform_fechas_ventas(ses_db_etls: Session):
    """
    Extracts the date and splits each of its components.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de la tabla Ventas_ETL_EXT y guardar en un DataFrame
        ventas_df = pd.read_sql('SELECT * FROM Ventas_ETL_EXT', con=engine_etls)
        ventas_df['fecha_inicio_semana_date'] = pd.to_datetime(ventas_df['fecha_inicio_semana'])


        df_fecha_ventas = pd.DataFrame()
        fechas_procesadas = set()

        for index, row in ventas_df.iterrows():
            fechaInicio = row['fecha_inicio_semana_date']
            fechaInicioStr = row['fecha_inicio_semana']

            # Verificar si la fecha ya existe en el conjunto
            if fechaInicioStr not in fechas_procesadas:
                df_fecha_ventas = pd.concat([df_fecha_ventas, pd.DataFrame([{
                    'fecha': fechaInicioStr,
                    'mes': fechaInicio.month,
                    'anio': fechaInicio.year,
                    'semana': fechaInicio.week
                }])], ignore_index=True)
                fechas_procesadas.add(fechaInicioStr)

        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not df_fecha_ventas.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE fecha_etl_tra'))
            df_fecha_ventas.to_sql('fecha_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on Fecha_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the Fecha_ETL_TRA table. Error: {e}")


def transform_ingredientes_plato(ses_db_etls: Session):
    """
    Consolidates the quantity of each producto bodega needed for each plato.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de las tablas relevantes y guardar en DataFrames
        ingrediente_plato_df = pd.read_sql('SELECT * FROM IngredientesPorPlato_ETL_EXT', con=engine_etls)
        conversion_peso_df = pd.read_sql('SELECT * FROM ConversionPeso_ETL_EXT', con=engine_etls)
        producto_bodega_df = pd.read_sql('SELECT * FROM ProductosBodega_ETL_EXT', con=engine_etls)

        # Crear nuevo DataFrame para almacenar los resultados
        df_ingrediente_plato = pd.DataFrame()

        for index, row in ingrediente_plato_df.iterrows():
            plato_id = row["plato_id"]
            producto_bodega_id = row["producto_bodega_id"]
            peso_id = row["peso_id"]
            cantidad_necesaria_preparacion = row["cantidad_necesaria"]

            peso_proveedor_id = find_peso_id_by_ingredienteid(producto_bodega_id, producto_bodega_df)

            factor_conversion = find_value_by_two_ids(peso_id, "peso_id_origen", peso_proveedor_id, "peso_id_destino", "factor_conversion", conversion_peso_df)
            cantidad_usada = cantidad_necesaria_preparacion * factor_conversion

            df_ingrediente_plato = pd.concat([df_ingrediente_plato, pd.DataFrame([{
                'plato_id': plato_id,
                'producto_bodega_id': producto_bodega_id,
                'cantidad_usada': cantidad_usada
            }])], ignore_index=True)

        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not df_ingrediente_plato.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE ingredientesporplato_etl_tra'))
            df_ingrediente_plato.to_sql('ingredientesporplato_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on ingredientesPorPlato_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the Ingrediente por Plato table. Error: {e}")


def transform_peso(ses_db_etls: Session):
    """
    Saves all the plates.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de la tabla Peso_ETL_EXT y guardar en un DataFrame
        peso_ext_df = pd.read_sql('SELECT * FROM Peso_ETL_EXT', con=engine_etls)

        # Crear nuevo DataFrame para almacenar los resultados
        peso_tra_df = pd.DataFrame()

        for index, row in peso_ext_df.iterrows():
            peso_tra_df = pd.concat([peso_tra_df, pd.DataFrame([{
                'peso_id': row["peso_id"],
                'unidad': row["unidad"],
                'simbolo': row["simbolo"],
                'tipo': row["tipo"]
            }])], ignore_index=True)

        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not peso_tra_df.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE peso_etl_tra'))
            peso_tra_df.to_sql('peso_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on Peso_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the peso table. Error: {e}")


def transform_platos(ses_db_etls: Session):
    """
    Saves all the plates.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de la tabla Platos_ETL_EXT y guardar en un DataFrame
        plato_ext_df = pd.read_sql('SELECT * FROM Platos_ETL_EXT', con=engine_etls)

        # Crear nuevo DataFrame para almacenar los resultados
        plato_tra_df = pd.DataFrame()

        for index, row in plato_ext_df.iterrows():
            plato_tra_df = pd.concat([plato_tra_df, pd.DataFrame([{
                'plato_id': row["plato_id"],
                'nombre_plato': row["nombre_plato"],
                'descripcion': row["descripcion"],
                'precio': row["precio"],
                'imagen': row["imagen"],
                'estado': row["estado"]
            }])], ignore_index=True)

        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not plato_tra_df.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE platos_etl_tra'))
            plato_tra_df.to_sql('platos_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on Platos_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the platos table. Error: {e}")


def transform_producto_bodega(ses_db_etls: Session):
    """
    Consolidates the producto bodega information and the peso.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de la tabla productosbodega_ETL_EXT y guardar en un DataFrame
        producto_bodega_df = pd.read_sql('SELECT * FROM productosbodega_ETL_EXT', con=engine_etls)

        # Crear nuevo DataFrame para almacenar los resultados
        df_producto_bodega = pd.DataFrame()

        for index, row in producto_bodega_df.iterrows():
            df_producto_bodega = pd.concat([df_producto_bodega, pd.DataFrame([{
                'producto_bodega_id': row["producto_bodega_id"],
                'nombre_producto': row["nombre_producto"],
                'tipo': row["tipo"],
                'precio_proveedor': row["precio_proveedor"],
                'peso_proveedor_id': row["peso_proveedor_id"]
            }])], ignore_index=True)

        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not df_producto_bodega.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE productosbodega_etl_tra'))
            df_producto_bodega.to_sql('productosbodega_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on ProductosBodega_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the Producto Bodega table. Error: {e}")


def transform_ventas(ses_db_etls: Session):
    """
    Consolidates all factura and detalle factura information.

    Args:
    ses_db_etls (Session): Session for the ETL database.
    """
    try:
        # Obtener el motor asociado a la sesión
        engine_etls = ses_db_etls.bind

        # Extraer datos de las tablas Ventas_ETL_EXT y Fecha_ETL_TRA y guardar en DataFrames
        ventas_df = pd.read_sql('SELECT * FROM Ventas_ETL_EXT', con=engine_etls)
        fechas_df = pd.read_sql('SELECT * FROM Fecha_ETL_TRA', con=engine_etls)

        # Crear nuevo DataFrame para almacenar los resultados
        df_facturas_complete = pd.DataFrame()

        for index, row in ventas_df.iterrows():
            fecha_id = get_id_by_dates(row['fecha_inicio_semana'], fechas_df)

            df_facturas_complete = pd.concat([df_facturas_complete, pd.DataFrame([{
                'venta_id': row["venta_id"],
                'fecha_id': fecha_id,
                'plato_id': row["plato_id"],
                'cantidad': row["cantidad"],
                'precio_unitario': row["precio_unitario"],
                'precio_total': row["precio_total"]
            }])], ignore_index=True)

        # Si hay datos en el DataFrame, cargarlos en la base de datos
        if not df_facturas_complete.empty:
            with engine_etls.connect() as connection:
                connection.execute(text('TRUNCATE TABLE ventas_etl_tra'))
            df_facturas_complete.to_sql('ventas_etl_tra', con=engine_etls, if_exists="append", index=False)
            print("Data saved on ventas_ETL_TRA")

    except Exception as e:
        raise TypeError(f"An error occurred in the transformation of data from the ventas table. Error: {e}")
