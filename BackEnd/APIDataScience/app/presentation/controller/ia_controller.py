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