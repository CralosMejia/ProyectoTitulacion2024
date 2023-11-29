from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from config.properties import getProperty
import traceback

class Db_Connection:

    def __init__(self, type, host, port, user, password, database):
        self.engine = None
        self.Session = None
        self.type = type
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

    def start(self):
        try:
            if self.type == 'mysql':
                db_connection_str = f'mysql+pymysql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}'
                self.engine = create_engine(db_connection_str)
                self.Session = sessionmaker(bind=self.engine)
            else:
                raise ValueError(f"Database type {self.type} is not supported.")
        except Exception as e:
            print('Error in connection\n', e)
            traceback.print_exc()
            raise

    def get_session(self) -> Session:
        if not self.Session:
            self.start()
        return self.Session()

    def close_session(self, session: Session):
        session.close()

def connect(db_name):
    # Variables
    type = getProperty("TYPE")
    host = getProperty("HOST")
    port = getProperty("PORT")
    user = getProperty("USER")
    pwd = getProperty("PASSWORD")

    try:
        con_db = Db_Connection(type, host, port, user, pwd, db_name)
        con_db.start()
        return con_db
    except Exception as e:
        print(f"Error trying to connect to database {db_name}: {e}")
        traceback.print_exc()
        raise


