import os
import time
import pandas as pd
import pickle

from dependency_injector.wiring import inject
from sqlalchemy import func



from mlforecast import MLForecast
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from window_ops.ewm import ewm_mean
from window_ops.rolling import rolling_min, rolling_max
from xgboost import XGBRegressor

from app.business.common.logServices import LoggerServices
from app.data.GenericRepository import GenericRepository
from app.data.Models.DataScienceDBModels import Dimfecha, Hechosdemandaproducto, Hechosventaplato, Dimplato


class IAManager:
    @inject
    def __init__(self,logger:LoggerServices,con_db_data_science,model_route='business/ia/models/trained_model.joblib'):
        self.model_route = model_route
        self.model = None
        self.ses_db_data_science=con_db_data_science.get_session()
        self.repoFecha= GenericRepository(self.ses_db_data_science, Dimfecha)
        self.repoDemanda=GenericRepository(self.ses_db_data_science, Hechosdemandaproducto)
        self.repoVentas=GenericRepository(self.ses_db_data_science, Hechosventaplato)
        self.repoPlato=GenericRepository(self.ses_db_data_science, Dimplato)


        self.log = logger

    def preparate_train_data_predict_demand(self, df_fecha, df_producto, df_demanda):
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

        t0 = time.perf_counter()
        print("data preparation for training has started")
        self.log.addLog('data preparation for training has started', 'ApiDatasicence', 'Módulo prediccion de demanda')
        try:
            df_merged = pd.merge(df_demanda[['fecha_id', 'producto_id', 'cantidad_real']],
                                 df_fecha[['fecha_id', 'fecha']], on='fecha_id')
            df_merged = pd.merge(df_merged, df_producto[['producto_id']], on='producto_id')
            columnas_a_eliminar = ['fecha_id']
            df_merged = df_merged.drop(columnas_a_eliminar, axis=1)
            df_merged['fecha'] = pd.to_datetime(df_merged['fecha'])
            df_agrupado = df_merged.groupby(['producto_id', 'fecha']).mean()
            df_agrupado = df_agrupado.reset_index()
            df_agrupado['fecha'] = pd.to_datetime(df_agrupado['fecha'])

            t1 = time.perf_counter()
            print(f"preparation of data for training has been completed in: {t1 - t0} sec")
            self.log.addLog(f'preparation of data for training has been completed in: {t1 - t0} sec', 'ApiDatasicence','Módulo prediccion de demanda')
            return df_agrupado
        except ValueError as e:
            self.log.addLog(f'An error occurred when preparing the data for training.. ERROR', 'ApiDatasicence','Módulo prediccion de demanda')
            raise TypeError(f"An error occurred when preparing the data for training.. ERROR: {e}")

    def preparate_train_data_sales_trend(self, df_fecha, df_plato, df_ventas):
        """
        Prepares data to be sent to the AI model for analyzing sales trend.

        Args:
            df_fecha (DataFrame): Data for fecha to be prepared.
            df_plato (DataFrame): Data for plato to be prepared.
            df_ventas (DataFrame): Data for ventas to be prepared.

        Returns:
            DataFrame: A DataFrame with the structure and data needed to analyze sales trend.
        """
        t0 = time.perf_counter()
        print("Data preparation for sales trend analysis has started")
        self.log.addLog('Data preparation for sales trend analysis has started', 'ApiDatasicence',
                        'Módulo prediccion de demanda ')

        try:
            # Unir los dataframes
            df_merged = pd.merge(df_ventas[['fecha_id', 'plato_id', 'unidades_vendidas']],
                                 df_fecha[['fecha_id', 'fecha']], on='fecha_id')
            df_merged = pd.merge(df_merged, df_plato[['plato_id']], on='plato_id')
            columnas_a_eliminar = ['fecha_id']
            df_merged = df_merged.drop(columnas_a_eliminar, axis=1)
            df_merged['fecha'] = pd.to_datetime(df_merged['fecha'])
            df_agrupado = df_merged.groupby(['plato_id', 'fecha']).mean()
            df_agrupado = df_agrupado.reset_index()
            df_agrupado['fecha'] = pd.to_datetime(df_agrupado['fecha'])

            t1 = time.perf_counter()
            print(f"Preparation of data for sales trend analysis has been completed in: {t1 - t0} sec")
            self.log.addLog(f'Preparation of data for sales trend analysis has been completed in: {t1 - t0} sec',
                            'ApiDatasicence', 'Módulo prediccion de demanda')

            return df_agrupado
        except ValueError as e:
            self.log.addLog(f'An error occurred when preparing the data for sales trend analysis. ERROR',
                            'ApiDatasicence', 'Módulo prediccion de demanda')
            raise TypeError(f"An error occurred when preparing the data for sales trend analysis. ERROR: {e}")

    def train_models_to_predict_demand(self, df_train):
        """
            Train a linear regression model

            Args:
            X_train: Feature training data.
            y_train: Label training data.
            name_model: name of the model to be trained

        """
        t0 = time.perf_counter()
        print("Model training process has started")
        self.log.addLog('Model training process has started', 'ApiDatasicence', 'Módulo prediccion de demanda')
        try:
            global model
            model_route = f"app/business/ia/models/trained_model_predict_demand.joblib"
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

            t1 = time.perf_counter()
            print(f"Model training process has been completed in: {t1 - t0} sec")
            self.log.addLog(f'Model training process has been completed in: {t1 - t0} sec', 'ApiDatasicence','Módulo prediccion de demanda')
        except ValueError as e:
            self.log.addLog(f'An error occurred while training the AI model. ERROR: {e}', 'ApiDatasicence','Módulo prediccion de demanda')

            raise TypeError(f"An error occurred while training the AI model. ERROR: {e}")

    def train_models_to_analyze_sales_trend(self, df_train):
        """
        Train a model to analyze sales trend.

        Args:
            df_train: DataFrame with training data.

        """
        t0 = time.perf_counter()
        print("Sales trend analysis model training process has started")
        self.log.addLog('Sales trend analysis model training process has started', 'ApiDatasicence',
                        'Módulo tendencia de ventas')

        try:
            global model
            model_route = f"app/business/ia/models/sales_trend_model.joblib"
            if os.path.exists(model_route):
                os.remove(model_route)

            models = [make_pipeline(SimpleImputer(),
                                    RandomForestRegressor(n_estimators=100)),
                      XGBRegressor(n_estimators=100)]

            model = MLForecast(models=models,
                               freq='W',  # Frecuencia semanal
                               lags=[1, 2, 3, 4],  # Lags de varias semanas para capturar tendencias
                               lag_transforms={
                                   1: [(rolling_min, 2), (rolling_max, 2)],
                                   2: [(ewm_mean, 0.5)],
                               },
                               num_threads=6)

            print("Start train model")
            model.fit(df_train, id_col='plato_id', time_col="fecha", target_col='unidades_vendidas')
            t1 = time.perf_counter()
            print(f"End train model in {t1 - t0} sec")

            with open(model_route, 'wb') as file:
                pickle.dump(model, file)

            print(f"Sales trend analysis model training process has been completed in: {t1 - t0} sec")
            self.log.addLog(f'Sales trend analysis model training process has been completed in: {t1 - t0} sec',
                            'ApiDatasicence', 'Módulo tendencia de ventas')
        except ValueError as e:
            self.log.addLog(f'An error occurred while training the sales trend analysis model. ERROR: {e}',
                            'ApiDatasicence', 'Módulo tendencia de ventas')
            raise TypeError(f"An error occurred while training the sales trend analysis model. ERROR: {e}")

    def predict_demand_by_num_periods(self, num_periods):
        """
        Make predictions using a trained model.

        Args:
        X_test: Feature test data.
        name_model: Name of the model to be used for prediction.

        Returns:
        Array of predictions.
        """
        try:
            t0 = time.perf_counter()
            print("has started the demand forecasting process")
            self.log.addLog(f'has started the demand forecasting process', 'ApiDatasicence','Módulo prediccion de demanda')
            model_route = f"app/business/ia/models/trained_model_predict_demand.joblib"
            self.clean_demand()
            # Check if the model exists.
            if not os.path.exists(model_route):
                self.log.addLog(f'The model trained_model_predict_demand.joblib does not exist. Train it before making predictions.', 'ApiDatasicence',
                                'Módulo prediccion de demanda')

                raise Exception(f"The model trained_model_predict_demand.joblib does not exist. Train it before making predictions.")

            # Load the trained model.
            with open(model_route, 'rb') as file:
                model = pickle.load(file)

            # Make predictions.
            df_prediccion = model.predict(h=num_periods)
            self._save_data_predicted_demand(df_prediccion)
            t1 = time.perf_counter()
            print(f"has finished the demand forecasting process in {t1 - t0} sec")
            self.log.addLog(f'The demand forecasting process has been completed in {t1 - t0} sec', 'ApiDatasicence','Módulo prediccion de demanda')


            return df_prediccion
        except ValueError as e:
            self.log.addLog(f'an error occurred in predicting demand. ERROR: {e}', 'ApiDatasicence','Módulo prediccion de demanda')
            raise TypeError(f"an error occurred in predicting demand. ERROR: {e}")

    def predict_trend_sales_by_num_periods(self,num_periods):
        """
                Make predictions using a trained model.

                Args:
                X_test: Feature test data.
                name_model: Name of the model to be used for prediction.

                Returns:
                Array of predictions.
                """
        try:
            t0 = time.perf_counter()
            print("has started the sales trend forecasting process")
            self.log.addLog(f'has started the sales trend forecasting process', 'ApiDatasicence', 'Módulo prediccion de demanda')
            model_route = f"app/business/ia/models/sales_trend_model.joblib"
            # Check if the model exists.
            if not os.path.exists(model_route):
                self.log.addLog(f'The model tsales_trend_model.joblib does not exist. Train it before making predictions.',
                                'ApiDatasicence',
                                'Módulo prediccion de demanda')
                raise Exception(f"The model tsales_trend_model.joblib does not exist. Train it before making predictions.")


            # Load the trained model.
            with open(model_route, 'rb') as file:
                model = pickle.load(file)

            # Make predictions.
            df_prediccion = model.predict(h=num_periods)
            self._save_data_predicted_trend_sales(df_prediccion)
            print(df_prediccion)
            t1 = time.perf_counter()
            print(f"The sales trend forecasting process has been completed in {t1 - t0} sec")
            self.log.addLog(f'The sales trend forecasting process has been completed in {t1 - t0} sec', 'ApiDatasicence',
                            'Módulo prediccion de demanda')

            return df_prediccion
        except ValueError as e:
            self.log.addLog(f'an error occurred in sales trend forecasting. ERROR: {e}', 'ApiDatasicence',
                            'Módulo prediccion de demanda')
            raise TypeError(f"an error occurred in sales trend forecasting. ERROR: {e}")

    def _save_data_predicted_demand(self, df_predicted):
        try:
            for index, row in df_predicted.iterrows():
                producto_id = row['producto_id']
                fecha = row['fecha']
                cantidad_predicha_modelo_1 = row[
                    'XGBRegressor']  # Asumiendo que quieres usar las predicciones de XGBRegressor
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
            print('Demand forecasting process completed')
            self.log.addLog(f'The demand forecasting process has been completed and the data has been saved correctly.', 'ApiDatasicence','Módulo prediccion de demanda')
        except ValueError as e:
            self.log.addLog(f'An error occurred when saving the predictions. ERROR: {e}', 'ApiDatasicence','Módulo prediccion de demanda')
            raise TypeError(f"An error occurred when saving the predictions. ERROR: {e}")


    def _save_data_predicted_trend_sales(self, df_predicted):
        try:
            for index, row in df_predicted.iterrows():
                plato_id = row['plato_id']
                fecha = row['fecha']
                cantidad_predicha_modelo_1 = row[
                    'XGBRegressor']

                # Verificar si la fecha existe en DimFecha
                fecha_id = self._get_or_create_fecha(fecha)

                # Verificar si la combinación de producto y fecha ya existe en HechosDemandaProducto
                venta = self.repoVentas.get_all_by_field('plato_id', plato_id)
                plato=self.repoPlato.get_by_id(plato_id)
                venta = [d for d in venta if d.fecha_id == fecha_id]

                if not venta:
                    # Si no existe, crear un nuevo registro en HechosDemandaProducto
                    nueva_venta = {
                        'fecha_id': fecha_id,
                        'plato_id': plato_id,
                        'unidades_vendidas': cantidad_predicha_modelo_1,
                        'precio_total':(cantidad_predicha_modelo_1*float(plato.precio))
                    }
                    self.repoVentas.create(nueva_venta)
            print('Trend sales forecasting process completed')
            self.log.addLog(f'The trend sales forecasting process has been completed and the data has been saved correctly.', 'ApiDatasicence','Módulo prediccion de venta')
        except ValueError as e:
            self.log.addLog(f'An error occurred when saving the predictions of trend sales. ERROR: {e}', 'ApiDatasicence','Módulo prediccion de venta')
            raise TypeError(f"An error occurred when saving the predictions of trend sales. ERROR: {e}")

    def _get_or_create_fecha(self, fecha_ts):
        try:
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

        except ValueError as e:
            raise TypeError(f"An error occurred while creating or obtaining a date. ERROR: {e}")

    def _get_max_fecha_id(self):
        try:
            max_id = self.repoFecha.session.query(func.max(Dimfecha.fecha_id)).scalar()
            return max_id
        except Exception as e:
            raise Exception(f"Error getting the id of the most recent date: {e}")

    def clean_demand(self):
        """
        Elimina todas las entradas en HechosDemandaProducto donde cantidad_real es 0.
        """
        try:
            t0 = time.perf_counter()
            print("Cleaning process for HechosDemandaProducto has started")
            self.log.addLog('Cleaning process for HechosDemandaProducto has started', 'ApiDatasicence', 'Módulo prediccion de demanda')

            # Eliminar todas las entradas donde cantidad_real es 0
            deleted_count = self.repoDemanda.delete_all_by_field('cantidad_real', 0)

            t1 = time.perf_counter()
            print(f"Cleaning process has been completed in {t1 - t0} sec. Deleted {deleted_count} entries.")
            self.log.addLog(f'Cleaning process has been completed in {t1 - t0} sec. Deleted {deleted_count} entries.', 'ApiDatasicence', 'Módulo prediccion de demanda')

        except Exception as e:
            self.log.addLog(f'An error occurred during the cleaning process. ERROR: {e}', 'ApiDatasicence', 'Módulo prediccion de demanda')
            raise Exception(f"An error occurred during the cleaning process. ERROR: {e}")