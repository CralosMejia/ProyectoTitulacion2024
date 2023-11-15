import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from common.exceptions.custom_exceptions import send_exception


def data_preparation(df_fecha, df_producto, df_demanda):
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
            

