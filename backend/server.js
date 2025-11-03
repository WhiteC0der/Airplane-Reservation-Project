/**
 * ============================================================================
 * Flight Booking System - Express Server
 * ============================================================================
 * Main server file that initializes Express, sets up middleware,
 * configures routes, and starts the API server.
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database connection module
const db = require('./oracle-connection');

// Import route modules
const userRoutes = require('./routes/users');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// EXPRESS APP SETUP
// ============================================================================

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Enable CORS for frontend communication
app.use(cors({
    origin: true,  // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

/**
 * GET /health
 * Health check endpoint to verify server is running
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * User API Routes
 * Base path: /api/users
 * Endpoints:
 *   POST   /register - Register new user
 *   POST   /login - User login
 *   GET    /profile - Get user profile
 *   PUT    /profile - Update user profile
 *   POST   /change-password - Change password
 */
app.use('/api/users', userRoutes);

/**
 * Flight API Routes
 * Base path: /api/flights
 * Endpoints:
 *   GET    / - Get all flights
 *   GET    /:id - Get flight by ID
 *   POST   /search - Search flights
 *   GET    /:id/booked-seats - Get booked seats
 */
app.use('/api/flights', flightRoutes);

/**
 * Booking API Routes
 * Base path: /api/bookings
 * Endpoints:
 *   POST   / - Create booking
 *   GET    / - Get user bookings
 *   GET    /:id - Get booking details
 *   DELETE /:id - Cancel booking
 *   GET    /flight/:flightId/stats - Get booking stats
 */
app.use('/api/bookings', bookingRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 Not Found handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error('✗ Unhandled error:', err.message);

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the Express server and initialize database connection
 */
async function startServer() {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('Flight Booking System - Backend Server');
        console.log('='.repeat(70) + '\n');

        // Initialize database connection pool
        console.log('Initializing database connection...');
        await db.initializePool();

        // Test database connection (non-blocking)
        try {
            await db.testConnection();
        } catch (error) {
            console.warn('⚠ Database connection test failed - running in mock mode');
            console.warn('  API endpoints will return mock data');
        }

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n✓ Server started successfully`);
            console.log(`  Environment: ${NODE_ENV}`);
            console.log(`  Port: ${PORT}`);
            console.log(`  URL: http://localhost:${PORT}`);
            console.log(`  Health check: http://localhost:${PORT}/health`);
            console.log('\n' + '='.repeat(70));
            console.log('API Endpoints:');
            console.log('  Users:    http://localhost:' + PORT + '/api/users');
            console.log('  Flights:  http://localhost:' + PORT + '/api/flights');
            console.log('  Bookings: http://localhost:' + PORT + '/api/bookings');
            console.log('='.repeat(70) + '\n');
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

/**
 * Handle graceful shutdown on SIGTERM or SIGINT
 */
process.on('SIGTERM', async () => {
    console.log('\n✓ SIGTERM received, shutting down gracefully...');
    await db.closePool();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n✓ SIGINT received, shutting down gracefully...');
    await db.closePool();
    process.exit(0);
});

// ============================================================================
// START SERVER
// ============================================================================

// Only start server if this file is run directly (not imported)
if (require.main === module) {
    startServer();
}

module.exports = app;
