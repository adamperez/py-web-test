from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

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
    max_reservations = Column(Integer)  # number of max reservations in a window
    curr_num_reservations = Column(Integer)     # current number of reservations
    inv_time_ceiling = Column(String)   # upper bound of inventory time
    inv_time_floor = Column(String)     # lower bound of inventory time

    # TODO: do i need a relationship for this & res?

    def serialize(self):
        return {
            'id': self.id,
            'max_reservations': self.max_reservations,
            'curr_num_reservations': self.curr_num_reservations,
            'inv_time_ceiling': self.inv_time_ceiling,
            'inv_time_floor': self.inv_time_floor
        }


Base.metadata.create_all(engine)
