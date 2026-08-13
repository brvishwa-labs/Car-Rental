from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
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
    images = Column(JSON, default=[])

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    
    bookings = relationship("Booking", back_populates="customer")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    car_id = Column(Integer, ForeignKey("cars.id"))
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="Pending")
    
    customer = relationship("Customer", back_populates="bookings")
    car = relationship("Car")
