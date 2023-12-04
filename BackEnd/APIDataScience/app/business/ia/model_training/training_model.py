import os
import pickle
import time

from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from xgboost import XGBRegressor
from mlforecast import MLForecast
from window_ops.rolling import rolling_mean, rolling_max, rolling_min
from window_ops.ewm import ewm_mean



def train_models(df_train):
    """
        Train a linear regression model

        Args:
        X_train: Feature training data.
        y_train: Label training data.
        name_model: name of the model to be trained

    """

    global model
    model_route = f"business/ia/models/trained_model.joblib"
    if os.path.exists(model_route):
        os.remove(model_route)

    models = [make_pipeline(SimpleImputer(),
                RandomForestRegressor(n_estimators=100)),
                XGBRegressor(n_estimators=100)]

    # model = MLForecast(models=models,
    #                    freq='W',
    #                    lags=[2, 4],
    #                    lag_transforms={
    #                        2: [(rolling_min, 2), (rolling_max, 4)],
    #                        # aplicado a uma janela W a partir do registro Lag
    #                        4: [(rolling_min, 2), (rolling_max, 4)],
    #                        # aplicado a uma janela W a partir do registro Lag
    #                        2: [(ewm_mean, 0.5)],
    #                    },
    #                    # date_features=['week', 'month'],
    #                    num_threads=6)
    model = MLForecast(models=models,
                       freq='W',
                       lags=[1, 2],  # Cambiado a lags más cortos
                       lag_transforms={
                               1: [(rolling_min, 2), (rolling_max, 2)],
                               2: [(ewm_mean, 0.5)],
                            },
                       num_threads=6)

    t0 = time.perf_counter()
    print("Start train model")
    model.fit(df_train, id_col='producto_id', time_col="fecha", target_col='cantidad_real')
    t1 = time.perf_counter()
    print(f"End train model in {t1 - t0} sec")
    with open(model_route, 'wb') as file:
        pickle.dump(model, file)







