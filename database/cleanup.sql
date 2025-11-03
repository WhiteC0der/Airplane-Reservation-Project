-- ============================================================================
-- Flight Booking System - Database Cleanup Script
-- ============================================================================
-- This script drops all database objects created by schema.sql
-- Run this script to completely remove the Flight Booking System database
-- WARNING: This will delete ALL data and cannot be undone!
-- ============================================================================

-- Disable foreign key constraints temporarily (Oracle specific)
SET CONSTRAINTS ALL DEFERRED;

-- ============================================================================
-- DROP VIEWS
-- ============================================================================
-- Drop views first as they depend on tables

BEGIN
    EXECUTE IMMEDIATE 'DROP VIEW user_bookings_view';
    DBMS_OUTPUT.PUT_LINE('✓ View USER_BOOKINGS_VIEW dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            DBMS_OUTPUT.PUT_LINE('⊘ View USER_BOOKINGS_VIEW does not exist');
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP VIEW available_flights';
    DBMS_OUTPUT.PUT_LINE('✓ View AVAILABLE_FLIGHTS dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            DBMS_OUTPUT.PUT_LINE('⊘ View AVAILABLE_FLIGHTS does not exist');
        END IF;
END;
/

-- ============================================================================
-- DROP INDEXES
-- ============================================================================
-- Drop indexes before dropping tables (indexes are dropped automatically with tables)
-- Oracle automatically drops indexes when tables are dropped, so we can skip this

-- ============================================================================
-- DROP TABLES
-- ============================================================================
-- Drop tables in reverse order of dependencies (child tables first)

-- Drop bookings table first (has foreign keys to users and flights)
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE bookings CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('✓ Table BOOKINGS dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN -- -942 = table does not exist
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping BOOKINGS: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Table BOOKINGS does not exist');
        END IF;
END;
/

-- Drop flights table (has foreign keys to aircraft and airports)
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE flights CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('✓ Table FLIGHTS dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping FLIGHTS: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Table FLIGHTS does not exist');
        END IF;
END;
/

-- Drop aircraft table
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE aircraft CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('✓ Table AIRCRAFT dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping AIRCRAFT: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Table AIRCRAFT does not exist');
        END IF;
END;
/

-- Drop airports table
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE airports CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('✓ Table AIRPORTS dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping AIRPORTS: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Table AIRPORTS does not exist');
        END IF;
END;
/

-- Drop users table
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE users CASCADE CONSTRAINTS';
    DBMS_OUTPUT.PUT_LINE('✓ Table USERS dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping USERS: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Table USERS does not exist');
        END IF;
END;
/

-- ============================================================================
-- DROP SEQUENCES
-- ============================================================================
-- Drop sequences used for auto-incrementing primary keys

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE bookings_seq';
    DBMS_OUTPUT.PUT_LINE('✓ Sequence BOOKINGS_SEQ dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -2289 THEN -- -2289 = sequence does not exist
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping BOOKINGS_SEQ: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Sequence BOOKINGS_SEQ does not exist');
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE flights_seq';
    DBMS_OUTPUT.PUT_LINE('✓ Sequence FLIGHTS_SEQ dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -2289 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping FLIGHTS_SEQ: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Sequence FLIGHTS_SEQ does not exist');
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE aircraft_seq';
    DBMS_OUTPUT.PUT_LINE('✓ Sequence AIRCRAFT_SEQ dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -2289 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping AIRCRAFT_SEQ: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Sequence AIRCRAFT_SEQ does not exist');
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE airports_seq';
    DBMS_OUTPUT.PUT_LINE('✓ Sequence AIRPORTS_SEQ dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -2289 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping AIRPORTS_SEQ: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Sequence AIRPORTS_SEQ does not exist');
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE users_seq';
    DBMS_OUTPUT.PUT_LINE('✓ Sequence USERS_SEQ dropped successfully');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -2289 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error dropping USERS_SEQ: ' || SQLERRM);
        ELSE
            DBMS_OUTPUT.PUT_LINE('⊘ Sequence USERS_SEQ does not exist');
        END IF;
END;
/

-- ============================================================================
-- COMMIT CHANGES
-- ============================================================================
COMMIT;

-- ============================================================================
-- CLEANUP COMPLETE
-- ============================================================================
-- All database objects have been removed
-- You can now run schema.sql to recreate the database structure
-- ============================================================================

PROMPT 
PROMPT ============================================================================
PROMPT Database cleanup completed successfully!
PROMPT All tables, sequences, views, and indexes have been dropped.
PROMPT You can now run schema.sql to recreate the database.
PROMPT ============================================================================
