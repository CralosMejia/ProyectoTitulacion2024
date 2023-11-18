

# from etl.jobs.etls_job import run_etl
#
# run_etl()


from config.properties import getProperty
from DB.connection import connect
import pandas as pd
import os
import pickle

from ia.data_preparation.data_preparation import preparate_train_data, preparate_inference_data, \
    preparate_train_data_prophet, preparate_inference_data_prophet
from ia.inference.predict_demand import predict_ANN, predict_prophet, predict_models
from ia.model_evaluation.evaluate_model import evaluate_model_prophet, evaluate_model_ANN, evaluate_models
from ia.model_training.training_model import train_models, train_model_prophet, train_model_ANN

name_DB_ETLS = getProperty('DATABASEETLS')
name_DB_PACIFICO = getProperty('DATABASESOURCENAME')
name_DB_DATASCIENCE = getProperty('DATABASEDSC')
model_route_prophet = getProperty('MODELROUTEPROPHET')
model_route_red_neuronal= getProperty('MODELROUTERN')

ses_db_etls = connect(name_DB_ETLS)
ses_db_pacifico = connect(name_DB_PACIFICO)
ses_db_data_science = connect(name_DB_DATASCIENCE)

df_fecha = pd.read_sql(f'SELECT * FROM DimFecha', con=ses_db_data_science)
df_producto = pd.read_sql(f'SELECT * FROM DimProducto', con=ses_db_data_science)
df_demanda = pd.read_sql(f'SELECT * FROM HechosDemandaProducto', con=ses_db_data_science)

####PROPHET
print('---------------------------------------------------------------------------------------')
print('Inicio proceso modelo prophet')
data_preparate_to_train_prophet_train,data_preparate_to_train_prophet_test=preparate_train_data_prophet(df_fecha, df_producto, df_demanda)
print('Data preparada para entrenar el modelo: PROPHET')
print(data_preparate_to_train_prophet_train.tail(10))
print('Data preparada para validar el modelo: PROPHET')
print(data_preparate_to_train_prophet_test.tail(10))

#print('Etrenando modelo prophet.......')
#train_model_prophet(data_preparate_to_train_prophet_train, model_route_prophet)

print('Validando el modelo PROPHET')
mse_p,mae_p=evaluate_model_prophet(data_preparate_to_train_prophet_test,model_route_prophet)
print(f'Error cuadrático medio(MSE) modelo PROPHET:{mse_p}')
print(f'Error absoluto medio modelo(MEA) PROPHET:{mae_p}')


data_preparate_to_predict_prophet=preparate_inference_data_prophet('2023-10-12',df_producto,30)
print('Data preparada para predecir el modelo: PROPHET')
print(data_preparate_to_predict_prophet.tail(10))

data_predicted_prophet=predict_prophet(data_preparate_to_predict_prophet,model_route_prophet)
print('Data predecida por el modelo: PROPHET')
print(data_predicted_prophet.tail(10))

print('fin proceso modelo prophet')
print('---------------------------------------------------------------------------------------')

# ###RED NEURONAL
print('---------------------------------------------------------------------------------------')
print('Inicio proceso modelo red neuronal')

(data_preparate_to_predict_neuronal_red_x_train,
 data_preparate_to_predict_neuronal_red_y_train,
 data_preparate_to_predict_neuronal_red_x_test,
 data_preparate_to_predict_neuronal_red_y_test
 )=preparate_train_data(df_fecha,df_producto,df_demanda)
print('Data preparada X para entrenar el modelo: RED NEURONAL')
print(data_preparate_to_predict_neuronal_red_x_train.tail(10))
print('Data preparada Y para entrenar el modelo: RED NEURONAL')
print(data_preparate_to_predict_neuronal_red_y_train.tail(10))

print('Data preparada X para validar el modelo: RED NEURONAL')
print(data_preparate_to_predict_neuronal_red_x_test.tail(10))
print('Data preparada Y para validar el modelo: RED NEURONAL')
print(data_preparate_to_predict_neuronal_red_y_test.tail(10))

#print('Etrenando modelo RED NEURONAL.......')
#train_model_ANN(data_preparate_to_predict_neuronal_red_x_train, data_preparate_to_predict_neuronal_red_y_train, model_route_red_neuronal)

print('Validando el modelo Red neuronal')
mse_ann,mae_ann,r2_ann=evaluate_model_ANN(data_preparate_to_predict_neuronal_red_x_test,data_preparate_to_predict_neuronal_red_y_test,model_route_red_neuronal)
print(f'Error cuadrático medio(MSE) modelo Red neuronal:{mse_ann}')
print(f'Error absoluto medio modelo(MEA) Red neuronal:{mae_ann}')
print(f'Coeficiente de Determinación(R2) Red neuronal:{r2_ann}')

data_preparate_to_predict_neuronal_red=preparate_inference_data('2023-10-12',df_producto,30)
print('Data preparada para predecir el modelo: RED NEURONAL')
print(data_preparate_to_predict_neuronal_red.tail(10))

