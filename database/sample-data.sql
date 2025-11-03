-- ============================================================================
-- Flight Booking System - Sample Data
-- ============================================================================
-- This script inserts sample data for testing the Flight Booking System
-- Includes sample users, airports, aircraft, flights, and bookings
-- ============================================================================

-- ============================================================================
-- SAMPLE USERS
-- ============================================================================
-- Insert sample users with hashed passwords (bcrypt hashes for 'password123')
-- Note: In production, passwords should be hashed by the application

INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number)
VALUES ('john_doe', 'john@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'John', 'Doe', '555-0001');

INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number)
VALUES ('jane_smith', 'jane@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'Jane', 'Smith', '555-0002');

INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number)
VALUES ('bob_wilson', 'bob@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'Bob', 'Wilson', '555-0003');

INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number)
VALUES ('alice_johnson', 'alice@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'Alice', 'Johnson', '555-0004');

-- Commit users data
COMMIT;

-- ============================================================================
-- SAMPLE AIRPORTS
-- ============================================================================
-- Insert major airports with real IATA codes and coordinates

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('John F. Kennedy International Airport', 'JFK', 'New York', 'United States', 40.639751, -73.778925, 'America/New_York');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Los Angeles International Airport', 'LAX', 'Los Angeles', 'United States', 33.942536, -118.408075, 'America/Los_Angeles');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('O''Hare International Airport', 'ORD', 'Chicago', 'United States', 41.978603, -87.904842, 'America/Chicago');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Miami International Airport', 'MIA', 'Miami', 'United States', 25.795865, -80.287046, 'America/New_York');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Logan International Airport', 'BOS', 'Boston', 'United States', 42.364506, -71.005181, 'America/New_York');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('San Francisco International Airport', 'SFO', 'San Francisco', 'United States', 37.621313, -122.378955, 'America/Los_Angeles');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Denver International Airport', 'DEN', 'Denver', 'United States', 39.861656, -104.673178, 'America/Denver');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Seattle-Tacoma International Airport', 'SEA', 'Seattle', 'United States', 47.449000, -122.309306, 'America/Los_Angeles');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Heathrow Airport', 'LHR', 'London', 'United Kingdom', 51.470022, -0.454296, 'Europe/London');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Charles de Gaulle Airport', 'CDG', 'Paris', 'France', 49.009722, 2.547778, 'Europe/Paris');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Berlin Brandenburg Airport', 'BER', 'Berlin', 'Germany', 52.366667, 13.503333, 'Europe/Berlin');

INSERT INTO airports (name, code, city, country, latitude, longitude, timezone)
VALUES ('Tokyo Haneda Airport', 'HND', 'Tokyo', 'Japan', 35.552250, 139.779602, 'Asia/Tokyo');

-- Commit airports data
COMMIT;

-- ============================================================================
-- SAMPLE AIRCRAFT
-- ============================================================================
-- Insert various aircraft models with different seat configurations

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Boeing 737-800', 'N12345', 180, 150, 24, 6, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Airbus A320', 'N23456', 150, 126, 20, 4, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Boeing 777-300ER', 'N34567', 350, 280, 50, 20, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Airbus A321', 'N45678', 200, 170, 24, 6, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Boeing 787-9 Dreamliner', 'N56789', 280, 224, 40, 16, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Airbus A350-900', 'N67890', 300, 246, 40, 14, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Boeing 737-900', 'N78901', 220, 186, 28, 6, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Airbus A330-300', 'N89012', 250, 210, 32, 8, 'ACTIVE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Boeing 747-400', 'N90123', 400, 330, 50, 20, 'MAINTENANCE');

INSERT INTO aircraft (aircraft_model, registration_number, total_seats, economy_seats, business_seats, first_class_seats, status)
VALUES ('Embraer E190', 'N01234', 100, 88, 12, 0, 'ACTIVE');

-- Commit aircraft data
COMMIT;

-- ============================================================================
-- SAMPLE FLIGHTS
-- ============================================================================
-- ============================================================================
-- SAMPLE FLIGHTS
-- ============================================================================
-- Insert sample flights with various routes and times, referencing airports and aircraft
-- Dates are set to future dates for testing

