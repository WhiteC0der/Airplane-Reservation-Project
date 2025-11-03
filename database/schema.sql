-- ============================================================================
-- Flight Booking System - Oracle Database Schema
-- ============================================================================
-- This script creates the complete database schema for the Flight Booking System
-- Includes tables for Users, Flights, and Bookings with proper constraints
-- ============================================================================

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Purpose: Store user account information
-- Constraints:
--   - user_id: Primary key, auto-incremented
--   - username: Unique, not null (prevents duplicate accounts)
--   - email: Unique, not null (for communication and password recovery)
--   - password_hash: Not null (bcrypt hashed password)
--   - created_at: Timestamp of account creation
--   - updated_at: Timestamp of last update
-- ============================================================================
CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    first_name VARCHAR2(50),
    last_name VARCHAR2(50),
    phone_number VARCHAR2(20),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT users_email_format CHECK (email LIKE '%@%.%')
);

-- Create sequence for auto-incrementing user_id
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

-- Create trigger to auto-increment user_id
CREATE OR REPLACE TRIGGER users_id_trigger
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF :NEW.user_id IS NULL THEN
        SELECT users_seq.NEXTVAL INTO :NEW.user_id FROM dual;
    END IF;
END;
/

-- ============================================================================
-- AIRPORTS TABLE
-- ============================================================================
-- Purpose: Store airport information for departure and arrival locations
-- Constraints:
--   - airport_id: Primary key, auto-incremented
--   - code: Unique airport code (IATA), not null (e.g., 'LAX', 'JFK')
--   - name: Airport full name
--   - city: City where airport is located
--   - country: Country where airport is located
--   - latitude/longitude: Geographic coordinates for mapping
--   - timezone: Timezone information
-- ============================================================================
CREATE TABLE airports (
    airport_id NUMBER PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    code VARCHAR2(5) UNIQUE NOT NULL,
    city VARCHAR2(100) NOT NULL,
    country VARCHAR2(100) NOT NULL,
    latitude NUMBER(9,6),
    longitude NUMBER(9,6),
    timezone VARCHAR2(100),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

-- Create sequence for auto-incrementing airport_id
CREATE SEQUENCE airports_seq START WITH 1 INCREMENT BY 1;

-- Create trigger to auto-increment airport_id
CREATE OR REPLACE TRIGGER airports_id_trigger
BEFORE INSERT ON airports
FOR EACH ROW
BEGIN
    IF :NEW.airport_id IS NULL THEN
        SELECT airports_seq.NEXTVAL INTO :NEW.airport_id FROM dual;
    END IF;
END;
/

-- ============================================================================
-- AIRCRAFT TABLE
-- ============================================================================
-- Purpose: Store aircraft information and seating configurations
-- Constraints:
--   - aircraft_id: Primary key, auto-incremented
--   - registration_number: Unique aircraft registration, not null
--   - aircraft_model: Model/type of aircraft
--   - total_seats: Must equal sum of economy, business, and first class seats
--   - seat counts: Number of seats in each class
--   - status: ACTIVE/MAINTENANCE/RETIRED
-- ============================================================================
CREATE TABLE aircraft (
    aircraft_id NUMBER PRIMARY KEY,
    aircraft_model VARCHAR2(50) NOT NULL,
    registration_number VARCHAR2(20) UNIQUE NOT NULL,
    total_seats NUMBER NOT NULL,
    economy_seats NUMBER NOT NULL,
    business_seats NUMBER NOT NULL,
    first_class_seats NUMBER NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT chk_aircraft_status CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'RETIRED')),
    CONSTRAINT chk_total_seats CHECK (total_seats = economy_seats + business_seats + first_class_seats),
    CONSTRAINT chk_seats_positive CHECK (total_seats > 0 AND economy_seats >= 0 AND business_seats >= 0 AND first_class_seats >= 0)
);

-- Create sequence for auto-incrementing aircraft_id
CREATE SEQUENCE aircraft_seq START WITH 1 INCREMENT BY 1;

