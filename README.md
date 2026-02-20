# Authentication System Setup Guide

## Overview

This is a complete authentication system that connects a frontend JavaScript auth manager to a MySQL database via a Node.js/Express backend server.

### Architecture

```
Frontend (HTML/JS)
    ↓
auth-updated.js (API calls)
    ↓
Express Backend (server.js)
    ↓
MySQL Database (users_db)
```

---

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** (comes with Node.js)

---

## Installation Steps

### 1. Set Up MySQL Database

Run the provided SQL script to create the database and table:

```sql
CREATE DATABASE IF NOT EXISTS users_db;
USE users_db;

CREATE TABLE registered_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    session_token VARCHAR(255) UNIQUE,
    INDEX idx_email (email),
    INDEX idx_session_token (session_token),
    INDEX idx_time_created (time_created)
);
```

### 2. Install Node.js Dependencies

```bash
npm install
```

This installs:
- `express` - Web server framework
- `mysql2` - MySQL driver with promise support
- `bcryptjs` - Password hashing (optional for production)
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=users_db
PORT=3000
API_URL=http://localhost:3000/api/auth
```

### 4. Start the Backend Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 5. Use in Frontend

Include the updated `auth-updated.js` in your HTML:

```html
<script src="auth-updated.js"></script>
<script>
  // Register a user
  const registerResult = await authManager.registerUser({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    phone_number: '+1-555-0123'
  });

  // Login
  const loginResult = await authManager.login('john@example.com', 'securePassword123');

  // Check if user is logged in
  if (authManager.isAuthenticated()) {
    const user = authManager.getCurrentUser();
    console.log(`Welcome, ${user.firstName}!`);
  }

  // Logout
  await authManager.logout();
</script>
```

---

## API Endpoints

### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone_number": "+1-555-0123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "userId": 1
}
```

---

### POST /api/auth/login

Authenticate a user and return a session token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "sessionToken": "a1b2c3d4e5f6..."
  }
}
```

---

### POST /api/auth/validate-session

Validate an existing session token.

**Request:**
```json
{
  "sessionToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session valid",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

### POST /api/auth/logout

Invalidate a session token.

**Request:**
```json
{
  "sessionToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Frontend API Methods

### Register User

```javascript
const result = await authManager.registerUser({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  password: 'password123',
  phone_number: '+1-555-9876'
});

if (result.success) {
  console.log('User created:', result.userId);
} else {
  console.log('Error:', result.message);
}
```

### Login

```javascript
const result = await authManager.login('jane@example.com', 'password123');

if (result.success) {
  authManager.setAuth(result.user, true); // true = remember me
  console.log('Logged in:', result.user.firstName);
}
```

### Check Authentication

```javascript
if (authManager.isAuthenticated()) {
  const user = authManager.getCurrentUser();
  console.log('Current user:', user);
}
```

### Protect Routes

```javascript
// Call at the top of protected pages
authManager.requireAuth('login.html');
```

### Session Management

```javascript
// Start session monitoring (auto-logout after 30 mins of inactivity)
authManager.checkSession('login.html');

// Logout
await authManager.logout();
```

### Validate Session

```javascript
const result = await authManager.validateSession();
if (result.success) {
  console.log('Session is valid');
} else {
  console.log('Session expired or invalid');
}
```

---

## Security Considerations

### Production Recommendations

1. **Hash Passwords**: Use bcrypt for password hashing (already imported in server.js)
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **HTTPS Only**: Always use HTTPS in production
   ```javascript
   const API_URL = 'https://api.example.com/api/auth';
   ```

3. **Use HttpOnly Cookies**: Store tokens in httpOnly cookies instead of sessionStorage
   ```javascript
   // Backend should set cookie:
   res.cookie('sessionToken', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict'
   });
   ```

4. **Add Rate Limiting**: Prevent brute force attacks
   ```javascript
   npm install express-rate-limit
   ```

5. **CORS Configuration**: Restrict to your domain
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true
   }));
   ```

6. **Input Validation**: Validate and sanitize all inputs
   ```javascript
   npm install joi  // Schema validation
   ```

7. **JWT Tokens**: Use JSON Web Tokens for stateless sessions
   ```javascript
   npm install jsonwebtoken
   ```

8. **Environment Variables**: Never commit `.env` to version control
   ```bash
   echo ".env" >> .gitignore
   ```

---

## Troubleshooting

### Connection Refused

**Error**: "ECONNREFUSED" when connecting to MySQL

**Solution**: 
- Verify MySQL is running: `mysql -u root -p`
- Check host and credentials in `.env`
- Ensure DB_HOST is correct (127.0.0.1 for local)

### CORS Errors

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:
- Ensure CORS is enabled in server.js
- Check that `API_URL` in auth-updated.js matches the backend URL
- Update CORS origin if hosting on different domain

### Session Token Not Working

**Error**: "Invalid or expired session"

**Solution**:
- Check that token is being stored in sessionStorage/localStorage
- Verify session token matches database entry
- Ensure session timeout hasn't been exceeded (30 minutes default)

### Database Not Saving Data

**Error**: "Database error during registration"

**Solution**:
- Verify email doesn't already exist (UNIQUE constraint)
- Check all required fields are provided
- Ensure database connection is working

---

## File Structure

```
.
├── server.js              # Express backend server
├── auth-updated.js        # Frontend API manager
├── example.html           # Demo HTML page
├── package.json           # Node.js dependencies
├── .env                   # Environment configuration (create from .env.example)
├── .env.example           # Template for .env
└── README.md             # This file
```

---

## Testing

Use a tool like **Postman** or **curl** to test API endpoints:

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "test123"
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## License

MIT License - Feel free to use for your projects!