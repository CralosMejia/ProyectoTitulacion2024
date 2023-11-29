from business.etl.ETL import ETL
from business.ia.IAManager import IAManager
from config.properties import getProperty
from config.DB.connection import connect
import pandas as pd

name_DB_ETLS = getProperty('DATABASEETLS')
name_DB_PACIFICO = getProperty('DATABASESOURCENAME')
name_DB_DATASCIENCE = getProperty('DATABASEDSC')
model_route_prophet = getProperty('MODELROUTEPROPHET')
model_route_red_neuronal= getProperty('MODELROUTERN')

con_db_etls = connect(name_DB_ETLS)
con_db_pacifico = connect(name_DB_PACIFICO)
con_db_data_science = connect(name_DB_DATASCIENCE)

ses_db_etls = con_db_etls.get_session()
ses_db_pacifico = con_db_pacifico.get_session()
ses_db_data_science = con_db_data_science.get_session()




#ETL
etl= ETL(con_db_etls,con_db_pacifico,con_db_data_science)
ia= IAManager(ses_db_data_science)
etl.run()

df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=ses_db_data_science.bind)
df_producto = pd.read_sql(f'SELECT * FROM DimProducto', con=ses_db_data_science.bind)
df_demanda = pd.read_sql(f'SELECT * FROM HechosDemandaProducto', con=ses_db_data_science.bind)

df_train=ia.preparate_train_data(df_fecha,df_producto,df_demanda)
print(df_train.head(10))
print(df_train.tail(10))


ia.train_models(df_train)




df_predictions = ia.predict_demand_by_num_periods(5)

print(df_predictions.head(10))
print(df_predictions.tail(10))


try:
    pass
except:
    pass
finally:
    pass


