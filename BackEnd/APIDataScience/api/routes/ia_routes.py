from fastapi import APIRouter
from api.controller.ia_controller import train_model_api_linear_regresion, validate_model_api_linear_regresion
import json



ia_router = APIRouter()

@ia_router.get("/trainLinear")
async def train_model_linear_regresion():
    train_model_api_linear_regresion()
    return "Se entreno con exito el modelo de Regresion Lienar"

@ia_router.get("/validateLinear")
async def train_model_linear_regresion():
    serialized = json.dumps(validate_model_api_linear_regresion())
    return serialized



@ia_router.get("/trainRandom")
async def train_model_random_forest():
    return 


