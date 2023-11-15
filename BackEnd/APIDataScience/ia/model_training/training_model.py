import os
import pickle
import time
from prophet import Prophet
# from sklearn.linear_model import LinearRegression
# from sklearn.ensemble import RandomForestRegressor


# def train_models(X_train=None, y_train=None,name_model='linear_regresion'):
#     """
#         Train a linear regression model
#
#         Args:
#         X_train: Feature training data.
#         y_train: Label training data.
#         name_model: name of the model to be trained
#
#     """
#
#     model_route = f"ia/models/trained_model_{name_model}.joblib"
#     if os.path.exists(model_route):
#         # The model already exists, so let's load it.
#         model = load(model_route)
#     else:
#         # The model does not exist, we need to train a new one.
#         if X_train is None or y_train is None:
#             raise Exception("X_train and y_train are required to train a new model.")
#
#         if name_model == 'linear_regresion':
#             model = LinearRegression()
#         elif name_model == 'random_forest':
#             model = RandomForestRegressor()
#
#     model.fit(X_train, y_train)
#
#     dump(model, model_route)


def train_models(df_training):
    """
        Train prophet model

        Args:
            df_training(DataFrame): data to train model

    """
    #Create prophet model
    modelo = Prophet()

    model_route = f"ia/models/modelo_prophet.pkl"
    if os.path.exists(model_route):
        # The model already exists, so let's removed it.
        os.remove(model_route)

    # Verify if training data was provided
    if df_training is None:
        raise ValueError("No training data were provided to create a new model.")
    t0 = time.perf_counter()
    print("Training a new model...")
    modelo.fit(df_training)

    # Save the trained model
    with open(model_route, 'wb') as file:
        pickle.dump(modelo, file)
    t1 = time.perf_counter()
    print(f" the model has been trained in {t1 - t0} sec")
    print(f"Modelo guardado en {model_route}")


