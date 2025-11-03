-- ============================================================================
-- Verification Script - Check All Data
-- ============================================================================

SET LINESIZE 200
SET PAGESIZE 100

PROMPT ============================================================================
PROMPT Data Verification Report
PROMPT ============================================================================
PROMPT

-- Count all records
PROMPT 1. RECORD COUNTS:
PROMPT ==================
SELECT 'USERS' as table_name, COUNT(*) as total_records FROM users
UNION ALL
SELECT 'AIRPORTS', COUNT(*) FROM airports
UNION ALL
SELECT 'AIRCRAFT', COUNT(*) FROM aircraft
UNION ALL
SELECT 'FLIGHTS', COUNT(*) FROM flights
UNION ALL
SELECT 'BOOKINGS', COUNT(*) FROM bookings;

PROMPT
PROMPT 2. SAMPLE USERS:
PROMPT ================
SELECT user_id, username, email, first_name, last_name 
FROM users 
ORDER BY user_id;

PROMPT
PROMPT 3. AIRPORTS BY COUNTRY:
PROMPT =======================
SELECT country, COUNT(*) as airport_count 
FROM airports 
GROUP BY country 
ORDER BY airport_count DESC;

PROMPT
PROMPT 4. ACTIVE FLIGHTS (Next 7 Days):
PROMPT =================================
SELECT 
    flight_number,
    airline_name,
    departure_city || ' → ' || arrival_city as route,
    TO_CHAR(departure_time, 'DD-MON HH24:MI') as departs,
    available_seats,
    price
FROM flights
WHERE status = 'ACTIVE'
  AND departure_time > SYSTIMESTAMP
ORDER BY departure_time;

PROMPT
PROMPT 5. BOOKING SUMMARY BY USER:
PROMPT ============================
SELECT 
    u.username,
    COUNT(b.booking_id) as total_bookings,
    SUM(b.total_price) as total_spent,
    MAX(b.booking_date) as last_booking
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
GROUP BY u.username
ORDER BY total_bookings DESC;

PROMPT
PROMPT 6. AIRCRAFT UTILIZATION:
PROMPT ========================
SELECT 
    a.aircraft_model,
    a.registration_number,
    a.status,
    COUNT(f.flight_id) as scheduled_flights
FROM aircraft a
LEFT JOIN flights f ON a.aircraft_id = f.aircraft_id
GROUP BY a.aircraft_model, a.registration_number, a.status
ORDER BY scheduled_flights DESC;

PROMPT
PROMPT 7. DETAILED BOOKING VIEW:
PROMPT =========================
SELECT 
    b.booking_id,
    u.username,
    f.flight_number,
    f.departure_city || ' → ' || f.arrival_city as route,
    b.seat_number,
    b.booking_status,
    b.total_price
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN flights f ON b.flight_id = f.flight_id
ORDER BY b.booking_id;

PROMPT
PROMPT ============================================================================
PROMPT Verification Complete!
PROMPT ============================================================================
