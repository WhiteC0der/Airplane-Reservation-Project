-- ============================================================================
-- Booking Insertion Helper Script
-- ============================================================================
-- This script helps you insert bookings safely by showing available users and flights
-- ============================================================================

SET SERVEROUTPUT ON SIZE UNLIMITED
SET LINESIZE 200

PROMPT ============================================================================
PROMPT STEP 1: Available Users
PROMPT ============================================================================
PROMPT
SELECT user_id, username, first_name || ' ' || last_name as full_name, email
FROM users
ORDER BY user_id;

PROMPT
PROMPT ============================================================================
PROMPT STEP 2: Available Flights (Future flights with available seats)
PROMPT ============================================================================
PROMPT
SELECT 
    flight_id,
    flight_number,
    airline_name,
    departure_city || ' → ' || arrival_city as route,
    TO_CHAR(departure_time, 'DD-MON HH24:MI') as departs,
    available_seats,
    price
FROM flights
WHERE status = 'ACTIVE'
  AND departure_time > SYSTIMESTAMP
  AND available_seats > 0
ORDER BY departure_time;

PROMPT
PROMPT ============================================================================
PROMPT STEP 3: Insert a New Booking
PROMPT ============================================================================
PROMPT
PROMPT Example: To insert a booking, use this format:
PROMPT
PROMPT   INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
PROMPT   VALUES (1, 1, '20A', 'CONFIRMED', 299.99);
PROMPT   COMMIT;
PROMPT
PROMPT Or use the safe method with username lookup:
PROMPT
PROMPT   INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
PROMPT   VALUES (
PROMPT       (SELECT user_id FROM users WHERE username = 'john_doe'),
PROMPT       1,
PROMPT       '20A',
PROMPT       'CONFIRMED',
PROMPT       299.99
PROMPT   );
PROMPT   COMMIT;
PROMPT
PROMPT ============================================================================
PROMPT STEP 4: Check Existing Bookings on a Flight
PROMPT ============================================================================
PROMPT
PROMPT To see which seats are already taken on a specific flight:
PROMPT
PROMPT   SELECT seat_number, u.username, b.booking_status
PROMPT   FROM bookings b
PROMPT   JOIN users u ON b.user_id = u.user_id
PROMPT   WHERE b.flight_id = 1
PROMPT   ORDER BY seat_number;
PROMPT
PROMPT ============================================================================
PROMPT Safe Booking Insertion with Error Checking
PROMPT ============================================================================
PROMPT
PROMPT Use this PL/SQL block for safe insertion:
PROMPT

-- Example of safe booking insertion
DECLARE
    v_user_id NUMBER;
    v_flight_id NUMBER := 3; -- Change this to desired flight_id
    v_username VARCHAR2(50) := 'bob_wilson'; -- Change this to desired username
    v_seat_number VARCHAR2(10) := '25C'; -- Change this to desired seat
    v_price NUMBER;
    v_available_seats NUMBER;
BEGIN
    -- Step 1: Get user_id
    BEGIN
        SELECT user_id INTO v_user_id 
        FROM users 
        WHERE username = v_username;
        DBMS_OUTPUT.PUT_LINE('✓ Found user: ' || v_username || ' (ID: ' || v_user_id || ')');
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20001, 'User "' || v_username || '" not found');
    END;
    
    -- Step 2: Check if flight exists and has available seats
    BEGIN
        SELECT price, available_seats INTO v_price, v_available_seats
        FROM flights
        WHERE flight_id = v_flight_id
          AND status = 'ACTIVE'
          AND departure_time > SYSTIMESTAMP;
        
        IF v_available_seats <= 0 THEN
            RAISE_APPLICATION_ERROR(-20002, 'Flight ' || v_flight_id || ' has no available seats');
        END IF;
        
        DBMS_OUTPUT.PUT_LINE('✓ Found flight ID: ' || v_flight_id || ' ($' || v_price || ', ' || v_available_seats || ' seats available)');
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, 'Flight ID ' || v_flight_id || ' not found or not available');
    END;
    
    -- Step 3: Check if seat is already taken
    DECLARE
        v_seat_check NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_seat_check
        FROM bookings
        WHERE flight_id = v_flight_id
          AND seat_number = v_seat_number;
        
        IF v_seat_check > 0 THEN
            RAISE_APPLICATION_ERROR(-20004, 'Seat ' || v_seat_number || ' is already booked on flight ' || v_flight_id);
        END IF;
        
        DBMS_OUTPUT.PUT_LINE('✓ Seat ' || v_seat_number || ' is available');
    END;
    
    -- Step 4: Insert the booking
    INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
    VALUES (v_user_id, v_flight_id, v_seat_number, 'CONFIRMED', v_price);
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('✓ Booking created successfully!');
    DBMS_OUTPUT.PUT_LINE('   Booking ID: ' || SQL%ROWCOUNT);
    DBMS_OUTPUT.PUT_LINE('   User: ' || v_username);
    DBMS_OUTPUT.PUT_LINE('   Flight: ' || v_flight_id);
    DBMS_OUTPUT.PUT_LINE('   Seat: ' || v_seat_number);
    DBMS_OUTPUT.PUT_LINE('   Price: $' || v_price);
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('✗ Error: ' || SQLERRM);
END;
/

PROMPT
PROMPT ============================================================================
PROMPT To use this script:
PROMPT 1. Edit the DECLARE section above to change:
PROMPT    - v_username (the user making the booking)
PROMPT    - v_flight_id (which flight to book)
PROMPT    - v_seat_number (which seat)
PROMPT 2. Run the script again
PROMPT ============================================================================
