/**
 * User Controller - Handles user registration, login, and profile management
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../oracle-connection');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

/**
 * Register a new user with validation and password hashing
 */
async function registerUser(userData) {
    try {
        const { username, email, password, firstName, lastName, phoneNumber } = userData;

        if (!username || !email || !password) {
            throw new Error('Username, email, and password are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const existingUser = await db.executeQuery(
            'SELECT user_id FROM users WHERE username = :username',
            [username]
        );

        if (existingUser.length > 0) {
            throw new Error('Username already exists');
        }

        const existingEmail = await db.executeQuery(
            'SELECT user_id FROM users WHERE email = :email',
            [email]
        );

        if (existingEmail.length > 0) {
            throw new Error('Email already registered');
        }

        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        await db.executeUpdate(
            `INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number)
             VALUES (:username, :email, :passwordHash, :firstName, :lastName, :phoneNumber)`,
            [username, email, passwordHash, firstName || null, lastName || null, phoneNumber || null]
        );

        const newUser = await db.executeQuery(
            'SELECT user_id, username, email, first_name, last_name FROM users WHERE username = :username',
            [username]
        );

        if (newUser.length === 0) {
            throw new Error('Failed to retrieve newly created user');
        }

        const user = newUser[0];
        const token = jwt.sign(
            { userId: user.USER_ID, username: user.USERNAME, email: user.EMAIL },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        console.log(`✓ User registered: ${username}`);

        return {
            userId: user.USER_ID,
            username: user.USERNAME,
            email: user.EMAIL,
            firstName: user.FIRST_NAME,
            lastName: user.LAST_NAME,
            token: token
        };
    } catch (error) {
        console.error('✗ Registration error:', error.message);
        throw error;
    }
}

/**
 * Authenticate user and generate JWT token
 */
async function loginUser(username, password) {
    try {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const users = await db.executeQuery(
            `SELECT user_id, username, email, password_hash, first_name, last_name 
             FROM users 
             WHERE username = :username OR email = :email`,
            [username, username]
        );

        if (users.length === 0) {
            throw new Error('Invalid username or password');
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

        if (!passwordMatch) {
            throw new Error('Invalid username or password');
        }

        const token = jwt.sign(
            { userId: user.USER_ID, username: user.USERNAME, email: user.EMAIL },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        console.log(`✓ User logged in: ${user.USERNAME}`);

        return {
            userId: user.USER_ID,
            username: user.USERNAME,
            email: user.EMAIL,
            firstName: user.FIRST_NAME,
            lastName: user.LAST_NAME,
            token: token
        };
    } catch (error) {
        console.error('✗ Login error:', error.message);
        throw error;
    }
}

/**
 * Get user profile by ID
 */
async function getUserProfile(userId) {
    try {
        const users = await db.executeQuery(
            `SELECT user_id, username, email, first_name, last_name, phone_number, created_at 
             FROM users 
             WHERE user_id = :userId`,
            [userId]
        );

        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];

        return {
            userId: user.USER_ID,
            username: user.USERNAME,
            email: user.EMAIL,
            firstName: user.FIRST_NAME,
            lastName: user.LAST_NAME,
            phoneNumber: user.PHONE_NUMBER,
            createdAt: user.CREATED_AT
        };
    } catch (error) {
        console.error('✗ Error retrieving profile:', error.message);
        throw error;
    }
}

/**
 * Update user profile information
 */
async function updateUserProfile(userId, updateData) {
    try {
        const { firstName, lastName, phoneNumber } = updateData;

        const updates = [];
        const params = [];

        if (firstName !== undefined) {
            updates.push('first_name = :firstName');
            params.push(firstName);
        }

        if (lastName !== undefined) {
            updates.push('last_name = :lastName');
            params.push(lastName);
        }

        if (phoneNumber !== undefined) {
            updates.push('phone_number = :phoneNumber');
            params.push(phoneNumber);
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        params.push(userId);

        const updateQuery = `UPDATE users SET ${updates.join(', ')}, updated_at = SYSTIMESTAMP WHERE user_id = :userId`;
        await db.executeUpdate(updateQuery, params);

        return await getUserProfile(userId);
    } catch (error) {
        console.error('✗ Error updating profile:', error.message);
        throw error;
    }
}

/**
 * Change user password with validation
 */
async function changePassword(userId, oldPassword, newPassword) {
    try {
        if (!newPassword || newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
        }

        const users = await db.executeQuery(
            'SELECT password_hash FROM users WHERE user_id = :userId',
            [userId]
        );

        if (users.length === 0) {
            throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(oldPassword, users[0].PASSWORD_HASH);

        if (!passwordMatch) {
            throw new Error('Current password is incorrect');
        }

        const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

        await db.executeUpdate(
            'UPDATE users SET password_hash = :passwordHash, updated_at = SYSTIMESTAMP WHERE user_id = :userId',
            [newPasswordHash, userId]
        );

        console.log(`✓ Password changed for user ID: ${userId}`);

        return { message: 'Password changed successfully' };
    } catch (error) {
        console.error('✗ Error changing password:', error.message);
        throw error;
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
};
