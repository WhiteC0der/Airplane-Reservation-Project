/**
 * Authentication Middleware - JWT token verification
 * Protects routes that require user authentication
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verify JWT token and attach user info to request
 * This middleware should be used on protected routes
 */
function verifyToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No authorization token provided'
            });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info to request object
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };

        console.log(`✓ Token verified for user: ${decoded.username}`);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        console.error('✗ Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
}

/**
 * Optional token verification - doesn't fail if token is missing
 * Useful for routes that work with or without authentication
 */
function verifyTokenOptional(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : authHeader;

            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = {
                userId: decoded.userId,
                username: decoded.username,
                email: decoded.email
            };
        }

        next();
    } catch (error) {
        // Continue without user info if token is invalid
        console.warn('⚠ Optional token verification failed:', error.message);
        next();
    }
}

module.exports = {
    verifyToken,
    verifyTokenOptional
};
