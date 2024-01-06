##-------------------------API
from dependency_injector.wiring import inject, Provide
from fastapi import FastAPI, Depends

from app.business.MPD.mpd_Manager import MPD_Manager
from app.presentation.routes.etls_routes import etls_router
from config.Containers.containers import  Container
from config.DB.db_config import db_etl_connection_str, db_pacific_connection_str, db_datascience_connection_str

from app.presentation.routes.ia_routes import ia_router
from jobs.mpd_Jobs import configure_cron_jobs, start_cron_jobs



def create_app() -> FastAPI:
    container = Container()
    container.config.from_dict({
        "etls_connection_string": db_etl_connection_str,
        "pacifico_connection_string": db_pacific_connection_str,
        "data_science_connection_string": db_datascience_connection_str,
    })

    app = FastAPI()
    app.container = container
    app.include_router(ia_router)
    app.include_router(etls_router)
    return app


#PRUEBAS
# @inject
# def run_etl_mpd_ctr(mpd: MPD_Manager = Provide[Container.mpd_manager]):
#     mpd.run_etl()
#     mpd.train()
#     mpd.predict_demand()
#     print('Funca')

app = create_app()
@app.on_event("startup")
async def startup_event():
    configure_cron_jobs()
    start_cron_jobs()



# run_etl_mpd_ctr()






