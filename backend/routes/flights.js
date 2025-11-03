/**
 * Flight Routes - Flight search, listing, and management
 */

const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { verifyTokenOptional } = require('../middleware/auth');
const { validateFlightSearch, validateNumericId } = require('../middleware/validation');

/**
 * GET /api/flights
 * Get all available flights
 */
router.get('/', async (req, res) => {
    try {
        const flights = await flightController.getAllFlights();

        res.status(200).json({
            success: true,
            message: 'Flights retrieved successfully',
            data: flights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/flights/:id
 * Get flight details by ID
 */
router.get('/:id', validateNumericId, async (req, res) => {
    try {
        const flight = await flightController.getFlightById(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Flight retrieved successfully',
            data: flight
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/flights/search
 * Search flights by criteria
 * Body: { departureCity, arrivalCity, departureDate (optional) }
 */
router.post('/search', validateFlightSearch, async (req, res) => {
    try {
        const flights = await flightController.searchFlights(req.body);

        res.status(200).json({
            success: true,
            message: 'Flights found',
            data: flights,
            count: flights.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/flights/:id/booked-seats
 * Get list of booked seats for a flight
 */
router.get('/:id/booked-seats', validateNumericId, async (req, res) => {
    try {
        const seats = await flightController.getBookedSeats(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Booked seats retrieved',
            data: seats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
