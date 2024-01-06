from dependency_injector.wiring import inject, Provide
from fastapi import Depends

from app.business.MPD.mpd_Manager import MPD_Manager
from config.Containers.containers import Container


@inject
def training_model(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.train()

@inject
def forcasting_demand(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.predict_demand()