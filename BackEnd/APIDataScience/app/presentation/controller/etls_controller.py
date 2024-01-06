from dependency_injector.wiring import inject, Provide
from fastapi import Depends

from app.business.MPD.mpd_Manager import MPD_Manager
from config.Containers.containers import Container


@inject
def run_etl_mpd_ctr(mpd: MPD_Manager = Depends(Provide[Container.mpd_manager])):
    mpd.run_etl()
    print('Funca')