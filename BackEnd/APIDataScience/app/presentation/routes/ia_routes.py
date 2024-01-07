from fastapi import APIRouter

from app.presentation.controller.ia_controller import training_model_demand, forcasting_demand, \
    training_model_sales_trend, forcasting_sales_trend

ia_router = APIRouter()

@ia_router.get("/mpd/trainModelDemand")
async def train_model_demand():
    training_model_demand()
    return 'OK'


@ia_router.get("/mpd/forcastDemand")
async def forecast_demand():
    forcasting_demand()
    return 'OK'


@ia_router.get("/mpd/trainModelTrendSales")
async def forecast_demand():
    training_model_sales_trend()
    return 'OK'

@ia_router.get("/mpd/forcastTrendSales")
async def forecast_trend_sales():
    forcasting_sales_trend()
    return 'OK'