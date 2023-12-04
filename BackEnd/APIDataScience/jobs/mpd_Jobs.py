# cron_jobs.py

import schedule
import threading
import time
import datetime

from app.business.MPD.mpd_Manager import MPD_Manager

mpdServ= MPD_Manager()
def train_model():
    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    if tomorrow.day == 1:
        mpdServ.train()

def run_etl():
    mpdServ.run_etl()

def predict_demand():
    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    if tomorrow.day == 1:
        mpdServ.predict_demand()

def prueba():
    print('funca los jobs')
def configure_cron_jobs():
    schedule.every().day.at("22:00").do(train_model)
    schedule.every().day.at("22:00").do(predict_demand)
    schedule.every().day.at("22:00").do(run_etl)
    #schedule.every(5).minutes.do(run_etl)



def start_cron_jobs():
    def run_schedule():
        while True:
            schedule.run_pending()
            time.sleep(1)

    tarea_hilo = threading.Thread(target=run_schedule)
    tarea_hilo.start()

