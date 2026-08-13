BEGIN TRANSACTION;
CREATE TABLE bookings (
	id INTEGER NOT NULL, 
	customer_id INTEGER, 
	car_id INTEGER, 
	start_date VARCHAR, 
	end_date VARCHAR, 
	status VARCHAR, total_price FLOAT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(customer_id) REFERENCES customers (id), 
	FOREIGN KEY(car_id) REFERENCES cars (id)
);
CREATE TABLE cars (
	id INTEGER NOT NULL, 
	brand VARCHAR, 
	model VARCHAR, 
	year INTEGER, 
	price_per_day INTEGER, 
	transmission VARCHAR, 
	fuel_type VARCHAR, 
	seats INTEGER, 
	mileage FLOAT, 
	image VARCHAR, 
	PRIMARY KEY (id)
);
CREATE TABLE customers (
	id INTEGER NOT NULL, 
	name VARCHAR, 
	email VARCHAR, 
	phone VARCHAR, 
	PRIMARY KEY (id)
);
CREATE INDEX ix_cars_brand ON cars (brand);
CREATE INDEX ix_cars_id ON cars (id);
CREATE INDEX ix_cars_model ON cars (model);
CREATE INDEX ix_customers_id ON customers (id);
CREATE INDEX ix_customers_name ON customers (name);
CREATE UNIQUE INDEX ix_customers_email ON customers (email);
CREATE INDEX ix_bookings_id ON bookings (id);
COMMIT;
