/**
 * Booking Controller - Handles booking creation, retrieval, and cancellation
 * Implements transactional booking to ensure data consistency
 */

const db = require('../oracle-connection');

/**
 * Create a new booking with transaction support
 * Ensures seat availability and updates flight atomically
 */
async function createBooking(bookingData) {
    try {
        const { userId, flightId, seatNumber } = bookingData;

        if (!userId || !flightId || !seatNumber) {
            throw new Error('User ID, flight ID, and seat number are required');
        }

        // Validate seat number format
        if (!/^[A-Z]\d+$/.test(seatNumber)) {
            throw new Error('Invalid seat number format (e.g., A1, B12)');
        }

        // Execute booking as a transaction to ensure consistency
        const result = await db.executeTransaction(async (connection) => {
            // First, verify the user exists
            const userResult = await connection.execute(
                `SELECT user_id, username FROM users WHERE user_id = :userId`,
                { userId: userId },
                { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
            );

            if (userResult.rows.length === 0) {
                throw new Error(`User ID ${userId} not found in database. Please log in again.`);
            }

            console.log(`✓ User verified: ${userResult.rows[0].USERNAME} (ID: ${userId})`);

            // Lock flight row and check availability
            const flightResult = await connection.execute(
                `SELECT flight_id, available_seats, price FROM flights 
                 WHERE flight_id = :flightId AND status = 'ACTIVE' FOR UPDATE`,
                { flightId: flightId },
                { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
            );

            if (flightResult.rows.length === 0) {
                throw new Error('Flight not found or is not active');
            }

            const flight = flightResult.rows[0];

            // Check if seats are available
            if (flight.AVAILABLE_SEATS <= 0) {
                throw new Error('No seats available on this flight');
            }

            // Check if seat is already booked
            const seatResult = await connection.execute(
                `SELECT booking_id FROM bookings 
                 WHERE flight_id = :flightId AND seat_number = :seatNumber AND booking_status = 'CONFIRMED'`,
                { flightId: flightId, seatNumber: seatNumber },
                { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
            );

            if (seatResult.rows.length > 0) {
                throw new Error('Seat already booked');
            }

            // Create booking
            await connection.execute(
                `INSERT INTO bookings (user_id, flight_id, seat_number, booking_status, total_price)
                 VALUES (:userId, :flightId, :seatNumber, 'CONFIRMED', :price)`,
                {
                    userId: userId,
                    flightId: flightId,
                    seatNumber: seatNumber,
                    price: flight.PRICE
                }
            );

            // Get the booking ID that was just created
            const bookingIdResult = await connection.execute(
                `SELECT * FROM (
                    SELECT booking_id FROM bookings 
                    WHERE user_id = :userId AND flight_id = :flightId AND seat_number = :seatNumber 
                    AND booking_status = 'CONFIRMED'
                    ORDER BY booking_date DESC
                 ) WHERE ROWNUM = 1`,
                {
                    userId: userId,
                    flightId: flightId,
                    seatNumber: seatNumber
                },
                { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
            );

            const bookingId = bookingIdResult.rows[0].BOOKING_ID;

            // Update available seats
            await connection.execute(
                `UPDATE flights SET available_seats = available_seats - 1, updated_at = SYSTIMESTAMP 
                 WHERE flight_id = :flightId`,
                { flightId: flightId }
            );

            console.log(`✓ Booking created: ID ${bookingId}, Flight ${flightId}, Seat ${seatNumber}`);

            return bookingId;
        });

        // Retrieve created booking details
        return await getBookingById(result, userId);
    } catch (error) {
        console.error('✗ Error creating booking:', error.message);
        throw error;
    }
}

/**
 * Get booking by ID with flight details
 */
async function getBookingById(bookingId, userId) {
    try {
        const bookings = await db.executeQuery(
            `SELECT b.booking_id, b.user_id, b.flight_id, b.seat_number, b.booking_status, 
                    b.total_price, b.booking_date, f.flight_number, f.airline_name,
                    f.departure_city, f.arrival_city, f.departure_time, f.arrival_time
             FROM bookings b
             JOIN flights f ON b.flight_id = f.flight_id
             WHERE b.booking_id = :bookingId AND b.user_id = :userId`,
            [bookingId, userId]
        );

        if (bookings.length === 0) {
            throw new Error('Booking not found');
        }

        const booking = bookings[0];

        return {
            bookingId: booking.BOOKING_ID,
            userId: booking.USER_ID,
            flightId: booking.FLIGHT_ID,
            flightNumber: booking.FLIGHT_NUMBER,
            airlineName: booking.AIRLINE_NAME,
            departureCity: booking.DEPARTURE_CITY,
            arrivalCity: booking.ARRIVAL_CITY,
            departureTime: booking.DEPARTURE_TIME,
            arrivalTime: booking.ARRIVAL_TIME,
            seatNumber: booking.SEAT_NUMBER,
            bookingStatus: booking.BOOKING_STATUS,
            totalPrice: booking.TOTAL_PRICE,
            bookingDate: booking.BOOKING_DATE
        };
    } catch (error) {
        console.error('✗ Error fetching booking:', error.message);
        throw error;
    }
}

/**
 * Get all bookings for a user
 */
async function getUserBookings(userId) {
    try {
        const bookings = await db.executeQuery(
            `SELECT b.booking_id, b.user_id, b.flight_id, b.seat_number, b.booking_status,
                    b.total_price, b.booking_date, f.flight_number, f.airline_name,
                    f.departure_city, f.arrival_city, f.departure_time, f.arrival_time
             FROM bookings b
             JOIN flights f ON b.flight_id = f.flight_id
             WHERE b.user_id = :userId
             ORDER BY b.booking_date DESC`,
            [userId]
        );

        return bookings.map(booking => ({
            bookingId: booking.BOOKING_ID,
            userId: booking.USER_ID,
            flightId: booking.FLIGHT_ID,
            flightNumber: booking.FLIGHT_NUMBER,
            airlineName: booking.AIRLINE_NAME,
            departureCity: booking.DEPARTURE_CITY,
            arrivalCity: booking.ARRIVAL_CITY,
            departureTime: booking.DEPARTURE_TIME,
            arrivalTime: booking.ARRIVAL_TIME,
            seatNumber: booking.SEAT_NUMBER,
            bookingStatus: booking.BOOKING_STATUS,
            totalPrice: booking.TOTAL_PRICE,
            bookingDate: booking.BOOKING_DATE
        }));
    } catch (error) {
        console.error('✗ Error fetching user bookings:', error.message);
        throw error;
    }
}

/**
 * Cancel a booking and free up the seat
 */
async function cancelBooking(bookingId, userId) {
    try {
        // Execute cancellation as a transaction
        await db.executeTransaction(async (connection) => {
            // Get booking details
            const bookingResult = await connection.execute(
                `SELECT booking_id, flight_id, booking_status FROM bookings 
                 WHERE booking_id = :bookingId AND user_id = :userId FOR UPDATE`,
                { bookingId: bookingId, userId: userId },
                { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
            );

            if (bookingResult.rows.length === 0) {
                throw new Error('Booking not found');
            }

            const booking = bookingResult.rows[0];

            if (booking.BOOKING_STATUS === 'CANCELLED') {
                throw new Error('Booking is already cancelled');
            }

            // Update booking status
            await connection.execute(
                `UPDATE bookings SET booking_status = 'CANCELLED', updated_at = SYSTIMESTAMP 
                 WHERE booking_id = :bookingId`,
                { bookingId: bookingId }
            );

            // Restore available seat
            await connection.execute(
                `UPDATE flights SET available_seats = available_seats + 1, updated_at = SYSTIMESTAMP 
                 WHERE flight_id = :flightId`,
                { flightId: booking.FLIGHT_ID }
            );

            console.log(`✓ Booking cancelled: ID ${bookingId}`);
        });

        return { message: 'Booking cancelled successfully' };
    } catch (error) {
        console.error('✗ Error cancelling booking:', error.message);
        throw error;
    }
}

/**
 * Get booking statistics for a flight
 */
async function getFlightBookingStats(flightId) {
    try {
        const stats = await db.executeQuery(
            `SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN booking_status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed_bookings,
                SUM(CASE WHEN booking_status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_bookings,
                SUM(CASE WHEN booking_status = 'PENDING' THEN 1 ELSE 0 END) as pending_bookings
             FROM bookings
             WHERE flight_id = :flightId`,
            [flightId]
        );

        if (stats.length === 0) {
            return {
                totalBookings: 0,
                confirmedBookings: 0,
                cancelledBookings: 0,
                pendingBookings: 0
            };
        }

        const stat = stats[0];

        return {
            totalBookings: stat.TOTAL_BOOKINGS || 0,
            confirmedBookings: stat.CONFIRMED_BOOKINGS || 0,
            cancelledBookings: stat.CANCELLED_BOOKINGS || 0,
            pendingBookings: stat.PENDING_BOOKINGS || 0
        };
    } catch (error) {
        console.error('✗ Error fetching booking stats:', error.message);
        throw error;
    }
}

module.exports = {
    createBooking,
    getBookingById,
    getUserBookings,
    cancelBooking,
    getFlightBookingStats
};
