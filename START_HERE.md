# 🚀 Flight Booking System - START HERE

Welcome to the Flight Booking System! This is your entry point to understanding and running the complete application.

## 📖 Where to Start?

### 🎯 I want to...

#### **Get the system running in 5 minutes**
→ Read: [`QUICK_START.md`](QUICK_START.md)

#### **Understand the project structure**
→ Read: [`README.md`](README.md)

#### **Set up the system step-by-step**
→ Read: [`SETUP.md`](SETUP.md)

#### **Deploy to production**
→ Read: [`DEPLOYMENT.md`](DEPLOYMENT.md)

#### **Understand the architecture**
→ Read: [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)

#### **See all files and their purposes**
→ Read: [`FILE_STRUCTURE.md`](FILE_STRUCTURE.md)

#### **Check what was completed**
→ Read: [`COMPLETION_SUMMARY.md`](COMPLETION_SUMMARY.md)

---

## 🏃 Quick Start (5 Minutes)

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Oracle credentials
npm start
```

### Step 2: Database Setup
```bash
sqlplus system/password@orcl
@database/schema.sql
@database/sample-data.sql
exit
```

### Step 3: Frontend
```bash
cd frontend
open index.html
# Or: python3 -m http.server 8000
```

### Step 4: Test
1. Register a new user
2. Login
3. Search for flights
4. Make a booking
5. View your bookings

---

## 📚 Documentation Guide

### For Different Roles

#### **Project Manager**
1. [`README.md`](README.md) - Project overview
2. [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - Architecture and features
3. [`COMPLETION_SUMMARY.md`](COMPLETION_SUMMARY.md) - What was delivered

#### **Developer**
1. [`SETUP.md`](SETUP.md) - Development setup
2. [`FILE_STRUCTURE.md`](FILE_STRUCTURE.md) - Code organization
3. Code comments in each file
4. [`README.md`](README.md) - API documentation

#### **DevOps/System Admin**
1. [`DEPLOYMENT.md`](DEPLOYMENT.md) - Production deployment
2. [`SETUP.md`](SETUP.md) - Environment setup
3. [`QUICK_START.md`](QUICK_START.md) - Common commands

#### **QA/Tester**
1. [`QUICK_START.md`](QUICK_START.md) - How to run
2. [`README.md`](README.md) - Features and API
3. `backend/tests/api.test.js` - Test examples

---

## 🎯 Key Features

### ✅ User Management
- User registration with validation
- Secure login with JWT tokens
- Profile management
- Password change

### ✅ Flight Management
- Browse all flights
- Search by route and date
- View flight details
- Real-time seat availability

### ✅ Booking System
- Create bookings with seat selection
- Transactional booking (ACID)
- View booking history
- Cancel bookings

### ✅ Security
- JWT authentication
- Password hashing (bcrypt)
- Input validation
- SQL injection prevention

---

## 📁 Project Structure

```
ATBS/
├── frontend/              # User interface
│   ├── index.html        # Main page
│   ├── style.css         # Styling
│   └── js/               # JavaScript modules
├── backend/              # API server
│   ├── server.js         # Express server
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication & validation
│   └── tests/            # Test suite
├── database/             # Database scripts
│   ├── schema.sql        # Database schema
│   └── sample-data.sql   # Sample data
���── *.md                  # Documentation
```

---

## 🔧 Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API for HTTP requests
- Responsive design

### Backend
- Node.js with Express.js
- Oracle database driver (oracledb)
- JWT authentication
- Bcrypt password hashing

### Database
- Oracle 11g
- Connection pooling
- ACID transactions

---

## 🚀 API Endpoints

### Users
```
POST   /api/users/register              Register new user
POST   /api/users/login                 User login
GET    /api/users/profile               Get profile (auth required)
PUT    /api/users/profile               Update profile (auth required)
POST   /api/users/change-password       Change password (auth required)
```

### Flights
```
GET    /api/flights                     Get all flights
GET    /api/flights/:id                 Get flight details
POST   /api/flights/search              Search flights
GET    /api/flights/:id/booked-seats    Get booked seats
```

### Bookings
```
POST   /api/bookings                    Create booking (auth required)
GET    /api/bookings                    Get user bookings (auth required)
GET    /api/bookings/:id                Get booking details (auth required)
DELETE /api/bookings/:id                Cancel booking (auth required)
```

---

## 🧪 Testing

### Run Tests
```bash
cd backend
npm test
```

### Manual Testing
1. Register a new user
2. Login with credentials
3. Search for flights
4. Create a booking
5. View bookings
6. Cancel a booking

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ CORS protection
- ✅ Secure session management

---

## 📊 Project Statistics

- **Total Files**: 30
- **Total Lines**: ~4,800
- **Code**: ~2,800 lines
- **Documentation**: ~2,000 lines
- **Test Coverage**: User, Flight, Booking, Transaction

---

## 🆘 Troubleshooting

### Cannot connect to database
```bash
# Check Oracle is running
sqlplus system/password@orcl

# Verify connection string in .env
# Format: hostname:port/database_name
```

### Port 3000 already in use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### CORS errors
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:8000
```

### JWT token errors
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📞 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| `README.md` | Project overview & API docs | 10 min |
| `QUICK_START.md` | 5-minute setup guide | 5 min |
| `SETUP.md` | Detailed setup instructions | 15 min |
| `DEPLOYMENT.md` | Production deployment | 20 min |
| `PROJECT_SUMMARY.md` | Architecture & features | 15 min |
| `FILE_STRUCTURE.md` | File organization | 10 min |
| `COMPLETION_SUMMARY.md` | What was delivered | 10 min |

---

## ✨ Next Steps

### 1. Get It Running
- Follow [`QUICK_START.md`](QUICK_START.md)
- Test all features
- Verify everything works

### 2. Understand It
- Read [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)
- Review code structure
- Check API documentation

### 3. Customize It
- Modify styles in `frontend/style.css`
- Add new features in controllers
- Extend database schema

### 4. Deploy It
- Follow [`DEPLOYMENT.md`](DEPLOYMENT.md)
- Setup production environment
- Configure security

---

## 🎓 Learning Resources

### Understanding the Code
1. Start with `frontend/index.html` - See the UI structure
2. Check `frontend/js/api.js` - See how API calls work
3. Review `backend/server.js` - See how server is setup
4. Study `backend/controllers/` - See business logic
5. Examine `database/schema.sql` - See data structure

### Understanding the Flow
1. **User Registration**: `frontend/js/auth.js` → `backend/routes/users.js` → `backend/controllers/userController.js`
2. **Flight Search**: `frontend/js/flights.js` → `backend/routes/flights.js` → `backend/controllers/flightController.js`
3. **Booking**: `frontend/js/booking.js` → `backend/routes/bookings.js` → `backend/controllers/bookingController.js`

---

## 🎉 You're Ready!

Everything is set up and ready to go. Choose your starting point above and begin exploring the Flight Booking System.

### Quick Links
- 🚀 **Quick Start**: [`QUICK_START.md`](QUICK_START.md)
- 📖 **Full Documentation**: [`README.md`](README.md)
- 🏗️ **Architecture**: [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)
- 🚢 **Deployment**: [`DEPLOYMENT.md`](DEPLOYMENT.md)

---

**Happy coding! 🎊**

For questions or issues, refer to the relevant documentation file or check the code comments.
