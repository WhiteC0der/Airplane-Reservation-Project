/**
 * Booking Routes - Booking creation, retrieval, and cancellation
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');
const { validateBooking, validateNumericId } = require('../middleware/validation');

/**
 * POST /api/bookings
 * Create a new booking (requires authentication)
 * Body: { flightId, seatNumber }
 */
router.post('/', verifyToken, validateBooking, async (req, res) => {
    try {
        const bookingData = {
            userId: req.user.userId,
            flightId: req.body.flightId,
            seatNumber: req.body.seatNumber
        };

        const result = await bookingController.createBooking(bookingData);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/bookings
 * Get all bookings for current user (requires authentication)
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const bookings = await bookingController.getUserBookings(req.user.userId);

        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings,
            count: bookings.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/bookings/:id
 * Get booking details by ID (requires authentication)
 */
router.get('/:id', verifyToken, validateNumericId, async (req, res) => {
    try {
        const booking = await bookingController.getBookingById(req.params.id, req.user.userId);

        res.status(200).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: booking
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * DELETE /api/bookings/:id
 * Cancel a booking (requires authentication)
 */
router.delete('/:id', verifyToken, validateNumericId, async (req, res) => {
    try {
        const result = await bookingController.cancelBooking(req.params.id, req.user.userId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/bookings/flight/:flightId/stats
 * Get booking statistics for a flight
 */
router.get('/flight/:flightId/stats', validateNumericId, async (req, res) => {
    try {
        const stats = await bookingController.getFlightBookingStats(req.params.flightId);

        res.status(200).json({
            success: true,
            message: 'Booking statistics retrieved',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
