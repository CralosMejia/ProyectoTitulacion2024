from sqlalchemy import create_engine
from config.properties import getProperty

import traceback


class Db_Connection():
    

    def __init__(self, type, host, port, user, password, database):         
        self.connection = None
        self.type = type
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

    def start(self):      
        try:
            if self.type == 'mysql':
                db_connection_str = 'mysql+pymysql://'+self.user+':'+self.password+'@'+self.host+':'+self.port+'/'+self.database
                self.connection = create_engine(db_connection_str)
                return self.connection
            else:
                return -1
        except Exception as e:
            print('Error in connection\n'+str(e))
            return -2


def connect(db_Name):
    #Variable
    type= getProperty("TYPE")
    host= getProperty("HOST")
    port= getProperty("PORT")
    user= getProperty("USER")
    pwd=  getProperty("PASSWORD")
    db=   db_Name
    

    try:
        con_db = Db_Connection(type,host,port,user,pwd,db)
        ses_db = con_db.start()
        if ses_db == -1:
            raise Exception(f"the give database type {type} is not valid")
        elif ses_db == -2:
            raise Exception(f"Error trying to conect to database {db}")
        
        return ses_db
    except:
        traceback.print_exc()
        
