import pandas as pd
from dependency_injector.wiring import inject
from sqlalchemy import func, select

from app.business.etl.ETL import ETL
from app.business.ia.IAManager import IAManager
from app.data.Models.DataScienceDBModels import Dimfecha, Hechosdemandaproducto

from config.properties import getProperty


class MPD_Manager:

    @inject
    def __init__(self,etl: ETL, ia_manager: IAManager,con_db_data_science):
        self.etl = etl
        self.iaManager = ia_manager
        self.con_db_data_science=con_db_data_science
        self.ses_db_data_science = con_db_data_science.get_session()


    def train_model_to_predict_demand(self):
        try:
            df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=self.con_db_data_science.get_session().bind)
            df_producto = pd.read_sql(f'SELECT * FROM DimProducto', con=self.con_db_data_science.get_session().bind)
            df_demanda = pd.read_sql(f'SELECT * FROM HechosDemandaProducto',
                                     con=self.con_db_data_science.get_session().bind)

            df_train = self.iaManager.preparate_train_data_predict_demand(df_fecha, df_producto, df_demanda)

            self.iaManager.train_models_to_predict_demand(df_train)

        except ValueError as e:
            print(f": {e}")

    def run_etl(self):
        try:
            self.etl.run()
        except ValueError as e:
            print(f"{e}")

    def predict_demand(self):
        try:
            df_predictions = self.iaManager.predict_demand_by_num_periods(int(getProperty("NUMWEEKSTOPREDICT")))
        except ValueError as e:
            print(f"{e}")

    def train_model_to_predict_trend_sales(self):
        df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=self.con_db_data_science.get_session().bind)
        df_plato = pd.read_sql(f'SELECT * FROM DimPlato', con=self.con_db_data_science.get_session().bind)
        df_ventas_platos = pd.read_sql(f'SELECT * FROM HechosVentaPlatos',
                                 con=self.con_db_data_science.get_session().bind)
        try:
            subquery = self.ses_db_data_science.query(func.max(Dimfecha.fecha_id)).join(Hechosdemandaproducto,
                                                                                   Dimfecha.fecha_id == Hechosdemandaproducto.fecha_id).filter(Hechosdemandaproducto.cantidad_real != 0).scalar()
            result = self.iaManager.preparate_train_data_sales_trend(df_fecha, df_plato, df_ventas_platos,subquery)

            self.iaManager.train_models_to_analyze_sales_trend(result)
        except ValueError as e:
            print(f"{e}")

    def predict_trend_sales(self):
        try:
            df_predictions = self.iaManager.predict_trend_sales_by_num_periods(int(getProperty("NUMWEEKSTOPREDICT")))
        except ValueError as e:
            print(f"{e}")


