/**
 * Flight Controller - Handles flight search, listing, and management
 */

const db = require('../oracle-connection');

/**
 * Get all available flights
 */
async function getAllFlights() {
    try {
        const flights = await db.executeQuery(
            `SELECT flight_id, flight_number, airline_name, departure_city, arrival_city,
                    departure_time, arrival_time, total_seats, available_seats, price, status
             FROM flights
             WHERE status = 'ACTIVE'
             ORDER BY departure_time ASC`
        );

        return flights.map(flight => ({
            flightId: flight.FLIGHT_ID,
            flightNumber: flight.FLIGHT_NUMBER,
            airlineName: flight.AIRLINE_NAME,
            departureCity: flight.DEPARTURE_CITY,
            arrivalCity: flight.ARRIVAL_CITY,
            departureTime: flight.DEPARTURE_TIME,
            arrivalTime: flight.ARRIVAL_TIME,
            totalSeats: flight.TOTAL_SEATS,
            availableSeats: flight.AVAILABLE_SEATS,
            price: flight.PRICE,
            status: flight.STATUS
        }));
    } catch (error) {
        console.error('✗ Error fetching flights:', error.message);
        throw error;
    }
}

/**
 * Get flight by ID with detailed information
 */
async function getFlightById(flightId) {
    try {
        const flights = await db.executeQuery(
            `SELECT flight_id, flight_number, airline_name, departure_city, arrival_city,
                    departure_time, arrival_time, total_seats, available_seats, price, status
             FROM flights
             WHERE flight_id = :flightId`,
            [flightId]
        );

        if (flights.length === 0) {
            throw new Error('Flight not found');
        }

        const flight = flights[0];

        return {
            flightId: flight.FLIGHT_ID,
            flightNumber: flight.FLIGHT_NUMBER,
            airlineName: flight.AIRLINE_NAME,
            departureCity: flight.DEPARTURE_CITY,
            arrivalCity: flight.ARRIVAL_CITY,
            departureTime: flight.DEPARTURE_TIME,
            arrivalTime: flight.ARRIVAL_TIME,
            totalSeats: flight.TOTAL_SEATS,
            availableSeats: flight.AVAILABLE_SEATS,
            price: flight.PRICE,
            status: flight.STATUS
        };
    } catch (error) {
        console.error('✗ Error fetching flight:', error.message);
        throw error;
    }
}

/**
 * Search flights by criteria (departure city, arrival city, date)
 */
async function searchFlights(searchCriteria) {
    try {
        const { departureCity, arrivalCity, departureDate } = searchCriteria;

        if (!departureCity || !arrivalCity) {
            throw new Error('Departure and arrival cities are required');
        }

        let query = `SELECT flight_id, flight_number, airline_name, departure_city, arrival_city,
                           departure_time, arrival_time, total_seats, available_seats, price, status
                    FROM flights
                    WHERE status = 'ACTIVE'
                    AND available_seats > 0
                    AND LOWER(departure_city) = LOWER(:departureCity)
                    AND LOWER(arrival_city) = LOWER(:arrivalCity)`;

        const params = [departureCity, arrivalCity];

        // Add date filter if provided
        if (departureDate) {
            query += ` AND TRUNC(departure_time) = TRUNC(:departureDate)`;
            params.push(new Date(departureDate));
        }

        query += ` ORDER BY departure_time ASC`;

        const flights = await db.executeQuery(query, params);

        return flights.map(flight => ({
            flightId: flight.FLIGHT_ID,
            flightNumber: flight.FLIGHT_NUMBER,
            airlineName: flight.AIRLINE_NAME,
            departureCity: flight.DEPARTURE_CITY,
            arrivalCity: flight.ARRIVAL_CITY,
            departureTime: flight.DEPARTURE_TIME,
            arrivalTime: flight.ARRIVAL_TIME,
            totalSeats: flight.TOTAL_SEATS,
            availableSeats: flight.AVAILABLE_SEATS,
            price: flight.PRICE,
            status: flight.STATUS
        }));
    } catch (error) {
        console.error('✗ Error searching flights:', error.message);
        throw error;
    }
}

/**
 * Create a new flight (admin only)
 */
async function createFlight(flightData) {
    try {
        const {
            flightNumber,
            airlineName,
            departureCity,
            arrivalCity,
            departureTime,
            arrivalTime,
            totalSeats,
            price
        } = flightData;

        // Validate required fields
        if (!flightNumber || !airlineName || !departureCity || !arrivalCity ||
            !departureTime || !arrivalTime || !totalSeats || !price) {
            throw new Error('All flight fields are required');
        }

        // Validate seat count
        if (totalSeats <= 0) {
            throw new Error('Total seats must be greater than 0');
        }

        // Validate price
        if (price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        // Check if flight number already exists
        const existing = await db.executeQuery(
            'SELECT flight_id FROM flights WHERE flight_number = :flightNumber',
            [flightNumber]
        );

        if (existing.length > 0) {
            throw new Error('Flight number already exists');
        }

        // Insert new flight
        await db.executeUpdate(
            `INSERT INTO flights (flight_number, airline_name, departure_city, arrival_city,
                                 departure_time, arrival_time, total_seats, available_seats, price, status)
             VALUES (:flightNumber, :airlineName, :departureCity, :arrivalCity,
                     :departureTime, :arrivalTime, :totalSeats, :totalSeats, :price, 'ACTIVE')`,
            [flightNumber, airlineName, departureCity, arrivalCity, departureTime, arrivalTime, totalSeats, price]
        );

        // Retrieve created flight
        const newFlight = await db.executeQuery(
            'SELECT flight_id FROM flights WHERE flight_number = :flightNumber',
            [flightNumber]
        );

        console.log(`✓ Flight created: ${flightNumber}`);

        return await getFlightById(newFlight[0].FLIGHT_ID);
    } catch (error) {
        console.error('✗ Error creating flight:', error.message);
        throw error;
    }
}

/**
 * Update flight information (admin only)
 */
async function updateFlight(flightId, updateData) {
    try {
        const { airlineName, price, status } = updateData;

        const updates = [];
        const params = [];

        if (airlineName !== undefined) {
            updates.push('airline_name = :airlineName');
            params.push(airlineName);
        }

        if (price !== undefined) {
            if (price <= 0) {
                throw new Error('Price must be greater than 0');
            }
            updates.push('price = :price');
            params.push(price);
        }

        if (status !== undefined) {
            if (!['ACTIVE', 'CANCELLED', 'DELAYED'].includes(status)) {
                throw new Error('Invalid flight status');
            }
            updates.push('status = :status');
            params.push(status);
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        params.push(flightId);

        const updateQuery = `UPDATE flights SET ${updates.join(', ')}, updated_at = SYSTIMESTAMP WHERE flight_id = :flightId`;
        await db.executeUpdate(updateQuery, params);

        console.log(`✓ Flight updated: ${flightId}`);

        return await getFlightById(flightId);
    } catch (error) {
        console.error('✗ Error updating flight:', error.message);
        throw error;
    }
}

/**
 * Get booked seats for a flight
 */
async function getBookedSeats(flightId) {
    try {
        const seats = await db.executeQuery(
            `SELECT seat_number FROM bookings 
             WHERE flight_id = :flightId AND booking_status = 'CONFIRMED'`,
            [flightId]
        );

        return seats.map(seat => seat.SEAT_NUMBER);
    } catch (error) {
        console.error('✗ Error fetching booked seats:', error.message);
        throw error;
    }
}

module.exports = {
    getAllFlights,
    getFlightById,
    searchFlights,
    createFlight,
    updateFlight,
    getBookedSeats
};
