/**
 * API Tests - Jest test suite for backend endpoints
 * Tests user registration, login, flights, and bookings
 */

const request = require('supertest');
const app = require('../server');

// Test data
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpass123',
    firstName: 'Test',
    lastName: 'User'
};

const testFlight = {
    flightNumber: 'TEST001',
    airlineName: 'Test Airlines',
    departureCity: 'New York',
    arrivalCity: 'Los Angeles',
    departureTime: new Date(Date.now() + 86400000).toISOString(),
    arrivalTime: new Date(Date.now() + 86400000 + 18000000).toISOString(),
    totalSeats: 100,
    price: 299.99
};

let authToken = null;
let userId = null;
let flightId = null;
let bookingId = null;

/**
 * ============================================================================
 * USER TESTS
 * ============================================================================
 */

describe('User API Endpoints', () => {
    // Test user registration
    test('POST /api/users/register - Register new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send(testUser)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.username).toBe(testUser.username);

        authToken = response.body.data.token;
        userId = response.body.data.userId;
    });

    // Test duplicate username
    test('POST /api/users/register - Reject duplicate username', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send(testUser)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('already exists');
    });

    // Test user login
    test('POST /api/users/login - Login user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: testUser.username,
                password: testUser.password
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
    });

    // Test invalid login
    test('POST /api/users/login - Reject invalid credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: testUser.username,
                password: 'wrongpassword'
            })
            .expect(401);

        expect(response.body.success).toBe(false);
    });

    // Test get profile
    test('GET /api/users/profile - Get user profile', async () => {
        const response = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.username).toBe(testUser.username);
    });

    // Test unauthorized access
    test('GET /api/users/profile - Reject without token', async () => {
        const response = await request(app)
            .get('/api/users/profile')
            .expect(401);

        expect(response.body.success).toBe(false);
    });
});

/**
 * ============================================================================
 * FLIGHT TESTS
 * ============================================================================
 */

describe('Flight API Endpoints', () => {
    // Test get all flights
    test('GET /api/flights - Get all flights', async () => {
        const response = await request(app)
            .get('/api/flights')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    // Test search flights
    test('POST /api/flights/search - Search flights', async () => {
        const response = await request(app)
            .post('/api/flights/search')
            .send({
                departureCity: 'New York',
                arrivalCity: 'Los Angeles'
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    // Test invalid search
    test('POST /api/flights/search - Reject invalid search', async () => {
        const response = await request(app)
            .post('/api/flights/search')
            .send({
                departureCity: 'New York'
                // Missing arrivalCity
            })
            .expect(400);

        expect(response.body.success).toBe(false);
    });
});

/**
 * ============================================================================
 * BOOKING TESTS
 * ============================================================================
 */

describe('Booking API Endpoints', () => {
    // Test create booking
    test('POST /api/bookings - Create booking', async () => {
        // First, get a flight
        const flightsResponse = await request(app)
            .get('/api/flights')
            .expect(200);

        if (flightsResponse.body.data.length > 0) {
            flightId = flightsResponse.body.data[0].flightId;

            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    flightId: flightId,
                    seatNumber: 'A1'
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.seatNumber).toBe('A1');

            bookingId = response.body.data.bookingId;
        }
    });

    // Test get user bookings
    test('GET /api/bookings - Get user bookings', async () => {
        const response = await request(app)
            .get('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    // Test unauthorized booking
    test('POST /api/bookings - Reject without authentication', async () => {
        const response = await request(app)
            .post('/api/bookings')
            .send({
                flightId: 1,
                seatNumber: 'B1'
            })
            .expect(401);

        expect(response.body.success).toBe(false);
    });

    // Test invalid seat number
    test('POST /api/bookings - Reject invalid seat number', async () => {
        const response = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                flightId: 1,
                seatNumber: 'invalid'
            })
            .expect(400);

        expect(response.body.success).toBe(false);
    });
});

/**
 * ============================================================================
 * HEALTH CHECK TEST
 * ============================================================================
 */

describe('Health Check', () => {
    test('GET /health - Server health check', async () => {
        const response = await request(app)
            .get('/health')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Server is running');
    });
});

/**
 * ============================================================================
 * TRANSACTION INTEGRITY TEST
 * ============================================================================
 */

describe('Transaction Integrity', () => {
    test('Booking transaction - Verify seat availability', async () => {
        // This test verifies that bookings are atomic
        // If a booking fails, the flight seat count should not change

        const flightsResponse = await request(app)
            .get('/api/flights')
            .expect(200);

        if (flightsResponse.body.data.length > 0) {
            const flight = flightsResponse.body.data[0];
            const initialSeats = flight.availableSeats;

            // Try to book a seat
            const bookingResponse = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    flightId: flight.flightId,
                    seatNumber: 'C1'
                });

            // Check flight seats after booking
            const updatedFlightResponse = await request(app)
                .get(`/api/flights/${flight.flightId}`)
                .expect(200);

            const updatedFlight = updatedFlightResponse.body.data;

            if (bookingResponse.status === 201) {
                // Booking succeeded, seats should decrease
                expect(updatedFlight.availableSeats).toBe(initialSeats - 1);
            } else {
                // Booking failed, seats should remain same
                expect(updatedFlight.availableSeats).toBe(initialSeats);
            }
        }
    });
});
