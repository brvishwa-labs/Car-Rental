from sqlalchemy import Column, Integer, String, Float
from database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    model = Column(String, index=True)
    year = Column(Integer)
    price_per_day = Column(Integer)
    transmission = Column(String)
    fuel_type = Column(String)
    seats = Column(Integer)
    mileage = Column(Float)
    image = Column(String)