-- Domestic US Flights
INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('AA101', 'American Airlines', 1, 1, 2, 'New York', 'Los Angeles', SYSTIMESTAMP + 2, SYSTIMESTAMP + 2 + INTERVAL '5' HOUR, 180, 45, 299.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('UA202', 'United Airlines', 2, 3, 4, 'Chicago', 'Miami', SYSTIMESTAMP + 1, SYSTIMESTAMP + 1 + INTERVAL '3' HOUR, 150, 62, 199.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('DL303', 'Delta Airlines', 4, 5, 6, 'Boston', 'San Francisco', SYSTIMESTAMP + 3, SYSTIMESTAMP + 3 + INTERVAL '6' HOUR, 200, 78, 349.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('SW404', 'Southwest Airlines', 10, 7, 8, 'Denver', 'Seattle', SYSTIMESTAMP + 1.5, SYSTIMESTAMP + 1.5 + INTERVAL '2' HOUR, 100, 55, 149.99, 'ACTIVE');

-- International Flights
INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('BA505', 'British Airways', 3, 1, 9, 'New York', 'London', SYSTIMESTAMP + 4, SYSTIMESTAMP + 4 + INTERVAL '8' HOUR, 350, 120, 599.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('AF606', 'Air France', 5, 2, 10, 'Los Angeles', 'Paris', SYSTIMESTAMP + 5, SYSTIMESTAMP + 5 + INTERVAL '10' HOUR, 280, 95, 699.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('LH707', 'Lufthansa', 7, 3, 11, 'Chicago', 'Berlin', SYSTIMESTAMP + 2.5, SYSTIMESTAMP + 2.5 + INTERVAL '9' HOUR, 220, 110, 549.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('JL808', 'Japan Airlines', 6, 6, 12, 'San Francisco', 'Tokyo', SYSTIMESTAMP + 6, SYSTIMESTAMP + 6 + INTERVAL '11' HOUR, 300, 140, 799.99, 'ACTIVE');

-- Additional Domestic Flights
INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('AA909', 'American Airlines', 1, 2, 1, 'Los Angeles', 'New York', SYSTIMESTAMP + 7, SYSTIMESTAMP + 7 + INTERVAL '5' HOUR, 180, 92, 289.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('DL111', 'Delta Airlines', 7, 8, 7, 'Seattle', 'Denver', SYSTIMESTAMP + 3.5, SYSTIMESTAMP + 3.5 + INTERVAL '2' HOUR, 220, 165, 159.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('UA212', 'United Airlines', 8, 4, 3, 'Miami', 'Chicago', SYSTIMESTAMP + 4.5, SYSTIMESTAMP + 4.5 + INTERVAL '3' HOUR, 250, 188, 219.99, 'ACTIVE');

INSERT INTO flights (flight_number, airline_name, aircraft_id, departure_airport_id, arrival_airport_id, departure_city, arrival_city, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES ('SW313', 'Southwest Airlines', 10, 6, 2, 'San Francisco', 'Los Angeles', SYSTIMESTAMP + 2.2, SYSTIMESTAMP + 2.2 + INTERVAL '1' HOUR + INTERVAL '15' MINUTE, 100, 72, 99.99, 'ACTIVE');

-- Commit flights data
COMMIT;

-- ============================================================================
-- SAMPLE BOOKINGS
-- ============================================================================
-- Insert sample bookings linking users to flights
-- Using PL/SQL block to ensure proper user_id retrieval

SET SERVEROUTPUT ON;

DECLARE
    v_user_id_john NUMBER;
    v_user_id_jane NUMBER;
    v_user_id_bob NUMBER;
    v_user_id_alice NUMBER;
    v_user_count NUMBER;
BEGIN
    -- First, check if users exist
    SELECT COUNT(*) INTO v_user_count FROM users;
    DBMS_OUTPUT.PUT_LINE('Total users found: ' || v_user_count);
    
    IF v_user_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No users found in database. Please run users insert statements first.');
    END IF;
    
    -- Get user IDs with error handling for each
    BEGIN
        SELECT user_id INTO v_user_id_john FROM users WHERE username = 'john_doe';
        DBMS_OUTPUT.PUT_LINE('Found john_doe with ID: ' || v_user_id_john);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20002, 'User john_doe not found');
    END;
    
    BEGIN
        SELECT user_id INTO v_user_id_jane FROM users WHERE username = 'jane_smith';
        DBMS_OUTPUT.PUT_LINE('Found jane_smith with ID: ' || v_user_id_jane);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, 'User jane_smith not found');
    END;
    
    BEGIN
        SELECT user_id INTO v_user_id_bob FROM users WHERE username = 'bob_wilson';
        DBMS_OUTPUT.PUT_LINE('Found bob_wilson with ID: ' || v_user_id_bob);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20004, 'User bob_wilson not found');
    END;
    
    BEGIN
        SELECT user_id INTO v_user_id_alice FROM users WHERE username = 'alice_johnson';
        DBMS_OUTPUT.PUT_LINE('Found alice_johnson with ID: ' || v_user_id_alice);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20005, 'User alice_johnson not found');
    END;
    
    DBMS_OUTPUT.PUT_LINE('All users found successfully. Starting bookings insertion...');
    
    -- Insert bookings for john_doe
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_john, 1, '12A', 'CONFIRMED', 299.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 1 for john_doe');
    
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_john, 2, '5B', 'CONFIRMED', 199.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 2 for john_doe');
    
    -- Insert bookings for jane_smith
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_jane, 1, '15C', 'CONFIRMED', 299.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 1 for jane_smith');
    
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_jane, 3, '8A', 'CONFIRMED', 349.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 2 for jane_smith');
    
    -- Insert booking for bob_wilson
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_bob, 4, '22D', 'CONFIRMED', 149.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 1 for bob_wilson');
    
    -- Insert bookings for alice_johnson
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_alice, 5, '1A', 'CONFIRMED', 599.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 1 for alice_johnson');
    
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id_alice, 6, '10B', 'PENDING', 699.99);
    DBMS_OUTPUT.PUT_LINE('Inserted booking 2 for alice_johnson');
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('✓ Successfully inserted 7 bookings and committed!');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('✗ Error: ' || SQLERRM);
        DBMS_OUTPUT.PUT_LINE('Error Code: ' || SQLCODE);
        ROLLBACK;
        RAISE;
END;
/

-- ============================================================================
-- COMMIT CHANGES
-- ============================================================================
COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the sample data was inserted correctly

-- Count users
-- SELECT COUNT(*) as total_users FROM users;

-- Count airports
-- SELECT COUNT(*) as total_airports FROM airports;

-- Count aircraft
-- SELECT COUNT(*) as total_aircraft FROM aircraft;

-- Count flights
-- SELECT COUNT(*) as total_flights FROM flights;

-- Count bookings
-- SELECT COUNT(*) as total_bookings FROM bookings;

-- View all available flights with airport and aircraft details
-- SELECT * FROM available_flights;

-- View user booking history
-- SELECT * FROM user_bookings_view WHERE user_id = 1;

-- View flights by route
-- SELECT 
--     f.flight_number,
--     f.airline_name,
--     dep.code AS from_airport,
--     arr.code AS to_airport,
--     a.aircraft_model,
--     f.departure_time,
--     f.price
-- FROM flights f
-- JOIN airports dep ON f.departure_airport_id = dep.airport_id
-- JOIN airports arr ON f.arrival_airport_id = arr.airport_id
-- LEFT JOIN aircraft a ON f.aircraft_id = a.aircraft_id
-- ORDER BY f.departure_time;

-- View aircraft utilization
-- SELECT 
--     a.aircraft_model,
--     a.registration_number,
--     COUNT(f.flight_id) as total_flights,
--     a.status
-- FROM aircraft a
-- LEFT JOIN flights f ON a.aircraft_id = f.aircraft_id
-- GROUP BY a.aircraft_model, a.registration_number, a.status;

-- ============================================================================
-- SAMPLE DATA INSERTION COMPLETE
-- ============================================================================
