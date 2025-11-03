/**
 * ============================================================================
 * Oracle Database Connection Module
 * ============================================================================
 * This module handles all Oracle database connections for the Flight Booking System.
 * It implements connection pooling for efficient resource management and includes
 * error handling for robust database operations.
 * 
 * Features:
 * - Connection pooling to reuse connections
 * - Automatic connection management
 * - Error handling and logging
 * - Safe connection closing
 * ============================================================================
 */

const oracledb = require('oracledb');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

// Enable Thick mode for better compatibility with older Oracle versions
try {
    oracledb.initOracleClient();
} catch (err) {
    // Thick mode initialization failed, will use Thin mode
    console.warn('⚠ Could not initialize Thick mode, using Thin mode');
}

// Connection pool configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    poolMin: 2,           // Minimum connections in pool
    poolMax: 10,          // Maximum connections in pool
    poolIncrement: 1,     // Increment when pool needs to grow
    poolTimeout: 60,      // Timeout for idle connections (seconds)
};

// Global connection pool
let connectionPool = null;

// ============================================================================
// CONNECTION POOL INITIALIZATION
// ============================================================================

/**
 * Initialize the connection pool
 * This function should be called once when the application starts
 * 
 * @returns {Promise<void>}
 * @throws {Error} If connection pool initialization fails
 */
