from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

from api.managers.db_manager import engine

Base = declarative_base()


class Reservation(Base):
    __tablename__ = 'reservations'

    id = Column(Integer, primary_key=True, autoincrement=True)  # for longevity, use UUID (SQLite doesn't like them)
    name = Column(String)
    email = Column(String)
    party_size = Column(Integer)
    date = Column(String)
    time = Column(String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'party_size': self.party_size,
            'date': self.date,
            'time': self.time
        }


class Inventory(Base):
    __tablename__ = 'inventory'

    id = Column(Integer, primary_key=True, autoincrement=True)  # for longevity, use UUID (SQLite doesn't like them)
    date = Column(Integer)

    windows = relationship("InventoryWindow")

    # TODO: add relationship serializataion

    def serialize(self):
        return {
            'id': self.id,
            'date': self.date,
            'windows': [win.serialize() for win in self.windows]
        }


class InventoryWindow(Base):
    __tablename__ = 'inventory_windows'

    id = Column(Integer, primary_key=True, autoincrement=True)
    inventory_id = Column(Integer, ForeignKey('inventory.id'))
    max_res_count = Column(Integer)
    start_time = Column(String)
    end_time = Column(String)

    def serialize(self):
        return {
            'id': self.id,
            'max_res_count': self.max_res_count,
            'start_time': self.start_time,
            'end_time': self.end_time
        }


Base.metadata.create_all(engine)
