# Flight Booking System - Deployment Guide

## Overview

This guide provides step-by-step instructions to deploy the Flight Booking System on a local or cloud server.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Oracle Database 11g or higher
- Git (optional, for version control)

## Local Development Deployment

### Step 1: Environment Setup

1. **Install Node.js**
   ```bash
   # On Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # On macOS
   brew install node

   # On Windows
   # Download from https://nodejs.org/
   ```

2. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

### Step 2: Oracle Database Setup

1. **Install Oracle Database**
   - Download from https://www.oracle.com/database/
   - Follow installation instructions for your OS
   - Note the connection string (e.g., `localhost:1521/orcl`)

2. **Create Database Schema**
   ```bash
   # Connect to Oracle SQL*Plus
   sqlplus system/password@orcl

   # Execute schema script
   @database/schema.sql

   # Load sample data (optional)
   @database/sample-data.sql

   # Exit SQL*Plus
   exit
   ```

3. **Create Database User (Optional)**
   ```sql
   CREATE USER flightbooking IDENTIFIED BY password;
   GRANT CONNECT, RESOURCE TO flightbooking;
   GRANT CREATE SESSION TO flightbooking;
   ```

### Step 3: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   # Copy example file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Configure .env File**
   ```
   DB_USER=your_oracle_username
   DB_PASSWORD=your_oracle_password
   DB_CONNECTION_STRING=localhost:1521/orcl
   JWT_SECRET=your_super_secret_key_here
   PORT=3000
   NODE_ENV=development
   ```

5. **Start Backend Server**
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

### Step 4: Frontend Setup

1. **Open Frontend in Browser**
   ```bash
   # Navigate to frontend directory
   cd frontend

   # Open index.html in browser
   # Option 1: Direct file
   open index.html

   # Option 2: Using Python HTTP server
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Verify Frontend Connection**
   - Open browser console (F12)
   - Check for any CORS or connection errors
   - Verify API calls are reaching backend

### Step 5: Testing

1. **Run Backend Tests**
   ```bash
   cd backend
   npm test
   ```

2. **Manual Testing**
   - Register a new user
   - Login with credentials
   - Search for flights
   - Create a booking
   - View bookings
   - Cancel a booking

## Cloud Deployment

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS AMI
   - Select t2.micro or larger instance type
   - Configure security groups:
     - Allow SSH (port 22)
     - Allow HTTP (port 80)
     - Allow HTTPS (port 443)
     - Allow custom TCP (port 3000) for backend

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git

   # Install Oracle client libraries
   sudo apt install -y libaio1
   ```

4. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd ATBS
   ```

5. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with production values
   nano .env
   ```

6. **Setup Frontend**
   ```bash
   cd ../frontend
   # Update API_BASE_URL in js/api.js to point to your server
   sed -i 's|http://localhost:3000|http://your-server-ip:3000|g' js/api.js
   ```

7. **Start Backend with PM2**
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name "flight-booking"
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install -y nginx

   # Create Nginx config
   sudo nano /etc/nginx/sites-available/flight-booking
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Backend API
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Frontend
       location / {
           root /home/ubuntu/ATBS/frontend;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

9. **Enable Nginx Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/flight-booking /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set DB_USER=your_username
   heroku config:set DB_PASSWORD=your_password
   heroku config:set DB_CONNECTION_STRING=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## Production Best Practices

### Security

1. **Use HTTPS**
   ```bash
   # Install SSL certificate (Let's Encrypt)
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d your-domain.com
   ```

2. **Environment Variables**
   - Never commit .env file
   - Use strong JWT secret
   - Use strong database password
   - Rotate secrets regularly

3. **Database Security**
   - Use connection pooling
   - Implement query timeouts
   - Regular backups
   - Monitor database logs

4. **API Security**
   - Implement rate limiting
   - Use CORS properly
   - Validate all inputs
   - Implement request logging

### Performance

1. **Database Optimization**
   - Create indexes on frequently queried columns
   - Monitor query performance
   - Use connection pooling

2. **Caching**
   - Implement Redis for session storage
   - Cache flight data
   - Use CDN for static files

3. **Monitoring**
   - Setup error logging (e.g., Sentry)
   - Monitor server resources
   - Track API response times
   - Alert on errors

### Maintenance

1. **Regular Updates**
   ```bash
   # Update dependencies
   npm update

   # Check for vulnerabilities
   npm audit
   npm audit fix
   ```

2. **Backups**
   - Daily database backups
   - Store backups in separate location
   - Test restore procedures

3. **Logging**
   - Implement centralized logging
   - Monitor application logs
   - Archive old logs

## Troubleshooting

### Database Connection Issues

```bash
# Test Oracle connection
sqlplus username/password@connection_string

# Check connection string format
# Format: hostname:port/database_name
# Example: localhost:1521/orcl
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### CORS Errors

```javascript
// Update CORS_ORIGIN in .env
CORS_ORIGIN=http://your-frontend-url:port
```

### JWT Token Issues

```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in .env
JWT_SECRET=new_secret_here
```

## Monitoring and Logs

### View Backend Logs

```bash
# With PM2
pm2 logs flight-booking

# With systemd
journalctl -u flight-booking -f
```

### Monitor Server Resources

```bash
# CPU and Memory
top

# Disk usage
df -h

# Network connections
netstat -an | grep 3000
```

## Rollback Procedures

```bash
# With PM2
pm2 restart flight-booking

# With systemd
sudo systemctl restart flight-booking

# With Docker
docker restart flight-booking-container
```

## Support and Documentation

- Backend API Documentation: See README.md
- Database Schema: See database/schema.sql
- Frontend Code: See frontend/js/
- Test Suite: See backend/tests/

## Contact

For issues or questions, please refer to the project documentation or contact the development team.
