# from config.properties import getProperty
# from DB.connection import connect
# from ia.data_preparation.data_preparation import data_preparation
# from ia.model_training.training_model import train_models
# from  ia.model_evaluation.evaluate_model import evaluate_model
# import pandas as pd
# import time




# def _preparate_data(ses_db_pacifico,data_set_name):
#     """
#         calls the function that prepares the data
#
#         Args:
#         df (DataFrame): data to be prepared
#         data_set_name (str): type of dataset we want to return: 'train' or 'test'.
#
#         Returns:
#             x_train or x_test: array
#             y_train or y_test: array
#     """
#     try:
#
#         df =pd.read_sql('SELECT * FROM DatosEntrenamientoIA', con=ses_db_pacifico)
#         return data_preparation(df,data_set_name)
#
#     except ValueError as e:
#         raise TypeError(f"An error occurred while trying to prepare the data set for the data set: {data_set_name}. ERROR: {e}")


# def train_model(name_model:str):
#     """
#         calls the function that train model
#
#         Args:
#         name_model (str): name of model to be train
#
#     """
#     try:
#         t0 = time.perf_counter()
#         print("Training process started")
#         name_DB_PACIFICO = getProperty('DATABASESOURCENAME')
#         ses_db_pacifico = connect(name_DB_PACIFICO)
#
#         x_train,y_train= _preparate_data(ses_db_pacifico,'train')
#
#         train_models(x_train,y_train,name_model)
#
#         t1 = time.perf_counter()
#         print(f"Training process completed in {t1 - t0} sec")
#
#     except ValueError as e:
#         raise TypeError(f"an error occurred while trying to train the model : {name_model}. ERROR: {e}")
#     finally:
#         ses_db_pacifico.dispose()
#
#
#
# def validate_model(name_model:str):
#     """
#         calls the function that validate model
#
#         Args:
#         name_model (str): name of model to be validate
#
#     """
#
#     try:
#
#         name_DB_PACIFICO = getProperty('DATABASESOURCENAME')
#         ses_db_pacifico = connect(name_DB_PACIFICO)
#
#         x_test,y_test= _preparate_data(ses_db_pacifico,'test')
#
#         return  evaluate_model(x_test,y_test,name_model)
#
#     except ValueError as e:
#         raise TypeError(f"an error occurred while trying to validate the model : {name_model}. ERROR: {e}")
#     finally:
#         ses_db_pacifico.dispose()