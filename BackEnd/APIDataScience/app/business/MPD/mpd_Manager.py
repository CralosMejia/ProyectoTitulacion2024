import pandas as pd
from dependency_injector.wiring import inject

from app.business.etl.ETL import ETL
from app.business.ia.IAManager import IAManager

from config.DB.connection import connect
from config.properties import getProperty


class MPD_Manager:

    @inject
    def __init__(self,etl: ETL, ia_manager: IAManager,con_db_data_science):
        self.etl = etl
        self.iaManager = ia_manager
        self.con_db_data_science=con_db_data_science


    def train(self):
        try:
            df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=self.con_db_data_science.get_session().bind)
            df_producto = pd.read_sql(f'SELECT * FROM DimProducto', con=self.con_db_data_science.get_session().bind)
            df_demanda = pd.read_sql(f'SELECT * FROM HechosDemandaProducto',
                                     con=self.con_db_data_science.get_session().bind)

            df_train = self.iaManager.preparate_train_data(df_fecha, df_producto, df_demanda)

            self.iaManager.train_models(df_train)

        except ValueError as e:
            print(f"Hola: {e}")

    def run_etl(self):
        try:
            self.etl.run()
        except ValueError as e:
            print(f"{e}")

    def predict_demand(self):
        try:
            df_predictions = self.iaManager.predict_demand_by_num_periods(5)
        except ValueError as e:
            print(f"{e}")

    def prueba(selfd):
        return 1

