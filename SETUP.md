# Flight Booking System - Setup Guide

## Quick Start

This guide will help you set up and run the Flight Booking System locally.

## Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **Oracle Database**: 11g or higher
- **Git**: (optional)

## Installation Steps

### 1. Backend Setup

#### 1.1 Install Dependencies

```bash
cd backend
npm install
```

This will install:
- **express**: Web framework
- **oracledb**: Oracle database driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

#### 1.2 Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your Oracle credentials
nano .env
```

**Required Configuration:**
```
DB_USER=your_oracle_username
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=localhost:1521/orcl
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

#### 1.3 Setup Oracle Database

```bash
# Connect to Oracle
sqlplus system/password@orcl

# Execute schema script
@../database/schema.sql

# Load sample data (optional)
@../database/sample-data.sql

# Exit
exit
```

#### 1.4 Start Backend Server

```bash
npm start
```

Expected output:
```
✓ Oracle connection pool initialized successfully
✓ Database connection successful!
✓ Server started successfully
  Environment: development
  Port: 3000
  URL: http://localhost:3000
```

### 2. Frontend Setup

#### 2.1 Open in Browser

```bash
cd frontend

# Option 1: Direct file
open index.html

# Option 2: Using Python HTTP server
python3 -m http.server 8000
# Visit http://localhost:8000
```

#### 2.2 Verify Connection

- Open browser console (F12)
- Check for any errors
- Verify API calls are working

## Testing the System

### 1. User Registration

1. Click "Login/Register" in navigation
2. Switch to "Register" form
3. Fill in details:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `testpass123`
   - First Name: `Test`
   - Last Name: `User`
4. Click "Register"

### 2. User Login

1. Click "Login/Register"
2. Fill in credentials:
   - Username: `testuser`
   - Password: `testpass123`
3. Click "Login"

### 3. Search Flights

1. Click "Flights" in navigation
2. Enter search criteria:
   - From: `New York`
   - To: `Los Angeles`
3. Click "Search"

### 4. Make a Booking

1. Click "Book Now" on a flight
2. Enter seat number (e.g., `A1`)
3. Click "Confirm Booking"
4. View confirmation

### 5. View Bookings

1. Click "My Bookings" in navigation
2. View all your bookings
3. Click "Cancel Booking" to cancel

### 6. Update Profile

1. Click "Profile" in navigation
2. Update information
3. Click "Update Profile"

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)
- `POST /api/users/change-password` - Change password (requires auth)

### Flights
- `GET /api/flights` - Get all flights
- `GET /api/flights/:id` - Get flight details
- `POST /api/flights/search` - Search flights
- `GET /api/flights/:id/booked-seats` - Get booked seats

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)
- `DELETE /api/bookings/:id` - Cancel booking (requires auth)

## Running Tests

```bash
cd backend
npm test
```

Tests include:
- User registration and login
- Flight search
- Booking creation and cancellation
- Transaction integrity
- Error handling

## Project Structure

```
ATBS/
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── style.css            # Responsive styling
│   └── js/
│       ├── api.js           # API communication
│       ├── auth.js          # Authentication logic
│       ├── flights.js       # Flight management
│       ├── booking.js       # Booking management
│       └── app.js           # Main app logic
├── backend/
│   ├── server.js            # Express server
│   ├── oracle-connection.js # Database connection
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── flightController.js
│   │   └── bookingController.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── flights.js
│   │   └── bookings.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   └── validation.js    # Input validation
│   └── tests/
│       └── api.test.js      # Test suite
└── database/
    ├── schema.sql           # Database schema
    └── sample-data.sql      # Sample data
```

## Key Features

### Security
- ✓ Password hashing with bcrypt
- ✓ JWT-based authentication
- ✓ Input validation
- ✓ SQL injection prevention
- ✓ CORS protection

### Database
- ✓ Oracle 11g compatibility
- ✓ Connection pooling
- ✓ ACID transactions
- ✓ Foreign key constraints
- ✓ Unique constraints

### API
- ✓ RESTful design
- ✓ Error handling
- ✓ Request validation
- ✓ Comprehensive logging
- ✓ Transaction support

### Frontend
- ✓ Responsive design
- ✓ Semantic HTML5
- ✓ Modern CSS3
- ✓ Form validation
- ✓ Error handling

## Troubleshooting

### Issue: Cannot connect to Oracle database

**Solution:**
```bash
# Check Oracle is running
sqlplus system/password@orcl

# Verify connection string in .env
# Format: hostname:port/database_name
# Example: localhost:1521/orcl
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Issue: CORS errors in browser

**Solution:**
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:8000

# Restart backend server
npm start
```

### Issue: JWT token errors

**Solution:**
```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update JWT_SECRET in .env
JWT_SECRET=new_secret_here

# Restart server
npm start
```

## Performance Tips

1. **Database**
   - Use connection pooling (already configured)
   - Create indexes on frequently queried columns
   - Monitor query performance

2. **Frontend**
   - Minimize HTTP requests
   - Cache static assets
   - Use lazy loading for images

3. **Backend**
   - Implement request caching
   - Use compression middleware
   - Monitor memory usage

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup database regularly
- [ ] Use environment variables for secrets

## Next Steps

1. **Customize**
   - Add more flight routes
   - Implement payment processing
   - Add email notifications

2. **Scale**
   - Implement caching layer (Redis)
   - Add load balancing
   - Optimize database queries

3. **Monitor**
   - Setup error tracking (Sentry)
   - Implement logging (Winston)
   - Monitor performance (New Relic)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs
4. Check browser console

## License

ISC

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Oracle Database Documentation](https://docs.oracle.com/)
- [JWT Authentication](https://jwt.io/)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
