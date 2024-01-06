from fastapi import APIRouter
from app.presentation.controller.etls_controller import run_etl_mpd_ctr



etls_router = APIRouter()

@etls_router.get("/mpd/runEtl")
async def run_etl():
    run_etl_mpd_ctr()
    return 'The ETL process has been successfully executed.'


