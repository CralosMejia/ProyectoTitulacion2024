import time

from dependency_injector.wiring import inject, Provide
from fastapi import Depends

from app.business.MPD.mpd_Manager import MPD_Manager
from config.Containers.containers import Container


@inject
def training_model_demand(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.train_model_to_predict_demand()

@inject
def forcasting_demand(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.predict_demand()



@inject
def training_model_sales_trend(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.train_model_to_predict_trend_sales()


@inject
def forcasting_sales_trend(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.predict_trend_sales()


@inject
def process_complete(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    t0 = time.perf_counter()
    print("Process complete has started")
    mpd.run_etl()
    mpd.train_model_to_predict_demand()
    mpd.train_model_to_predict_trend_sales()
    mpd.predict_demand()
    mpd.predict_trend_sales()
    t1 = time.perf_counter()
    print(f"Process complete has finished in: {t1 - t0} sec")