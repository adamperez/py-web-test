from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


engine = create_engine('sqlite:///database.db')
Session = sessionmaker(bind=engine)
session = Session()
