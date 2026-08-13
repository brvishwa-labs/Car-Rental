from pydantic import BaseModel
from typing import Optional, List

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    price_per_day: int
    transmission: str
    fuel_type: str
    seats: int
    mileage: float
    images: List[str] = []

class CarCreate(CarBase):
    pass

class CarUpdate(CarBase):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price_per_day: Optional[int] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    seats: Optional[int] = None
    mileage: Optional[float] = None
    images: Optional[List[str]] = None

class Car(CarBase):
    id: int

    class Config:
        orm_mode = True

class CustomerBase(BaseModel):
    name: str
    email: str
    phone: str

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class Customer(CustomerBase):
    id: int

    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    customer_id: int
    car_id: int
    start_date: str
    end_date: str
    status: Optional[str] = "Pending"

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: str

class Booking(BookingBase):
    id: int
    customer: Optional[Customer] = None
    car: Optional[Car] = None

    class Config:
        orm_mode = True