-- Create trigger to auto-increment aircraft_id
CREATE OR REPLACE TRIGGER aircraft_id_trigger
BEFORE INSERT ON aircraft
FOR EACH ROW
BEGIN
    IF :NEW.aircraft_id IS NULL THEN
        SELECT aircraft_seq.NEXTVAL INTO :NEW.aircraft_id FROM dual;
    END IF;
END;
/

-- ============================================================================
-- FLIGHTS TABLE
-- ============================================================================
-- Purpose: Store flight information and seat availability
-- Constraints:
--   - flight_id: Primary key, auto-incremented
--   - flight_number: Unique, not null (airline flight identifier)
--   - aircraft_id: Foreign key to aircraft table
--   - departure_airport_id: Foreign key to airports table (origin)
--   - arrival_airport_id: Foreign key to airports table (destination)
--   - departure_city: Not null (origin city)
--   - arrival_city: Not null (destination city)
--   - departure_time: Not null (must be in future)
--   - arrival_time: Not null (must be after departure)
--   - total_seats: Not null (must be positive)
--   - available_seats: Not null (must be <= total_seats)
--   - price: Not null (must be positive)
--   - status: Active/Cancelled/Delayed
-- ============================================================================
CREATE TABLE flights (
    flight_id NUMBER PRIMARY KEY,
    flight_number VARCHAR2(20) NOT NULL UNIQUE,
    airline_name VARCHAR2(100) NOT NULL,
    aircraft_id NUMBER,
    departure_airport_id NUMBER,
    arrival_airport_id NUMBER,
    departure_city VARCHAR2(50) NOT NULL,
    arrival_city VARCHAR2(50) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    total_seats NUMBER NOT NULL,
    available_seats NUMBER NOT NULL,
    price NUMBER(10, 2) NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    -- Foreign key constraints
    CONSTRAINT flights_aircraft_fk FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id),
    CONSTRAINT flights_dep_airport_fk FOREIGN KEY (departure_airport_id) REFERENCES airports(airport_id),
    CONSTRAINT flights_arr_airport_fk FOREIGN KEY (arrival_airport_id) REFERENCES airports(airport_id),
    -- Validation constraints
    CONSTRAINT flt_total_seats_pos CHECK (total_seats > 0),
    CONSTRAINT flt_avail_seats_valid CHECK (available_seats >= 0 AND available_seats <= total_seats),
    CONSTRAINT flt_price_pos CHECK (price > 0),
    CONSTRAINT flt_arrival_after_dep CHECK (arrival_time > departure_time),
    CONSTRAINT flt_status_valid CHECK (status IN ('ACTIVE', 'CANCELLED', 'DELAYED')),
    CONSTRAINT flt_different_airports CHECK (departure_airport_id != arrival_airport_id)
);

-- Create sequence for auto-incrementing flight_id
CREATE SEQUENCE flights_seq START WITH 1 INCREMENT BY 1;

-- Create trigger to auto-increment flight_id
CREATE OR REPLACE TRIGGER flights_id_trigger
BEFORE INSERT ON flights
FOR EACH ROW
BEGIN
    IF :NEW.flight_id IS NULL THEN
        SELECT flights_seq.NEXTVAL INTO :NEW.flight_id FROM dual;
    END IF;
