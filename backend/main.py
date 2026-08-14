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
import auth

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="SanCars API", description="Backend for Pondicherry Car Rental Service")

origins = [
    "http://localhost:5173",
]
env_origins = os.getenv("CORS_ORIGINS")
if env_origins:
    origins.extend([o.strip() for o in env_origins.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    is_featured: Optional[bool] = Form(False),
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    image_paths = []
    for img in images:
        file_extension = img.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{file_name}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        image_paths.append(f"/{file_path}")
        
    db_car = models.Car(
        brand=brand,
        model=model,
        year=year,
        price_per_day=price_per_day,
        transmission=transmission,
        fuel_type=fuel_type,
        seats=seats,
        mileage=mileage,
        is_featured=is_featured,
        images=image_paths
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
    is_featured: Optional[bool] = Form(None),
    existing_images: Optional[List[str]] = Form(None),
    new_images: Optional[List[UploadFile]] = File(None),
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
    if is_featured is not None: db_car.is_featured = is_featured
    
    final_image_paths = existing_images if existing_images else []
    
    if new_images is not None:
        for img in new_images:
            if img.filename: # Make sure it's actually a file
                file_extension = img.filename.split(".")[-1]
                file_name = f"{uuid.uuid4()}.{file_extension}"
                file_path = f"uploads/{file_name}"
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(img.file, buffer)
                final_image_paths.append(f"/{file_path}")
                
    if existing_images is not None or new_images is not None:
        db_car.images = final_image_paths

    
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

# -----------------
# AUTH / CUSTOMER ENDPOINTS
# -----------------

@app.get("/api/auth/me")
def sync_user(name: str = None, decoded_token: dict = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    phone_number = decoded_token.get('phone_number')
    if not phone_number:
        raise HTTPException(status_code=400, detail="No phone number found in token")
        
    customer = db.query(models.Customer).filter(models.Customer.phone == phone_number).first()
    
    if not customer:
        # Create new customer automatically
        customer = models.Customer(
            name=name or "New User", # They can update this later
            phone=phone_number,
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    elif name and customer.name != name:
        # Update existing customer name if provided
        customer.name = name
        db.commit()
        db.refresh(customer)
        
    return {
        "id": customer.id,
        "name": customer.name,
        "phone": customer.phone,
        "email": customer.email,
        "uid": decoded_token.get('uid')
    }

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_cars = db.query(models.Car).count()
    pending_bookings = db.query(models.Booking).filter(models.Booking.status == "Pending").count()
    active_rentals = db.query(models.Booking).filter(models.Booking.status == "Approved").count()
    # Mock revenue for now as it would require calculating based on price and dates
    return {
        "total_cars": total_cars,
        "pending_bookings": pending_bookings,
        "total_revenue": 45000, 
        "active_rentals": active_rentals
    }

# --- CUSTOMERS ---

@app.get("/api/customers", response_model=List[schemas.Customer])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@app.post("/api/customers", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# --- BOOKINGS ---

@app.get("/api/bookings", response_model=List[schemas.Booking])
def get_bookings(customer_id: int = None, db: Session = Depends(get_db)):
    if customer_id:
        return db.query(models.Booking).filter(models.Booking.customer_id == customer_id).all()
    return db.query(models.Booking).all()

@app.post("/api/bookings", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.put("/api/bookings/{booking_id}", response_model=schemas.Booking)
def update_booking(booking_id: int, booking: schemas.BookingUpdate, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db_booking.status = booking.status
    db.commit()
    db.refresh(db_booking)
    return db_booking
