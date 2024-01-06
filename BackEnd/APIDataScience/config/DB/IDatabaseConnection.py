from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class IDatabaseConnection(ABC):
    @abstractmethod
    def get_session(self) -> Session:
        pass

    @abstractmethod
    def close_session(self, session: Session):
        pass
