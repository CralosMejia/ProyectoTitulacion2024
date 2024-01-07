from app.data.GenericRepository import GenericRepository
from app.data.Models.RestaurantePacificoDB import Logsapp
import datetime as dt


class LoggerServices:

    def __init__(self,con_db_pacifico):
        self.con_db_pacifico = con_db_pacifico
        self.ses_db_pacifico = con_db_pacifico.get_session()
        self.repoLogger = GenericRepository(self.ses_db_pacifico, Logsapp)


    def addLog(self,description, system, module):
        log={
            'log_description':description,
            'fecha_log':dt.datetime.now(),
            'sistema':system,
            'modulo':module
        }
        self.repoLogger.create(log)
