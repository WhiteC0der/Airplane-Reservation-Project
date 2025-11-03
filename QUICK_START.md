# Flight Booking System - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js installed
- Oracle database running
- Oracle credentials ready

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Oracle credentials
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_CONNECTION_STRING=localhost:1521/orcl
# JWT_SECRET=your_secret_key

# Start server
npm start
```

**Expected Output:**
```
✓ Oracle connection pool initialized successfully
✓ Database connection successful!
✓ Server started successfully
  Port: 3000
```

### Step 2: Database Setup (1 minute)

```bash
# In another terminal, connect to Oracle
sqlplus system/password@orcl

# Execute schema
@database/schema.sql

# Load sample data
@database/sample-data.sql

# Exit
exit
```

### Step 3: Frontend Setup (1 minute)

```bash
# Navigate to frontend
cd frontend

# Open in browser
open index.html

# Or use Python server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Step 4: Test the System (1 minute)

1. **Register**: Click "Login/Register" → Register with test credentials
2. **Login**: Login with your credentials
3. **Search**: Click "Flights" → Search for flights
4. **Book**: Click "Book Now" → Enter seat number → Confirm
5. **View**: Click "My Bookings" → See your booking

## Common Commands

### Backend
```bash
# Start server
npm start

# Run tests
npm test

# Install dependencies
npm install

# Check for vulnerabilities
npm audit
```

### Database
```bash
# Connect to Oracle
sqlplus system/password@orcl

# Create schema
@database/schema.sql

# Load sample data
@database/sample-data.sql

# Query users
SELECT * FROM users;

# Query flights
SELECT * FROM flights;

# Query bookings
SELECT * FROM bookings;
```

### Frontend
```bash
# Start Python server
python3 -m http.server 8000

# Or use Node.js
npx http-server

# Or use npm
npm install -g http-server
http-server
```

## API Quick Reference

### Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Flights
```bash
# Get all flights
curl http://localhost:3000/api/flights

# Search flights
curl -X POST http://localhost:3000/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "departureCity": "New York",
    "arrivalCity": "Los Angeles"
  }'
```

### Bookings (requires token)
```bash
# Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "flightId": 1,
    "seatNumber": "A1"
  }'

# Get bookings
curl http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Issue: Cannot connect to database
```bash
# Check Oracle is running
sqlplus system/password@orcl

# Verify connection string
# Should be: hostname:port/database_name
# Example: localhost:1521/orcl
```

### Issue: Port 3000 in use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Issue: CORS errors
```bash
# Update .env
CORS_ORIGIN=http://localhost:8000

# Restart backend
npm start
```

### Issue: JWT errors
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env
JWT_SECRET=new_secret_here

# Restart backend
npm start
```

## File Locations

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server |
| `backend/.env` | Configuration |
| `backend/oracle-connection.js` | Database connection |
| `frontend/index.html` | Main page |
| `frontend/style.css` | Styling |
| `frontend/js/api.js` | API calls |
| `database/schema.sql` | Database schema |

## Environment Variables

```
DB_USER              Oracle username
DB_PASSWORD          Oracle password
DB_CONNECTION_STRING Oracle connection string
JWT_SECRET           JWT signing secret
PORT                 Server port (default: 3000)
NODE_ENV             Environment (development/production)
CORS_ORIGIN          Allowed CORS origin
```

## Test Credentials

After loading sample data:

| Username | Password | Email |
|----------|----------|-------|
| john_doe | password123 | john@example.com |
| jane_smith | password123 | jane@example.com |
| bob_wilson | password123 | bob@example.com |
| alice_johnson | password123 | alice@example.com |

## Sample Flight Data

After loading sample data, available flights:

| Flight | Route | Price |
|--------|-------|-------|
| AA101 | New York → Los Angeles | $299.99 |
| UA202 | Chicago → Miami | $199.99 |
| DL303 | Boston → San Francisco | $349.99 |
| SW404 | Denver → Seattle | $149.99 |
| BA505 | New York → London | $599.99 |

## Health Check

```bash
# Check if server is running
curl http://localhost:3000/health

# Expected response
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

## Performance Tips

1. **Database**: Connection pooling is enabled by default
2. **Frontend**: Use browser cache for static files
3. **Backend**: Queries are optimized with indexes
4. **API**: Use pagination for large result sets

## Security Reminders

- ✓ Change JWT_SECRET in production
- ✓ Use strong database password
- ✓ Enable HTTPS in production
- ✓ Never commit .env file
- ✓ Validate all inputs
- ✓ Use environment variables for secrets

## Next Steps

1. **Customize**: Modify styles and add features
2. **Deploy**: Follow DEPLOYMENT.md for cloud setup
3. **Scale**: Add caching and load balancing
4. **Monitor**: Setup logging and error tracking

## Documentation

- Full setup: See `SETUP.md`
- Deployment: See `DEPLOYMENT.md`
- Project details: See `PROJECT_SUMMARY.md`
- API docs: See `README.md`

## Support

For issues:
1. Check error messages in console
2. Review backend logs
3. Check browser console (F12)
4. Verify .env configuration
5. Check database connection

---

**Ready to go!** 🚀

Start with Step 1 above and you'll have the system running in 5 minutes.
