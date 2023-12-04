from typing import Type, List, Any
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class GenericRepository:
    def __init__(self, session: Session, model: Type[Base]):
        self.session = session
        self.model = model

    def create(self, entry_data: dict):
        try:
            entry = self.model(**entry_data)
            self.session.add(entry)
            self.session.commit()
            return entry
        except Exception as e:
            raise Exception(f"Error al crear una nueva entrada: {e}")

    def get_all(self) -> List[Base]:
        try:
            return self.session.query(self.model).all()
        except Exception as e:
            raise Exception(f"Error al obtener todas las entradas: {e}")

    def get_by_id(self, id: Any) -> Base:
        try:
            return self.session.query(self.model).get(id)
        except Exception as e:
            raise Exception(f"Error al obtener la entrada con ID {id}: {e}")

    def update(self, id: Any, updated_data: dict) -> Base:
        try:
            entry = self.session.query(self.model).get(id)
            if entry:
                for key, value in updated_data.items():
                    setattr(entry, key, value)
                self.session.commit()
                return entry
            return None
        except Exception as e:
            raise Exception(f"Error al actualizar la entrada con ID {id}: {e}")

    def delete(self, id: Any) -> bool:
        try:
            entry = self.session.query(self.model).get(id)
            if entry:
                self.session.delete(entry)
                self.session.commit()
                return True
            return False
        except Exception as e:
            raise Exception(f"Error al eliminar la entrada con ID {id}: {e}")

    def bulk_create(self, entries: List[dict]) -> List[Base]:
        try:
            entries_to_create = [self.model(**entry_data) for entry_data in entries]
            self.session.bulk_save_objects(entries_to_create)
            self.session.commit()
            return entries_to_create
        except Exception as e:
            raise Exception(f"Error al realizar inserción masiva: {e}")

    def get_all_by_field(self, field: str, value: Any) -> List[Base]:
        try:
            return self.session.query(self.model).filter(getattr(self.model, field) == value).all()
        except Exception as e:
            raise Exception(f"Error al obtener las entradas por {field}: {e}")

    def delete_all_by_field(self, field: str, value: Any) -> int:
        try:
            return self.session.query(self.model).filter(getattr(self.model, field) == value).delete()
        except Exception as e:
            raise Exception(f"Error al eliminar las entradas por {field}: {e}")

    def update_single_field_by_id(self, id_field: str, id_value: Any, field_to_update: str, new_value: Any) -> int:
        try:
            updated_count = self.session.query(self.model).filter(getattr(self.model, id_field) == id_value).update({field_to_update: new_value})
            self.session.commit()
            return updated_count
        except Exception as e:
            raise Exception(f"Error al actualizar la entrada con {id_field} = {id_value}: {e}")
