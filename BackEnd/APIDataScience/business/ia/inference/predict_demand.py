
import pickle
import pandas as pd
from keras.models import load_model
import os

def predict_prophet(df_data_to_predict, model_route):
    """
    Carga un modelo Prophet guardado y realiza predicciones para un conjunto de fechas.

    Args:
    df_data_to_predict (DataFrame): DataFrame con las fechas para las predicciones (columna 'ds').
    model_route (str): Ruta al archivo donde está guardado el modelo Prophet.

    Returns:
        DataFrame: Un DataFrame con las predicciones realizadas.
    """
    #prophet
    # Comprobar si el archivo del modelo existe
    if os.path.exists(model_route):
        # Cargar el modelo existente
        with open(model_route, 'rb') as f:
            model = pickle.load(f)
    else:
        print("El archivo del modelo no existe en la ruta especificada.")
        return None

    # Realizar predicciones

    predicciones = model.predict(df_data_to_predict)

    return predicciones

def predict_ANN(df_prediccion, model_route):
    """
    Carga un modelo Prophet guardado y realiza predicciones para un conjunto de fechas.

    Args:
    df_data_to_predict (DataFrame): DataFrame con las fechas para las predicciones (columna 'ds').
    model_route (str): Ruta al archivo donde está guardado el modelo Prophet.

    Returns:
        DataFrame: Un DataFrame con las predicciones realizadas.
    """
    if not os.path.exists(model_route):
        raise Exception("El modelo no existe en la ruta proporcionada")

        # Aquí debes procesar df_prediccion de manera similar a como procesaste los datos de entrenamiento
        # (One-hot encoding, normalización, etc.)

    X_pred = df_prediccion  # Asume que df_prediccion ya está procesado adecuadamente

    model = load_model(model_route)
    predicciones = model.predict(X_pred)

    df_prediccion['cantidad_predicha'] = predicciones
    # Convertir las fechas a un formato legible
    df_prediccion['fecha'] = pd.to_datetime(df_prediccion['fecha'], unit='s')

    # # Asegurarse de que las predicciones sean no negativas
    # df_prediccion['cantidad_predicha'] = df_prediccion['cantidad_predicha'].clip(lower=0)

    return df_prediccion

def predict_models(X_test, name_model='linear_regression'):
    """
    Make predictions using a trained model.

    Args:
    X_test: Feature test data.
    name_model: Name of the model to be used for prediction.

    Returns:
    Array of predictions.
    """

    model_route = f"ia/models/trained_model_{name_model}.joblib"
    # Check if the model exists.
    if not os.path.exists(model_route):
        print(model_route)
        raise Exception(f"The model {name_model} does not exist. Train it before making predictions.")

    # Load the trained model.
    with open(model_route, 'rb') as file:
        model = pickle.load(file)

    # Make predictions.
    predictions = model.predict(X_test)
    df_prediccion= pd.DataFrame()
    df_prediccion['fecha'] = X_test['fecha'].copy()
    df_prediccion['producto_id'] = X_test['producto_id'].copy()
    df_prediccion['cantidad_predicha'] = predictions
    # Convertir las fechas a un formato legible
    df_prediccion['fecha'] = pd.to_datetime(df_prediccion['fecha'], unit='s')

    return df_prediccion



