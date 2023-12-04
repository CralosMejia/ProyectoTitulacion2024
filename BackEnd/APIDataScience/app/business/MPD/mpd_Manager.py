import pandas as pd

from app.business.etl.ETL import ETL
from app.business.ia.IAManager import IAManager

from config.DB.connection import connect
from config.properties import getProperty


class MPD_Manager:

    def __init__(self):
        self.con_db_etls = connect(getProperty('DATABASEETLS'))
        self.con_db_pacifico = connect(getProperty('DATABASESOURCENAME'))
        self.con_db_data_science = connect(getProperty('DATABASEDSC'))
        self.etl= ETL(self.con_db_etls,self.con_db_pacifico,self.con_db_data_science)
        self.iaManager= IAManager(self.con_db_data_science.get_session())


    def train(self):
        df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=self.con_db_data_science)
        df_producto = pd.read_sql(f'SELECT * FROM DimProducto', con=self.con_db_data_science)
        df_demanda = pd.read_sql(f'SELECT * FROM HechosDemandaProducto', con=self.con_db_data_science)

        df_train = self.iaManager.preparate_train_data(df_fecha, df_producto, df_demanda)

        self.iaManager.train_models(df_train)

    def run_etl(self):
        self.etl.run()

    def predict_demand(self):
        df_predictions = self.iaManager.predict_demand_by_num_periods(5)

    def prueba(selfd):
        return 1

