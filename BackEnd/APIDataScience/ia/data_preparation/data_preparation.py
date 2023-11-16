import pandas as pd
import pickle
import os
from datetime import datetime, timedelta

from prophet import Prophet
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from common.exceptions.custom_exceptions import send_exception


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

    # Fusiona las tablas en un solo DataFrame en base a las claves foráneas
    df = pd.merge(df_demanda, df_fecha, how='left', on='fecha_id')
    df = pd.merge(df, df_producto, how='left', on='producto_id')

    # Renombra las columnas para cumplir con los requisitos de Prophet
    df.rename(columns={'fecha': 'ds', 'cantidad_real': 'y', 'producto_id': 'producto'}, inplace=True)

    # Selecciona solo las columnas necesarias para el modelo
    df_modelo = df[['ds', 'y', 'producto']]

    return df_modelo


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
    # Convert start_date from str to datetime
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')

    # Generate a range of future dates
    fechas_futuras = [start_date + timedelta(days=x) for x in range(num_periods)]
    df_fechas_futuras = pd.DataFrame(fechas_futuras, columns=['ds'])

    # Create a DataFrame with all date and product combinations
    df_prediccion = pd.merge(df_fechas_futuras.assign(key=1), df_productos.assign(key=1), on='key').drop('key', axis=1)

    # Sort and select the required columnsO
    df_prediccion = df_prediccion[['ds', 'producto_id']]

    return df_prediccion

            

