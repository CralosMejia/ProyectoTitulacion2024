

# from etl.jobs.etls_job import run_etl
#
# run_etl()


from config.properties import getProperty
from DB.connection import connect
import pandas as pd

from ia.data_preparation.data_preparation import preparate_train_data, preparate_inference_data
from ia.model_training.training_model import train_models

name_DB_ETLS = getProperty('DATABASEETLS')
name_DB_PACIFICO = getProperty('DATABASESOURCENAME')
name_DB_DATASCIENCE = getProperty('DATABASEDSC')

ses_db_etls = connect(name_DB_ETLS)
ses_db_pacifico = connect(name_DB_PACIFICO)
ses_db_data_science = connect(name_DB_DATASCIENCE)

df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=ses_db_data_science)
df_producto = pd.read_sql(f'SELECT * FROM DimProducto', con=ses_db_data_science)
df_demanda = pd.read_sql(f'SELECT * FROM HechosDemandaProducto', con=ses_db_data_science)

result_data_train=preparate_train_data(df_fecha, df_producto, df_demanda)

print(result_data_train.tail(10))
result_data_inference=preparate_inference_data('2023-11-16',df_producto,30)
print(result_data_inference.head(10))
print(result_data_inference.tail(10))
#train_models(result)