async function initializePool() {
    try {
        // Create connection pool
        connectionPool = await oracledb.createPool(dbConfig);
        console.log('✓ Oracle connection pool initialized successfully');
        console.log(`  Pool size: ${dbConfig.poolMin}-${dbConfig.poolMax} connections`);
    } catch (error) {
        console.error('✗ Failed to initialize connection pool:', error.message);
        console.warn('⚠ Running in mock mode - database operations will not work');
        // Don't throw error, allow app to continue in mock mode
    }
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

/**
 * Get a connection from the pool
 * 
 * @returns {Promise<Connection>} Oracle database connection
 * @throws {Error} If unable to get connection from pool
 */
async function getConnection() {
    try {
        // Initialize pool if not already done
        if (!connectionPool) {
            await initializePool();
        }

        // Get connection from pool
        const connection = await connectionPool.getConnection();
        return connection;
    } catch (error) {
        console.error('✗ Error getting database connection:', error.message);
        throw error;
    }
}

/**
 * Close a database connection and return it to the pool
 * 
 * @param {Connection} connection - Oracle database connection to close
 * @returns {Promise<void>}
 */
async function closeConnection(connection) {
    try {
        if (connection) {
            await connection.close();
        }
    } catch (error) {
        console.error('✗ Error closing database connection:', error.message);
    }
}

/**
 * Close the entire connection pool
 * This should be called when the application shuts down
 * 
 * @returns {Promise<void>}
 */
async function closePool() {
    try {
        if (connectionPool) {
            await connectionPool.close(0);
            connectionPool = null;
            console.log('✓ Connection pool closed successfully');
        }
    } catch (error) {
        console.error('✗ Error closing connection pool:', error.message);
        throw error;
    }
}

// ============================================================================
// QUERY EXECUTION HELPERS
// ============================================================================

/**
 * Execute a SELECT query and return results
 * 
 * @param {string} sql - SQL query string
 * @param {Array} bindParams - Bind parameters for the query (optional)
 * @returns {Promise<Array>} Array of result rows
 * @throws {Error} If query execution fails
 */
async function executeQuery(sql, bindParams = []) {
    let connection;
    try {
        connection = await getConnection();
        
        // Execute query with bind parameters for SQL injection prevention
        const result = await connection.execute(sql, bindParams, {
            outFormat: oracledb.OUT_FORMAT_OBJECT  // Return results as objects
        });
        
        return result.rows || [];
    } catch (error) {
        console.error('✗ Query execution error:', error.message);
        throw error;
    } finally {
        // Always close connection
        await closeConnection(connection);
    }
}

/**
 * Execute an INSERT, UPDATE, or DELETE query
 * 
 * @param {string} sql - SQL query string
 * @param {Array} bindParams - Bind parameters for the query (optional)
 * @returns {Promise<Object>} Result object with rowsAffected
 * @throws {Error} If query execution fails
 */
async function executeUpdate(sql, bindParams = []) {
    let connection;
    try {
        connection = await getConnection();
        
        // Execute update query
        const result = await connection.execute(sql, bindParams, {
            autoCommit: true  // Auto-commit for non-transactional operations
        });
        
        return {
            rowsAffected: result.rowsAffected,
            lastRowId: result.lastRowId
        };
    } catch (error) {
        console.error('✗ Update execution error:', error.message);
        throw error;
    } finally {
        // Always close connection
        await closeConnection(connection);
    }
}

/**
 * Execute a transaction with multiple queries
 * Ensures ACID properties for complex operations like bookings
 * 
 * @param {Function} transactionFn - Async function that performs transaction operations
 * @returns {Promise<any>} Result from transaction function
 * @throws {Error} If transaction fails (automatic rollback)
 */
async function executeTransaction(transactionFn) {
    let connection;
    try {
        connection = await getConnection();
        
        // Disable autoCommit for transaction
        connection.autoCommit = false;
        
        // Execute transaction function with autoCommit disabled
        const result = await transactionFn(connection);
        
        // Commit transaction
        await connection.commit();
        console.log('✓ Transaction committed successfully');
        
        return result;
    } catch (error) {
        // Rollback on error
        if (connection) {
            try {
                await connection.rollback();
                console.log('✓ Transaction rolled back due to error');
            } catch (rollbackError) {
                console.error('✗ Error during rollback:', rollbackError.message);
            }
        }
        console.error('✗ Transaction error:', error.message);
        throw error;
    } finally {
        // Always close connection
        await closeConnection(connection);
    }
}

// ============================================================================
// TEST FUNCTION
// ============================================================================

/**
 * Test database connection by querying current date
 * This function verifies that the Oracle database is accessible
 * 
 * @returns {Promise<void>}
 */
async function testConnection() {
    try {
        console.log('\n--- Testing Oracle Database Connection ---');
        
        // Query current date from database
        const result = await executeQuery('SELECT SYSDATE as current_date FROM dual');
        
        if (result && result.length > 0) {
            console.log('✓ Database connection successful!');
            console.log(`  Current database date: ${result[0].CURRENT_DATE}`);
        } else {
            console.log('✗ Database connection failed: No result returned');
        }
    } catch (error) {
        console.error('✗ Database connection test failed:', error.message);
        throw error;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Pool management
    initializePool,
    closePool,
    
    // Connection management
    getConnection,
    closeConnection,
    
    // Query execution
    executeQuery,
    executeUpdate,
    executeTransaction,
    
    // Testing
    testConnection,
    
    // Configuration
    dbConfig
};

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 * 
 * // Initialize pool on application startup
 * await initializePool();
 * 
 * // Execute a SELECT query
 * const users = await executeQuery('SELECT * FROM users WHERE user_id = :id', [1]);
 * 
 * // Execute an INSERT/UPDATE/DELETE
 * const result = await executeUpdate(
 *     'INSERT INTO users (username, email) VALUES (:username, :email)',
 *     ['john_doe', 'john@example.com']
 * );
 * 
 * // Execute a transaction
 * const bookingResult = await executeTransaction(async (connection) => {
 *     // Verify seat availability
 *     const flight = await connection.execute(
 *         'SELECT available_seats FROM flights WHERE flight_id = :id FOR UPDATE',
 *         [flightId]
 *     );
 *     
 *     if (flight.rows[0].AVAILABLE_SEATS > 0) {
 *         // Create booking
 *         await connection.execute(
 *             'INSERT INTO bookings (user_id, flight_id, seat_number) VALUES (:uid, :fid, :seat)',
 *             [userId, flightId, seatNumber]
 *         );
 *         
 *         // Update available seats
 *         await connection.execute(
 *             'UPDATE flights SET available_seats = available_seats - 1 WHERE flight_id = :id',
 *             [flightId]
 *         );
 *         
 *         return { success: true };
 *     }
 * });
 * 
 * // Close pool on application shutdown
 * await closePool();
 * 
 * ============================================================================
 */