END;
/

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
-- Purpose: Store booking records linking users to flights
-- Constraints:
--   - booking_id: Primary key, auto-incremented
--   - user_id: Foreign key to users table (not null)
--   - flight_id: Foreign key to flights table (not null)
--   - seat_number: Unique per flight (prevents double booking)
--   - booking_status: CONFIRMED/CANCELLED/PENDING
--   - booking_date: Timestamp of booking creation
--   - total_price: Price at time of booking
-- ============================================================================
CREATE TABLE bookings (
    booking_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    flight_id NUMBER NOT NULL,
    seat_number VARCHAR2(10) NOT NULL,
    booking_status VARCHAR2(20) DEFAULT 'CONFIRMED',
    total_price NUMBER(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    -- Foreign key constraints
    CONSTRAINT bookings_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT bookings_flight_fk FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    -- Unique constraint: one seat per flight can only be booked once
    CONSTRAINT bookings_seat_unique UNIQUE (flight_id, seat_number),
    -- Validation constraints
    CONSTRAINT bookings_status_valid CHECK (booking_status IN ('CONFIRMED', 'CANCELLED', 'PENDING')),
    CONSTRAINT bookings_price_positive CHECK (total_price > 0)
);

-- Create sequence for auto-incrementing booking_id
CREATE SEQUENCE bookings_seq START WITH 1 INCREMENT BY 1;

-- Create trigger to auto-increment booking_id
CREATE OR REPLACE TRIGGER bookings_id_trigger
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF :NEW.booking_id IS NULL THEN
        SELECT bookings_seq.NEXTVAL INTO :NEW.booking_id FROM dual;
    END IF;
END;
/

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Create indexes on frequently queried columns for faster lookups

-- Index for user lookups by username (used during login)
CREATE INDEX idx_users_username ON users(username);

-- Index for user lookups by email
CREATE INDEX idx_users_email ON users(email);

-- Index for airport lookups by code
CREATE INDEX idx_airports_code ON airports(code);

-- Index for airport lookups by city
CREATE INDEX idx_airports_city ON airports(city);

-- Index for aircraft lookups by registration number
CREATE INDEX idx_aircraft_reg ON aircraft(registration_number);

-- Index for aircraft lookups by status
CREATE INDEX idx_aircraft_status ON aircraft(status);

-- Index for flight searches by route
CREATE INDEX idx_flights_route ON flights(departure_city, arrival_city);

-- Index for flight searches by airports
CREATE INDEX idx_flights_airports ON flights(departure_airport_id, arrival_airport_id);

-- Index for flight searches by departure time
CREATE INDEX idx_flights_departure ON flights(departure_time);

-- Index for flight searches by aircraft
CREATE INDEX idx_flights_aircraft ON flights(aircraft_id);

-- Index for booking lookups by user
CREATE INDEX idx_bookings_user ON bookings(user_id);

-- Index for booking lookups by flight
CREATE INDEX idx_bookings_flight ON bookings(flight_id);

-- Index for booking lookups by status
CREATE INDEX idx_bookings_status ON bookings(booking_status);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for available flights (active flights with available seats)
CREATE OR REPLACE VIEW available_flights AS
SELECT 
    f.flight_id,
    f.flight_number,
    f.airline_name,
    f.departure_city,
    f.arrival_city,
    dep_apt.code AS departure_airport_code,
    dep_apt.name AS departure_airport_name,
    arr_apt.code AS arrival_airport_code,
    arr_apt.name AS arrival_airport_name,
    f.departure_time,
    f.arrival_time,
    f.available_seats,
    f.total_seats,
    f.price,
    ac.aircraft_model,
    ac.registration_number
FROM flights f
LEFT JOIN airports dep_apt ON f.departure_airport_id = dep_apt.airport_id
LEFT JOIN airports arr_apt ON f.arrival_airport_id = arr_apt.airport_id
LEFT JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
WHERE f.status = 'ACTIVE' 
  AND f.available_seats > 0
  AND f.departure_time > SYSTIMESTAMP;

-- View for user booking history with flight details
CREATE OR REPLACE VIEW user_bookings_view AS
SELECT 
    b.booking_id,
    b.user_id,
    u.username,
    u.email,
    b.flight_id,
    f.flight_number,
    f.airline_name,
    f.departure_city,
    f.arrival_city,
    dep_apt.code AS departure_airport_code,
    arr_apt.code AS arrival_airport_code,
    f.departure_time,
    f.arrival_time,
    b.seat_number,
    b.booking_status,
    b.total_price,
    b.booking_date,
    ac.aircraft_model
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN flights f ON b.flight_id = f.flight_id
LEFT JOIN airports dep_apt ON f.departure_airport_id = dep_apt.airport_id
LEFT JOIN airports arr_apt ON f.arrival_airport_id = arr_apt.airport_id
LEFT JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id;

-- ============================================================================
-- COMMIT CHANGES
-- ============================================================================
COMMIT;

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================
-- The schema is now ready for use. Key features:
-- 1. Referential integrity through foreign keys
-- 2. Data validation through check constraints
-- 3. Unique constraints prevent duplicates
-- 4. Indexes for performance optimization
-- 5. Views for common query patterns
-- 6. Sequences for auto-incrementing IDs
-- ============================================================================
