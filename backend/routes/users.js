/**
 * User Routes - User registration, login, and profile management
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

/**
 * POST /api/users/register
 * Register a new user
 * Body: { username, email, password, firstName, lastName, phoneNumber }
 */
router.post('/register', validateUserRegistration, async (req, res) => {
    try {
        const result = await userController.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
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
 * POST /api/users/login
 * Authenticate user and get JWT token
 * Body: { username, password }
 */
router.post('/login', validateUserLogin, async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await userController.loginUser(username, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/users/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const result = await userController.getUserProfile(req.user.userId);

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: result
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * PUT /api/users/profile
 * Update user profile (requires authentication)
 * Body: { firstName, lastName, phoneNumber }
 */
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const result = await userController.updateUserProfile(req.user.userId, req.body);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
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
 * POST /api/users/change-password
 * Change user password (requires authentication)
 * Body: { oldPassword, newPassword }
 */
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old password and new password are required'
            });
        }

        const result = await userController.changePassword(
            req.user.userId,
            oldPassword,
            newPassword
        );

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

module.exports = router;
