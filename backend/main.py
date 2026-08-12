from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SanCars API", description="Backend for Pondicherry Car Rental Service")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SanCars API!"}

@app.get("/api/cars")
def get_cars():
    # Temporary mock data until database is connected
    return [
        {
            "id": 1,
            "make": "Mahindra",
            "model": "Thar",
            "year": 2023,
            "price_per_day": 3500,
            "transmission": "Manual",
            "fuel_type": "Diesel",
            "seats": 4,
            "image": "https://images.unsplash.com/photo-1595058097051-5b77e8b625d9?auto=format&fit=crop&w=800&q=80"
        },
        {
            "id": 2,
            "make": "Hyundai",
            "model": "i20",
            "year": 2022,
            "price_per_day": 2000,
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "seats": 5,
            "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
        }
    ]
