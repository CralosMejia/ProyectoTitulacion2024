from config.DB.DatabaseConnection import DatabaseConnection
from config.properties import getProperty

type = getProperty("TYPE")
host = getProperty("HOST")
port = getProperty("PORT")
user = getProperty("USER")
pwd = getProperty("PASSWORD")


db_etl_name=getProperty('DATABASEETLS')
db_pacific_name=getProperty('DATABASESOURCENAME')
db_datascience_name=getProperty('DATABASEDSC')


db_etl_connection_str = f'mysql+pymysql://{user}:{pwd}@{host}:{port}/{db_etl_name}'
db_pacific_connection_str = f'mysql+pymysql://{user}:{pwd}@{host}:{port}/{db_pacific_name}'
db_datascience_connection_str = f'mysql+pymysql://{user}:{pwd}@{host}:{port}/{db_datascience_name}'
