from fastapi import APIRouter
from app.presentation.controller.etls_controller import run_etl_mpd_ctr



etls_router = APIRouter()

@etls_router.get("/mpd/run")
async def run_etl():
    run_etl_mpd_ctr()
    return 'OK etl del Modulo de prediccion de demanda se ha ejecutado con exito'


