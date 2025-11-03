/**
 * API Module - Centralized API communication
 * Handles all HTTP requests to the backend server
 */

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Add authorization token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        // Add request body for POST/PUT requests
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        // Handle response
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'API request failed');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}

/**
 * ============================================================================
 * USER API CALLS
 * ============================================================================
 */

/**
 * Register a new user
 */
async function registerUser(userData) {
    return await apiCall('/users/register', 'POST', userData);
}

/**
 * Login user
 */
async function loginUser(username, password) {
    return await apiCall('/users/login', 'POST', { username, password });
}

/**
 * Get user profile
 */
async function getUserProfile() {
    return await apiCall('/users/profile', 'GET');
}

/**
 * Update user profile
 */
async function updateUserProfile(profileData) {
    return await apiCall('/users/profile', 'PUT', profileData);
}

/**
 * Change password
 */
async function changePassword(oldPassword, newPassword) {
    return await apiCall('/users/change-password', 'POST', {
        oldPassword,
        newPassword
    });
}

/**
 * ============================================================================
 * FLIGHT API CALLS
 * ============================================================================
 */

/**
 * Get all flights
 */
async function getAllFlights() {
    return await apiCall('/flights', 'GET');
}

/**
 * Get flight by ID
 */
async function getFlightById(flightId) {
    return await apiCall(`/flights/${flightId}`, 'GET');
}

/**
 * Search flights
 */
async function searchFlights(searchCriteria) {
    return await apiCall('/flights/search', 'POST', searchCriteria);
}

/**
 * Get booked seats for a flight
 */
async function getBookedSeats(flightId) {
    return await apiCall(`/flights/${flightId}/booked-seats`, 'GET');
}

/**
 * ============================================================================
 * BOOKING API CALLS
 * ============================================================================
 */

/**
 * Create a new booking
 */
async function createBooking(bookingData) {
    return await apiCall('/bookings', 'POST', bookingData);
}

/**
 * Get user's bookings
 */
async function getUserBookings() {
    return await apiCall('/bookings', 'GET');
}

/**
 * Get booking by ID
 */
async function getBookingById(bookingId) {
    return await apiCall(`/bookings/${bookingId}`, 'GET');
}

/**
 * Cancel a booking
 */
async function cancelBooking(bookingId) {
    return await apiCall(`/bookings/${bookingId}`, 'DELETE');
}

/**
 * Get booking statistics for a flight
 */
async function getFlightBookingStats(flightId) {
    return await apiCall(`/bookings/flight/${flightId}/stats`, 'GET');
}

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

/**
 * Get stored user info
 */
function getStoredUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Store authentication data
 */
function storeAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear authentication data
 */
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}
