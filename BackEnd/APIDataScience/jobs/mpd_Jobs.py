# cron_jobs.py

import schedule
import threading
import time
import datetime

from dependency_injector.wiring import Provide, inject

from app.business.MPD.mpd_Manager import MPD_Manager
from config.Containers.containers import Container

@inject
def train_model(mpd: MPD_Manager = Provide[Container.mpd_manager]):
    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    if tomorrow.day == 1:
        mpd.train()

@inject
def run_etl(mpd: MPD_Manager = Provide[Container.mpd_manager]):
    mpd.run_etl()
@inject
def predict_demand(mpd: MPD_Manager = Provide[Container.mpd_manager]):
    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    if tomorrow.day == 1:
        mpd.predict_demand()

def prueba():
    print('funca los jobs')
def configure_cron_jobs():
    schedule.every().day.at("23:00").do(train_model)
    schedule.every().day.at("00:00").do(predict_demand)
    schedule.every().day.at("22:00").do(run_etl)
    #schedule.every(2).minutes.do(run_etl)



def start_cron_jobs():
    def run_schedule():
        while True:
            schedule.run_pending()
            time.sleep(1)

    tarea_hilo = threading.Thread(target=run_schedule)
    tarea_hilo.start()

    # tarea_hilo.join()

