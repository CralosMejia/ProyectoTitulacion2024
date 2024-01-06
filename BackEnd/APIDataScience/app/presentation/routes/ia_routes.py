from fastapi import APIRouter

from app.presentation.controller.ia_controller import training_model, forcasting_demand

ia_router = APIRouter()

@ia_router.get("/mpd/trainModel")
async def train_model():
    training_model()
    return 'OK'


@ia_router.get("/mpd/forcast")
async def forecast_demand():
    forcasting_demand()
    return 'OK'