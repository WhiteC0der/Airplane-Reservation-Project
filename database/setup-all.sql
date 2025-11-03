-- ============================================================================
-- Complete Database Setup Script
-- ============================================================================
-- This script runs everything in the correct order:
-- 1. Cleanup (drop all existing objects)
-- 2. Schema creation (create tables, sequences, triggers)
-- 3. Sample data insertion
-- ============================================================================

PROMPT ============================================================================
PROMPT Step 1: Cleaning up existing database objects...
PROMPT ============================================================================

@@cleanup.sql

PROMPT 
PROMPT ============================================================================
PROMPT Step 2: Creating database schema...
PROMPT ============================================================================

@@schema.sql

PROMPT 
PROMPT ============================================================================
PROMPT Step 3: Inserting sample data...
PROMPT ============================================================================

@@sample-data.sql

PROMPT 
PROMPT ============================================================================
PROMPT Database setup complete!
PROMPT ============================================================================
PROMPT 
PROMPT You can now verify the data with these queries:
PROMPT 
PROMPT   SELECT COUNT(*) as total_users FROM users;
PROMPT   SELECT COUNT(*) as total_airports FROM airports;
PROMPT   SELECT COUNT(*) as total_aircraft FROM aircraft;
PROMPT   SELECT COUNT(*) as total_flights FROM flights;
PROMPT   SELECT COUNT(*) as total_bookings FROM bookings;
PROMPT   SELECT * FROM available_flights;
PROMPT 
PROMPT ============================================================================
