import pandas as pd
import numpy as np

from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split


def preparate_train_data(df_fecha, df_producto, df_demanda):
    """
    Prepares data to be sent to the ia model for training or validation
    
    Args:
    df_fecha (DataFrame): fecha data to be prepared
    df_producto (DataFrame): producto data to be prepared
    df_demanda (DataFrame): demanda data to be prepared

    Returns:
        df_modelo(DataFrame):returns a df with the structure and data needed to train the model
    """
    #Red neuronal:
    # Unir los dataframes
    df_merged = pd.merge(df_demanda[['fecha_id', 'producto_id', 'cantidad_real']],
                         df_fecha[['fecha_id', 'fecha']], on='fecha_id')
    df_merged = pd.merge(df_merged, df_producto[['producto_id']], on='producto_id')

    # Convertir la columna de fecha a timestamps
    df_merged['fecha'] = pd.to_datetime(df_merged['fecha']).astype(np.int64) // 10 ** 9

    # Convertir el 'producto_id' a una variable categórica si aún no lo es
    df_merged['producto_id'] = df_merged['producto_id'].astype('category')


    # Separar características y objetivo
    x = df_merged[['fecha', 'producto_id']]
    y = df_merged['cantidad_real']
    x_train, x_val, y_train, y_val = train_test_split(x, y, test_size=0.2, random_state=42)

    return x_train, y_train, x_val, y_val


def preparate_train_data_prophet(df_fecha, df_producto, df_demanda):
    """
    Prepares data to be sent to the ia model for training or validation

    Args:
    df_fecha (DataFrame): fecha data to be prepared
    df_producto (DataFrame): producto data to be prepared
    df_demanda (DataFrame): demanda data to be prepared

    Returns:
        df_modelo(DataFrame):returns a df with the structure and data needed to train the model
    """
    #Fusiona las tablas en un solo DataFrame en base a las claves foráneas
    df = pd.merge(df_demanda, df_fecha, how='left', on='fecha_id')
    df = pd.merge(df, df_producto, how='left', on='producto_id')

    # Renombra las columnas para cumplir con los requisitos de Prophet
    df.rename(columns={'fecha': 'ds', 'cantidad_real': 'y', 'producto_id': 'producto'}, inplace=True)

    # Convertir el 'producto_id' a una variable categórica si aún no lo es
    df['producto'] = df['producto'].astype('category')

    # Convirtiendo las categorías en códigos para que Prophet pueda manejarlas como regresores numéricos
    df['producto'] = df['producto'].cat.codes

    # Selecciona solo las columnas necesarias para el modelo
    df_modelo = df[['ds', 'y', 'producto']]

    split_point = int(len(df) * 0.8)
    train_df = df_modelo[:split_point]
    test_df = df_modelo[split_point:]

    return train_df,test_df

def preparate_inference_data(start_date_str, df_productos, num_periods):
    """
        Prepare data for Prophet model forecasts for multiple products and dates.

        Args:
        start_date_str (str): The start date for predictions in 'YYYYY-MM-DD' format.
        df_productos (DataFrame): DataFrame with the list of products.
        num_periods (int): Number of days to generate dates from the start date.

        Returns:
            DataFrame: A DataFrame ready to use in Prophet predictions.
        """
    #red neuronal
    # Generar fechas para la predicción
    fechas_prediccion = pd.date_range(start=start_date_str, periods=num_periods)

    # Crear un dataframe para cada combinación de fecha y producto
    df_prediccion = pd.DataFrame([(fecha, prod) for fecha in fechas_prediccion for prod in df_productos['producto_id']],
                                 columns=['fecha', 'producto_id'])

    # Convertir el 'producto_id' a una variable categórica si aún no lo es
    df_prediccion['producto_id'] = df_prediccion['producto_id'].astype('category')

    # Convertir la columna de fecha a timestamps numéricos
    df_prediccion['fecha'] = pd.to_datetime(df_prediccion['fecha']).astype(np.int64) // 10 ** 9

    return df_prediccion


def preparate_inference_data_prophet(start_date_str, df_productos, num_periods):
    """
        Prepare data for Prophet model forecasts for multiple products and dates.

        Args:
        start_date_str (str): The start date for predictions in 'YYYYY-MM-DD' format.
        df_productos (DataFrame): DataFrame with the list of products.
        num_periods (int): Number of days to generate dates from the start date.

        Returns:
            DataFrame: A DataFrame ready to use in Prophet predictions.
        """
    #prophet
    # Convert start_date from str to datetime
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    # Generate a range of future dates
    fechas_futuras = [start_date + timedelta(days=x) for x in range(num_periods)]
    df_fechas_futuras = pd.DataFrame(fechas_futuras, columns=['ds'])

    # Create a DataFrame with all date and product combinations
    df_prediccion = pd.merge(df_fechas_futuras.assign(key=1), df_productos.assign(key=1), on='key').drop('key', axis=1)

    # Renombra las columnas para cumplir con los requisitos de Prophet
    df_prediccion.rename(columns={'producto_id': 'producto'}, inplace=True)

    # Convertir el 'producto_id' a una variable categórica si aún no lo es
    df_prediccion['producto'] = df_prediccion['producto'].astype('category')

    # Convirtiendo las categorías en códigos para que Prophet pueda manejarlas como regresores numéricos
    df_prediccion['producto'] = df_prediccion['producto'].cat.codes

    # Selecciona solo las columnas necesarias para el modelo
    df_prediccion = df_prediccion[['ds','producto']]

    return df_prediccion

            