data_predicted_neuronal_red=predict_ANN(data_preparate_to_predict_neuronal_red, model_route_red_neuronal)
print('Data predecida por el modelo: RED NEURONAL')
print(data_predicted_neuronal_red.tail(10))


print('fin proceso modelo red neuronal')
print('---------------------------------------------------------------------------------------')
# ###REGRESION LINEAL - ARBOLES ALEATOREOS
# ### REGRESION LINEAL

print('---------------------------------------------------------------------------------------')
print('Inicio proceso modelo regresion lienal')

(data_preparate_to_predict_regresion_lienal_x_train,
 data_preparate_to_predict_regresion_lineal_y_train,
 data_preparate_to_predict_regresion_lienal_x_test,
 data_preparate_to_predict_regresion_lineal_y_test
 )=preparate_train_data(df_fecha,df_producto,df_demanda)
print('Data preparada X para entrenar el modelo: REGRESION LINEAL')
print(data_preparate_to_predict_regresion_lienal_x_train.tail(10))
print('Data preparada Y para entrenar el modelo: REGRESION LINEAL')
print(data_preparate_to_predict_regresion_lineal_y_train.tail(10))
print('Data preparada X para validar el modelo: REGRESION LINEAL')
print(data_preparate_to_predict_regresion_lienal_x_test.tail(10))
print('Data preparada Y para validar el modelo: REGRESION LINEAL')
print(data_preparate_to_predict_regresion_lineal_y_test.tail(10))

# print('Etrenando modelo REGRESION LINEAL.......')
# train_models(data_preparate_to_predict_regresion_lienal_x_train,data_preparate_to_predict_regresion_lineal_y_train)


print('Validando el modelo Regresion linear')
mse_lr,mae_lr,r2_lr=evaluate_models(data_preparate_to_predict_regresion_lienal_x_test,data_preparate_to_predict_regresion_lineal_y_test)
print(f'Error cuadrático medio(MSE) modelo Regresion linear:{mse_lr}')
print(f'Error absoluto medio modelo(MEA) Regresion linear:{mae_lr}')
print(f'Coeficiente de Determinación(R2) Regresion linear:{r2_lr}')

data_preparate_to_predict_regresion_lineal=preparate_inference_data('2023-10-12',df_producto,30)
print('Data preparada para predecir el modelo: REGRESION LINEAL')
print(data_preparate_to_predict_regresion_lineal.tail(10))


data_predicted_regresion_lineal=predict_models(data_preparate_to_predict_regresion_lineal)
print('Data predecida por el modelo: REGRESION LINEAL')
print(data_predicted_regresion_lineal.tail(10))


print('fin proceso modelo regresion lineal')
print('---------------------------------------------------------------------------------------')
#
# ### Random Forest

print('---------------------------------------------------------------------------------------')
print('Inicio proceso modelo arboles aleatorios')

(data_preparate_to_predict_random_forest_x_train,
 data_preparate_to_predict_random_forest_y_train,
 data_preparate_to_predict_random_forest_x_test,
 data_preparate_to_predict_random_forest_y_test)=preparate_train_data(df_fecha,df_producto,df_demanda)
print('Data preparada X para predecir el modelo: RANDOM FOREST')
print(data_preparate_to_predict_random_forest_x_train.tail(10))
print('Data preparada Y para predecir el modelo: RANDOM FOREST')
print(data_preparate_to_predict_random_forest_y_train.tail(10))
print('Data preparada X para validar el modelo: RANDOM FOREST')
print(data_preparate_to_predict_random_forest_x_test.tail(10))
print('Data preparada Y para validar el modelo: RANDOM FOREST')
print(data_preparate_to_predict_random_forest_y_test.tail(10))

# print('Etrenando modelo RANDOM FOREST.......')
# train_models(data_preparate_to_predict_random_forest_x_train,data_preparate_to_predict_random_forest_y_train,'random_forest')


print('Validando el modelo RANDOM FOREST')
mse_rf,mae_rf,r2_rf=evaluate_models(data_preparate_to_predict_random_forest_x_test,data_preparate_to_predict_random_forest_y_test)
print(f'Error cuadrático medio(MSE) modelo RANDOM FOREST:{mse_rf}')
print(f'Error absoluto medio modelo(MEA) RANDOM FOREST:{mae_rf}')
print(f'Coeficiente de Determinación(R2) RANDOM FOREST:{r2_rf}')

data_preparate_to_predict_random_forest=preparate_inference_data('2023-10-12',df_producto,30)
print('Data preparada para predecir el modelo: RANDOM FOREST')
print(data_preparate_to_predict_random_forest.tail(10))


data_predicted_random_forest=predict_models(data_preparate_to_predict_random_forest,'random_forest')
print('Data predecida por el modelo: RANDOM FOREST')
print(data_predicted_random_forest.tail(10))


print('fin proceso modelo arboles aleatorios')
print('---------------------------------------------------------------------------------------')
