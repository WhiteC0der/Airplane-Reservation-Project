# Flight Booking System - Complete File Structure

## Project Directory Tree

```
ATBS/
├── README.md                          # Main project documentation
├── SETUP.md                           # Setup and installation guide
├── DEPLOYMENT.md                      # Deployment instructions
├── QUICK_START.md                     # 5-minute quick start
├── PROJECT_SUMMARY.md                 # Project overview and architecture
├── FILE_STRUCTURE.md                  # This file
│
├── frontend/                          # Frontend application
│   ├── index.html                     # Main HTML file (all pages)
│   ├── style.css                      # Responsive CSS styling
│   └── js/                            # JavaScript modules
│       ├── api.js                     # API communication module
│       ├── auth.js                    # Authentication logic
│       ├── flights.js                 # Flight management
│       ├── booking.js                 # Booking management
│       └── app.js                     # Main application logic
│
├── backend/                           # Backend API server
│   ├── server.js                      # Express server entry point
│   ├── oracle-connection.js           # Oracle database connection module
│   ├── package.json                   # Node.js dependencies
│   ├── .env.example                   # Environment variables template
│   │
│   ├── controllers/                   # Business logic layer
│   │   ├── userController.js          # User operations
│   │   ├── flightController.js        # Flight operations
│   │   └── bookingController.js       # Booking operations
│   │
│   ├── routes/                        # API route definitions
│   │   ├── users.js                   # User endpoints
│   │   ├── flights.js                 # Flight endpoints
│   │   └── bookings.js                # Booking endpoints
│   │
│   ├── middleware/                    # Express middleware
│   │   ├── auth.js                    # JWT authentication
│   │   └── validation.js              # Input validation
│   │
│   └── tests/                         # Test suite
│       └── api.test.js                # Jest API tests
│
└── database/                          # Database scripts
    ├── schema.sql                     # Oracle database schema
    └── sample-data.sql                # Sample data for testing
```

## File Descriptions

### Root Documentation Files

| File | Purpose | Size |
|------|---------|------|
| `README.md` | Complete project overview, features, setup, and API documentation | ~3KB |
| `SETUP.md` | Detailed setup instructions for local development | ~4KB |
| `DEPLOYMENT.md` | Production deployment guide for AWS, Heroku, and local servers | ~5KB |
| `QUICK_START.md` | 5-minute quick start guide with common commands | ~3KB |
| `PROJECT_SUMMARY.md` | Architecture, technology stack, and implementation details | ~6KB |
| `FILE_STRUCTURE.md` | This file - complete file structure documentation | ~2KB |

### Frontend Files

#### `frontend/index.html` (~400 lines)
- Single-page application with multiple sections
- Navigation bar with dynamic menu
- Home page with hero section
- Authentication forms (login/register)
- Flight search and listing
- Booking form and confirmation
- My bookings page
- User profile page
- Semantic HTML5 structure
- Accessibility features

