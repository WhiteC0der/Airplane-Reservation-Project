/**
 * Input Validation Middleware - Validates request data
 * Prevents invalid or malicious data from reaching controllers
 */

/**
 * Validate user registration data
 */
function validateUserRegistration(req, res, next) {
    try {
        const { username, email, password } = req.body;

        const errors = [];

        // Validate username
        if (!username) {
            errors.push('Username is required');
        } else if (username.length < 3) {
            errors.push('Username must be at least 3 characters');
        } else if (username.length > 50) {
            errors.push('Username must not exceed 50 characters');
        } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, underscores, and hyphens');
        }

        // Validate email
        if (!email) {
            errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Invalid email format');
        }

        // Validate password
        if (!password) {
            errors.push('Password is required');
        } else if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        } else if (password.length > 255) {
            errors.push('Password must not exceed 255 characters');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        next();
    } catch (error) {
        console.error('✗ Validation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Validation error'
        });
    }
}

/**
 * Validate user login data
 */
function validateUserLogin(req, res, next) {
    try {
        const { username, password } = req.body;

        const errors = [];

        if (!username) {
            errors.push('Username or email is required');
        }

        if (!password) {
            errors.push('Password is required');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        next();
    } catch (error) {
        console.error('✗ Validation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Validation error'
        });
    }
}

/**
 * Validate flight search criteria
 */
function validateFlightSearch(req, res, next) {
    try {
        const { departureCity, arrivalCity } = req.body;

        const errors = [];

        if (!departureCity) {
            errors.push('Departure city is required');
        } else if (departureCity.length > 50) {
            errors.push('Departure city must not exceed 50 characters');
        }

        if (!arrivalCity) {
            errors.push('Arrival city is required');
        } else if (arrivalCity.length > 50) {
            errors.push('Arrival city must not exceed 50 characters');
        }

        if (departureCity && arrivalCity && departureCity.toLowerCase() === arrivalCity.toLowerCase()) {
            errors.push('Departure and arrival cities must be different');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        next();
    } catch (error) {
        console.error('✗ Validation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Validation error'
        });
    }
}

/**
 * Validate booking data
 */
function validateBooking(req, res, next) {
    try {
        const { flightId, seatNumber } = req.body;

        const errors = [];

        if (!flightId) {
            errors.push('Flight ID is required');
        } else if (isNaN(flightId) || flightId <= 0) {
            errors.push('Flight ID must be a positive number');
        }

        if (!seatNumber) {
            errors.push('Seat number is required');
        } else if (!/^[A-Z]\d+$/.test(seatNumber)) {
            errors.push('Invalid seat number format (e.g., A1, B12)');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        next();
    } catch (error) {
        console.error('✗ Validation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Validation error'
        });
    }
}

/**
 * Validate numeric ID parameter
 */
function validateNumericId(req, res, next) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID parameter'
            });
        }

        next();
    } catch (error) {
        console.error('✗ Validation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Validation error'
        });
    }
}

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateFlightSearch,
    validateBooking,
    validateNumericId
};
