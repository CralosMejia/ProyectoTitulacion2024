# cron_jobs.py

import schedule
import threading
import time
import datetime

from dependency_injector.wiring import Provide, inject

from app.business.MPD.mpd_Manager import MPD_Manager
from config.Containers.containers import Container

@inject
def process(mpd: MPD_Manager = Provide[Container.mpd_manager]):
    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    if tomorrow.day == 1:
        mpd.run_etl()
        mpd.train_model_to_predict_demand()
        mpd.train_model_to_predict_trend_sales()
        mpd.predict_demand()
        mpd.predict_trend_sales()
def prueba():
    print('funca los jobs')
def configure_cron_jobs():
    schedule.every().day.at("22:00").do(process)
    #schedule.every(2).minutes.do(run_etl)



def start_cron_jobs():
    def run_schedule():
        while True:
            schedule.run_pending()
            time.sleep(1)

    tarea_hilo = threading.Thread(target=run_schedule)
    tarea_hilo.start()

    # tarea_hilo.join()

