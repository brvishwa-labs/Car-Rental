from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import uuid

import models, schemas
from database import engine, get_db

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="SanCars API", description="Backend for Pondicherry Car Rental Service")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to the SanCars API!"}

@app.get("/api/cars", response_model=List[schemas.Car])
def get_cars(db: Session = Depends(get_db)):
    cars = db.query(models.Car).all()
    return cars

@app.post("/api/cars", response_model=schemas.Car)
def create_car(
    brand: str = Form(...),
    model: str = Form(...),
    year: int = Form(...),
    price_per_day: int = Form(...),
    transmission: str = Form(...),
    fuel_type: str = Form(...),
    seats: int = Form(...),
    mileage: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_extension = image.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{file_name}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    db_car = models.Car(
        brand=brand,
        model=model,
        year=year,
        price_per_day=price_per_day,
        transmission=transmission,
        fuel_type=fuel_type,
        seats=seats,
        mileage=mileage,
        image=f"/{file_path}"
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@app.put("/api/cars/{car_id}", response_model=schemas.Car)
def update_car(
    car_id: int, 
    brand: Optional[str] = Form(None),
    model: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    price_per_day: Optional[int] = Form(None),
    transmission: Optional[str] = Form(None),
    fuel_type: Optional[str] = Form(None),
    seats: Optional[int] = Form(None),
    mileage: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    if brand is not None: db_car.brand = brand
    if model is not None: db_car.model = model
    if year is not None: db_car.year = year
    if price_per_day is not None: db_car.price_per_day = price_per_day
    if transmission is not None: db_car.transmission = transmission
    if fuel_type is not None: db_car.fuel_type = fuel_type
    if seats is not None: db_car.seats = seats
    if mileage is not None: db_car.mileage = mileage
    
    if image is not None:
        file_extension = image.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        db_car.image = f"/{file_path}"
    
    db.commit()
    db.refresh(db_car)
    return db_car

@app.delete("/api/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(db_car)
    db.commit()
    return {"message": "Car deleted successfully"}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_cars = db.query(models.Car).count()
    return {
        "total_cars": total_cars,
        "pending_bookings": 12, # mock data for now
        "total_revenue": 45000, # mock data for now
        "active_rentals": 5 # mock data for now
    }
