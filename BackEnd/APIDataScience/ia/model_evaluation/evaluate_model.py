import os
import pickle
from keras.models import load_model
from joblib import  load
from sklearn.metrics import mean_squared_error, r2_score,mean_absolute_error
import time

def evaluate_model(X_test=None, y_test=None,name_model='linear_regresion'):
    """
        validate model and returns evaluation data result

        Args:
        X_train:  test data.
        y_train:  test data.

        Retruns:
            evaluation_data_result(dictionary): data to plot how well the model performs
    """
    t0 = time.perf_counter()
    print("Validate process started")

    evaluation_data_result = {}
    model_route = f'ia/models/trained_model_{name_model}.joblib'

    if os.path.exists(model_route):
        model = load(model_route)
    else:
        raise Exception("The model to be evaluated does not exist")
    
    if X_test is not None and y_test is not None:
        predictions = model.predict_ANN(X_test)
        mse = mean_squared_error(y_test, predictions)
        r2 = r2_score(y_test, predictions)
        evaluation_data_result = {
            "y_real": y_test.to_dict(),
            "predictions": dict(enumerate(predictions)),
            "mse": mse,
            "r2": r2
        }
    t1 = time.perf_counter()
    print(f"Validate process completed in {t1 - t0} sec")
    return evaluation_data_result


def evaluate_model_prophet(df_test,model_route):
    """
        Validate the trained Prophet model.

        Args:
            df_test(DataFrame): Test data to validate the model.
            model_route(str): Path to the saved Prophet model.

        Returns:
            dict: A dictionary containing validation metrics like MSE and MAE.
        """

    # Load the trained model
    if not os.path.exists(model_route):
        raise ValueError(f"Model not found at {model_route}")

    with open(model_route, 'rb') as file:
        modelo = pickle.load(file)

    future_df = df_test[df_test.columns.difference(['y'])]

    # Make predictions
    forecast = modelo.predict(future_df)

    # Align predictions with the test set
    y_true = df_test['y']
    y_pred = forecast['yhat'][-len(df_test):]

    # Calculate validation metrics
    mse = mean_squared_error(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)

    return mse,mae


def evaluate_model_ANN(x_val,y_val,model_route):
    """
        Validate the trained Prophet model.

        Args:
            df_test(DataFrame): Test data to validate the model.
            model_route(str): Path to the saved Prophet model.

        Returns:
            dict: A dictionary containing validation metrics like MSE and MAE.
        """

    # Load the trained model
    if not os.path.exists(model_route):
        raise ValueError(f"Model not found at {model_route}")

    model = load_model(model_route)

    y_pred = model.predict(x_val)

    mse = mean_squared_error(y_val, y_pred)
    mae = mean_absolute_error(y_val, y_pred)
    r2 = r2_score(y_val, y_pred)

    return mse,mae,r2


def evaluate_models(x_val,y_val,name_model='linear_regression'):
    """
        Validate the trained Prophet model.

        Args:
            df_test(DataFrame): Test data to validate the model.
            model_route(str): Path to the saved Prophet model.

        Returns:
            dict: A dictionary containing validation metrics like MSE and MAE.
        """

    # Load the trained model
    model_route = f"ia/models/trained_model_{name_model}.joblib"
    if not os.path.exists(model_route):
        raise ValueError(f"Model not found at {model_route}")

    with open(model_route, 'rb') as file:
        model = pickle.load(file)

    y_pred = model.predict(x_val)

    mse = mean_squared_error(y_val, y_pred)
    mae = mean_absolute_error(y_val, y_pred)
    r2 = r2_score(y_val, y_pred)

    return mse,mae,r2

