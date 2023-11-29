from ia.jobs.ia_jobs import train_model, validate_model

def train_model_api_linear_regresion():
    train_model('linear_regresion')

def validate_model_api_linear_regresion():
    return validate_model('linear_regresion')

def train_model_api_random_forest():
    pass