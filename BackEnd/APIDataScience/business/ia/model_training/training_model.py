import os
import pickle
import time

from keras import Sequential
from keras.src.layers import Dense
from prophet import Prophet
from keras.models import load_model
import os
from keras.initializers import HeNormal
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression


# from sklearn.linear_model import LinearRegression
# from sklearn.ensemble import RandomForestRegressor


def train_models(X_train=None, y_train=None, name_model='linear_regression'):
    """
        Train a linear regression model

        Args:
        X_train: Feature training data.
        y_train: Label training data.
        name_model: name of the model to be trained

    """

    global model
    model_route = f"ia/models/trained_model_{name_model}.joblib"
    if os.path.exists(model_route):
        with open(model_route, 'rb') as file:
            model = pickle.load(file)
    else:
        # The model does not exist, we need to train a new one.
        if X_train is None or y_train is None:
            raise Exception("X_train and y_train are required to train a new model.")

        if name_model == 'linear_regression':
            model = LinearRegression()
        elif name_model == 'random_forest':
            model = RandomForestRegressor()

    model.fit(X_train, y_train)
    with open(model_route, 'wb') as file:
        pickle.dump(model, file)




def train_model_prophet(df_training, model_route):
    """
        Train prophet model

        Args:
            df_training(DataFrame): data to train model

    """
    #Prophet
    if os.path.exists(model_route):
        # The model already exists, so let's removed it.
        os.remove(model_route)
    # Create prophet model
    modelo = Prophet()
    modelo.add_regressor('producto', mode='additive')

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


def train_model_ANN(X_train, y_train, model_route):
    """
        Train prophet model

        Args:
            df_training(DataFrame): data to train model

    """
    if os.path.exists(model_route):
        #model = load_model(model_route)
        os.remove(model_route)
    model = Sequential()
    model.add(Dense(64, input_dim=X_train.shape[1], activation='relu', kernel_initializer=HeNormal()))
    model.add(Dense(32, activation='relu', kernel_initializer=HeNormal()))
    model.add(Dense(1, activation='softplus'))  # Capa de salida con softplus

    model.compile(loss='mean_squared_error', optimizer='adam')

    model.fit(X_train, y_train, epochs=50, batch_size=10)
    model.save(model_route)


