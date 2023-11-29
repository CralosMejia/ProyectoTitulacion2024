import pandas as pd
import numpy as np
from pandas.tseries.offsets import Week

from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split


def preparate_train_data(df_fecha, df_producto, df_demanda):
    """
    Prepares data to be sent to the AI model for training or validation.

    Args:
        df_fecha (DataFrame): Data for fecha to be prepared.
        df_producto (DataFrame): Data for producto to be prepared.
        df_demanda (DataFrame): Data for demanda to be prepared.

    Returns:
        DataFrame: A DataFrame with the structure and data needed to train the model.
    """

    # Unir los dataframes
    df_merged = pd.merge(df_demanda[['fecha_id', 'producto_id', 'cantidad_real']],
                         df_fecha[['fecha_id', 'fecha']], on='fecha_id')
    df_merged = pd.merge(df_merged, df_producto[['producto_id']], on='producto_id')

    columnas_a_eliminar = ['fecha_id']
    df_merged = df_merged.drop(columnas_a_eliminar, axis=1)

    df_merged['fecha'] = pd.to_datetime(df_merged['fecha'])

    # Crear un PeriodIndex para representar las semanas
    #df_merged['fecha'] = df_merged['fecha'].dt.to_period('W')

    # Agrupar por 'producto_id' y 'semana' y calcular la media para cada grupo
    df_agrupado = df_merged.groupby(['producto_id', 'fecha']).mean()

    # Opcional: resetear el índice si necesitas 'producto_id' y 'semana' como columnas
    df_agrupado = df_agrupado.reset_index()

    #df_agrupado['fecha'] = df_agrupado['fecha'].astype(str).str.split('/').str[-1]
    df_agrupado['fecha'] = pd.to_datetime(df_agrupado['fecha'])

    df_agrupado.to_csv('mi_archivo.csv', index=False)

    return df_agrupado



def prepare_data_for_prediction(fecha_inicio, df_productos, num_periodos):
    """
    Prepara un DataFrame para hacer predicciones.

    Args:
        fecha_inicio (str): Fecha de inicio en formato 'YYYY-MM-DD'.
        df_productos (DataFrame): DataFrame con los productos.
        num_periodos (int): Número de periodos (semanas) a generar.

    Returns:
        DataFrame: DataFrame preparado para la predicción.
    """

    # Convertir la fecha de inicio en un objeto datetime
    fecha_inicio = pd.to_datetime(fecha_inicio)

    # Generar las fechas para el número de periodos especificado
    fechas = pd.date_range(start=fecha_inicio, periods=num_periodos, freq='W')

    # Crear un DataFrame a partir del rango de fechas
    df_fechas = pd.DataFrame(fechas, columns=['fecha'])

    # Convertir las fechas a tipo 'Period' semanal
    df_fechas['fecha'] = df_fechas['fecha'].dt.to_period('W')

    # Crear un DataFrame con todas las combinaciones de productos y fechas
    df_prediccion = pd.merge(df_productos.assign(key=0), df_fechas.assign(key=0), on='key').drop('key', axis=1)

    # Seleccionar solo las columnas 'fecha' y 'producto_id'
    df_prediccion = df_prediccion[['fecha', 'producto_id']]

    # Resetear el índice si es necesario
    df_prediccion = df_prediccion.reset_index(drop=True)

    # Convertir 'fecha' a string y luego a datetime para emular la estructura de 'preparate_train_data'
    df_prediccion['fecha'] = df_prediccion['fecha'].astype(str).str.split('/').str[-1]
    df_prediccion['fecha'] = pd.to_datetime(df_prediccion['fecha'])

    return df_prediccion

            