#### `frontend/style.css` (~600 lines)
- Responsive design (mobile, tablet, desktop)
- CSS Grid and Flexbox layouts
- Color scheme: Purple gradient (#667eea, #764ba2)
- Animations and transitions
- Form styling
- Card-based layouts
- Navigation bar styling
- Footer styling
- Accessibility features (focus states, reduced motion)
- Media queries for responsive design

#### `frontend/js/api.js` (~150 lines)
- Centralized API communication module
- Generic fetch wrapper with error handling
- User API functions (register, login, profile, etc.)
- Flight API functions (search, list, details)
- Booking API functions (create, cancel, list)
- Authentication data management (localStorage)
- Token management

#### `frontend/js/auth.js` (~100 lines)
- User registration handler
- User login handler
- Logout functionality
- Form toggling (login/register)
- UI updates based on auth status
- Authentication initialization

#### `frontend/js/flights.js` (~150 lines)
- Load all flights
- Search flights by criteria
- Display flights in UI
- Flight selection for booking
- Booked seats display
- Time formatting utilities
- Error handling

#### `frontend/js/booking.js` (~150 lines)
- Booking form submission
- Booking confirmation display
- Load user bookings
- Display bookings list
- Cancel booking functionality
- View booking details
- Booking status management

#### `frontend/js/app.js` (~100 lines)
- Page navigation logic
- Page initialization
- Profile page management
- Profile update handling
- Application startup
- Event listeners

### Backend Files

#### `backend/server.js` (~200 lines)
- Express server initialization
- Middleware setup (CORS, body-parser)
- Route registration
- Error handling
- Health check endpoint
- Graceful shutdown
- Server startup logic

#### `backend/oracle-connection.js` (~300 lines)
- Connection pool management
- Connection initialization
- Connection retrieval and closing
- Query execution helpers
- Transaction support
- Error handling
- Test connection function
- Comprehensive comments

#### `backend/package.json` (~30 lines)
- Project metadata
- Dependencies:
  - express: Web framework
  - oracledb: Oracle driver
  - bcrypt: Password hashing
  - jsonwebtoken: JWT tokens
  - cors: CORS support
  - body-parser: Request parsing
  - dotenv: Environment variables
- Dev dependencies:
  - jest: Testing framework
  - supertest: HTTP testing

#### `backend/.env.example` (~50 lines)
- Database configuration template
- Server configuration template
- Authentication configuration template
- Logging configuration template
- CORS configuration template
- Security configuration template
- Example values for development

#### `backend/controllers/userController.js` (~250 lines)
- User registration with validation
- User login with JWT generation
- Get user profile
- Update user profile
- Change password functionality
- Password hashing with bcrypt
- Input validation
- Error handling

#### `backend/controllers/flightController.js` (~200 lines)
- Get all flights
- Get flight by ID
- Search flights by criteria
- Create flight (admin)
- Update flight (admin)
- Get booked seats for flight
- Input validation
- Error handling

#### `backend/controllers/bookingController.js` (~250 lines)
- Create booking with transaction support
- Get booking by ID
- Get user bookings
- Cancel booking with transaction
- Get flight booking statistics
- Seat availability verification
- Transaction management
- Error handling

#### `backend/routes/users.js` (~100 lines)
- POST /api/users/register
- POST /api/users/login
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/users/change-password
- Route validation
- Error responses

#### `backend/routes/flights.js` (~80 lines)
- GET /api/flights
- GET /api/flights/:id
- POST /api/flights/search
- GET /api/flights/:id/booked-seats
- Route validation
- Error responses

#### `backend/routes/bookings.js` (~100 lines)
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/:id
- DELETE /api/bookings/:id
- GET /api/bookings/flight/:id/stats
- Route validation
- Error responses

#### `backend/middleware/auth.js` (~80 lines)
- JWT token verification
- Token extraction from headers
- User info attachment to request
- Error handling for expired/invalid tokens
- Optional token verification

#### `backend/middleware/validation.js` (~200 lines)
- User registration validation
- User login validation
- Flight search validation
- Booking validation
- Numeric ID validation
- Input sanitization
- Error messages

#### `backend/tests/api.test.js` (~300 lines)
- User registration tests
- User login tests
- Flight search tests
- Booking creation tests
- Booking cancellation tests
- Transaction integrity tests
- Error handling tests
- Health check tests

### Database Files

#### `database/schema.sql` (~400 lines)
- Users table with constraints
- Flights table with constraints
- Bookings table with constraints
- Sequences for auto-increment
- Triggers for ID generation
- Indexes for performance
- Views for common queries
- Comprehensive comments

#### `database/sample-data.sql` (~150 lines)
- Sample users (4 users)
- Sample flights (8 flights)
- Sample bookings (7 bookings)
- Verification queries
- Comments explaining data

## File Statistics

### Code Files
- **JavaScript**: 1,200+ lines
- **HTML**: 400+ lines
- **CSS**: 600+ lines
- **SQL**: 550+ lines
- **JSON**: 30 lines
- **Total Code**: 2,780+ lines

### Documentation Files
- **Markdown**: 1,500+ lines
- **Comments in Code**: 500+ lines
- **Total Documentation**: 2,000+ lines

### Total Project Size
- **Code**: ~2,800 lines
- **Documentation**: ~2,000 lines
- **Total**: ~4,800 lines

## Dependencies

### Backend Dependencies (package.json)
```json
{
  "express": "^4.18.2",
  "oracledb": "^6.0.0",
  "dotenv": "^16.3.1",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.1.2",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2"
}
```

### Dev Dependencies
```json
{
  "jest": "^29.7.0",
  "supertest": "^6.3.3"
}
```

## Key Features by File

### Authentication
- `backend/controllers/userController.js` - Registration, login, password hashing
- `backend/middleware/auth.js` - JWT verification
- `frontend/js/auth.js` - Frontend auth logic

### Database
- `backend/oracle-connection.js` - Connection management
- `database/schema.sql` - Schema definition
- `database/sample-data.sql` - Test data

### API
- `backend/routes/*.js` - Endpoint definitions
- `backend/controllers/*.js` - Business logic
- `backend/middleware/validation.js` - Input validation

### Frontend
- `frontend/index.html` - UI structure
- `frontend/style.css` - Responsive design
- `frontend/js/*.js` - Client logic

## File Access Patterns

### User Registration Flow
1. `frontend/index.html` - Form
2. `frontend/js/auth.js` - Handler
3. `frontend/js/api.js` - API call
4. `backend/routes/users.js` - Route
5. `backend/middleware/validation.js` - Validation
6. `backend/controllers/userController.js` - Logic
7. `backend/oracle-connection.js` - Database

### Flight Booking Flow
1. `frontend/index.html` - UI
2. `frontend/js/booking.js` - Handler
3. `frontend/js/api.js` - API call
4. `backend/routes/bookings.js` - Route
5. `backend/middleware/auth.js` - Authentication
6. `backend/middleware/validation.js` - Validation
7. `backend/controllers/bookingController.js` - Logic
8. `backend/oracle-connection.js` - Transaction

## Configuration Files

### Environment Configuration
- `backend/.env.example` - Template for environment variables
- `backend/.env` - Actual configuration (not in repo)

### Package Configuration
- `backend/package.json` - Node.js project configuration

## Documentation Organization

### Getting Started
1. Start with `README.md` for overview
2. Follow `QUICK_START.md` for 5-minute setup
3. Use `SETUP.md` for detailed instructions

### Development
1. Review `PROJECT_SUMMARY.md` for architecture
2. Check `FILE_STRUCTURE.md` for file organization
3. Read code comments for implementation details

### Deployment
1. Follow `DEPLOYMENT.md` for production setup
2. Use `QUICK_START.md` for common commands
3. Reference `README.md` for API documentation

## File Naming Conventions

### Controllers
- `*Controller.js` - Business logic for specific domain

### Routes
- `*.js` - API routes for specific resource

### Middleware
- `*.js` - Express middleware functions

### Frontend
- `*.html` - HTML pages
- `*.css` - Stylesheets
- `*.js` - JavaScript modules

### Database
- `*.sql` - SQL scripts

### Documentation
- `*.md` - Markdown documentation

## Version Control

### Files to Commit
- All `.js`, `.html`, `.css`, `.sql` files
- All `.md` documentation files
- `package.json`
- `.env.example`

### Files to Ignore
- `.env` (actual configuration)
- `node_modules/` (dependencies)
- `.git/` (version control)
- `*.log` (logs)
- `.DS_Store` (macOS)

## Maintenance Notes

### Regular Updates
- Update dependencies in `package.json`
- Review and update documentation
- Test all functionality
- Check for security vulnerabilities

### Backup Strategy
- Backup database regularly
- Version control for code
- Document changes
- Test disaster recovery

---

**Total Files**: 23 files
**Total Lines**: ~4,800 lines
**Documentation**: ~40% of project
**Code**: ~60% of project

This comprehensive file structure ensures maintainability, scalability, and clear organization of the Flight Booking System.
