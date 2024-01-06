from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from config.DB.IDatabaseConnection import IDatabaseConnection


class DatabaseConnection(IDatabaseConnection):
    def __init__(self, connection_string):
        self.engine = create_engine(connection_string)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def get_session(self) -> Session:
        return self.SessionLocal()

    def close_session(self, session: Session):
        session.close()
