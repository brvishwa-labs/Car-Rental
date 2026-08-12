from pydantic import BaseModel
from typing import Optional

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    price_per_day: int
    transmission: str
    fuel_type: str
    seats: int
    mileage: float
    image: str

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
    image: Optional[str] = None

class Car(CarBase):
    id: int

    class Config:
        orm_mode = True
