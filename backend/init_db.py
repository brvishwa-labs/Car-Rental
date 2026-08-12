from database import engine, Base
import models

print("Dropping existing database tables...")
Base.metadata.drop_all(bind=engine)
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
