import os
import time
import pandas as pd
import pickle
from datetime import datetime
from sqlalchemy import func



from mlforecast import MLForecast
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sqlalchemy.orm import Session
from window_ops.ewm import ewm_mean
from window_ops.rolling import rolling_min, rolling_max
from xgboost import XGBRegressor

from data.GenericRepository import GenericRepository
from data.Models.DataScienceDBModels import Dimfecha, Hechosdemandaproducto


class IAManager:
    def __init__(self,ses_db_data_science:Session,model_route='business/ia/models/trained_model.joblib'):
        self.model_route = model_route
        self.model = None
        self.repoFecha= GenericRepository(ses_db_data_science, Dimfecha)
        self.repoDemanda=GenericRepository(ses_db_data_science, Hechosdemandaproducto)

    def preparate_train_data(self, df_fecha, df_producto, df_demanda):
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
        df_agrupado = df_merged.groupby(['producto_id', 'fecha']).mean()
        df_agrupado = df_agrupado.reset_index()
        df_agrupado['fecha'] = pd.to_datetime(df_agrupado['fecha'])


        return df_agrupado

    def train_models(self, df_train):
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

    def predict_demand_by_num_periods(self, num_periods):
        """
        Make predictions using a trained model.

        Args:
        X_test: Feature test data.
        name_model: Name of the model to be used for prediction.

        Returns:
        Array of predictions.
        """

        model_route = f"business/ia/models/trained_model.joblib"
        # Check if the model exists.
        if not os.path.exists(model_route):
            raise Exception(f"The model trained_model.joblib does not exist. Train it before making predictions.")

        # Load the trained model.
        with open(model_route, 'rb') as file:
            model = pickle.load(file)

        # Make predictions.
        df_prediccion = model.predict(h=num_periods)
        self._save_data_predicted(df_prediccion)

        return df_prediccion


    def _save_data_predicted(self,df_predicted):
        for index, row in df_predicted.iterrows():
            producto_id = row['producto_id']
            fecha = row['fecha']
            cantidad_predicha_modelo_1 = row['XGBRegressor']  # Asumiendo que quieres usar las predicciones de XGBRegressor
            cantidad_predicha_modelo_2 = row['Pipeline']

            # Verificar si la fecha existe en DimFecha
            fecha_id = self._get_or_create_fecha(fecha)

            # Verificar si la combinación de producto y fecha ya existe en HechosDemandaProducto
            demanda = self.repoDemanda.get_all_by_field('producto_id', producto_id)
            demanda = [d for d in demanda if d.fecha_id == fecha_id]

            if not demanda:
                # Si no existe, crear un nuevo registro en HechosDemandaProducto
                nueva_demanda = {
                    'fecha_id': fecha_id,
                    'producto_id': producto_id,
                    'cantidad_predicha_modelo_1': cantidad_predicha_modelo_1,
                    'cantidad_predicha_modelo_2': cantidad_predicha_modelo_2,
                    'cantidad_real': 0  # Suponiendo que inicialmente es 0
                }
                self.repoDemanda.create(nueva_demanda)


    def _get_or_create_fecha(self, fecha_ts):
        # Convertir Timestamp a date (si es necesario)
        if isinstance(fecha_ts, pd.Timestamp):
            fecha = fecha_ts.to_pydatetime().date()
        else:
            # Si ya es un objeto date, úsalo directamente
            fecha = fecha_ts

        semana = fecha.isocalendar()[1]
        mes = fecha.month
        anio = fecha.year

        # Verificar si la fecha existe en DimFecha
        fecha_existente = self.repoFecha.get_all_by_field('fecha', fecha)
        if fecha_existente:
            return fecha_existente[0].fecha_id
        else:
            # Obtener el ID máximo actual y sumarle 1
            max_fecha_id = self._get_max_fecha_id()
            nueva_fecha_id = max_fecha_id + 1 if max_fecha_id else 1

            nueva_fecha = {
                'fecha_id': nueva_fecha_id,
                'fecha': fecha,
                'semana': semana,
                'mes': mes,
                'anio': anio
            }
            self.repoFecha.create(nueva_fecha)
            return nueva_fecha_id

    def _get_max_fecha_id(self):
        try:
            max_id = self.repoFecha.session.query(func.max(Dimfecha.fecha_id)).scalar()
            return max_id
        except Exception as e:
            raise Exception(f"Error al obtener el máximo fecha_id: {e}")
