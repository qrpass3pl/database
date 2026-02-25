# Authentication Setup Guide

Complete integration guide for connecting your login.js, register.js with Firebase through auth.js and server.js.

## Project Structure

```
project-root/
├── public/
│   ├── index.html (login page)
│   ├── register.html (registration page)
│   ├── portal.html (dashboard after login)
│   ├── login.js
│   ├── register.js
│   └── firebaseConfig.js
├── src/
│   ├── auth.js (Client-side auth manager)
│   └── firebaseConfig.js
├── server.js (Backend Express server)
├── .env (Environment variables - create from .env.example)
├── .env.example
├── package.json
└── README.md
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install express cors dotenv firebase-admin
npm install -D nodemon
```

### 2. Set Up Firebase

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Realtime Database

#### B. Get Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely

#### C. Update firebaseConfig.js
Your existing `firebaseConfig.js` should have:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials:
   - `FIREBASE_DATABASE_URL` - from Firebase Console
   - `FIREBASE_SERVICE_ACCOUNT_KEY` - from the JSON file you downloaded

```bash
cp .env.example .env
```

3. Edit `.env` with your credentials:
```
PORT=5000
NODE_ENV=development
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### 4. Update package.json

Add these scripts to your `package.json`:

```json
{
  "name": "auth-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "firebase": "^9.20.0",
    "firebase-admin": "^11.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## File Integration

### auth.js (Client-Side Authentication Manager)

This file provides the `authManager` object used by `login.js` and `register.js`.

**Key Methods:**
- `authManager.registerUser(userData)` - Register new user
- `authManager.login(email, password, rememberMe)` - Login user
- `authManager.logout()` - Logout user
- `authManager.isAuthenticated()` - Check auth status
- `authManager.getCurrentUser()` - Get current user
- `authManager.getUserProfile(userId)` - Fetch user profile
- `authManager.updateUserProfile(userId, updates)` - Update profile

**Usage in register.js:**
```javascript
// Already implemented - calls authManager.registerUser()
const result = await authManager.registerUser({
  firstName: firstNameInput.value.trim(),
  lastName: lastNameInput.value.trim(),
  email: emailInput.value.trim(),
  password: passwordInput.value,
  phone_number: "",
});

if (!result.success) {
  emailError.textContent = result.message;
  emailError.classList.add("show");
  return;
}

// Redirect to login on success
window.location.href = "index.html";
```

**Usage in login.js:**
```javascript
// Already implemented - calls authManager.login()
const result = await authManager.login(
  emailInput.value.trim(),
  passwordInput.value
);

if (!result.success) {
  passwordError.textContent = result.message;
  passwordError.classList.add("show");
  return;
}

// Store auth state and redirect
authManager.setAuth(result.user, rememberInput.checked);
window.location.href = "portal.html";
```

### server.js (Backend Express Server)

Provides API endpoints for authentication and user management.

**API Endpoints:**

#### POST /api/auth/register
Register a new user
```javascript
// Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone_number": "555-1234"
}

// Response
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "uid": "user-id",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Login user
```javascript
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "uid": "user-id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "customToken": "eyJhbGc..."
  }
}
```

#### GET /api/users/:userId
Get user profile
```javascript
// Response
{
  "success": true,
  "message": "User profile fetched",
  "data": {
    "uid": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone_number": "555-1234",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT /api/users/:userId
Update user profile
```javascript
// Request
{
  "firstName": "Jane",
  "phone_number": "555-5678"
}

// Response (returns updated profile)
```

#### POST /api/auth/reset-password
Send password reset email
```javascript
// Request
{
  "email": "john@example.com"
}

// Response
{
  "success": true,
  "message": "Password reset email would be sent"
}
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Production Mode

```bash
npm start
```

## HTML Integration

Your HTML files should include:

### register.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <form id="signupForm">
    <!-- Form fields -->
  </form>
  
  <script type="module" src="firebaseConfig.js"></script>
  <script type="module" src="auth.js"></script>
  <script type="module" src="register.js"></script>
</body>
</html>
```

### login.html (index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <form id="loginForm">
    <!-- Form fields -->
  </form>
  
  <script type="module" src="firebaseConfig.js"></script>
  <script type="module" src="auth.js"></script>
  <script type="module" src="login.js"></script>
</body>
</html>
```

## Firebase Database Structure

Users data is stored in the following structure:

```
users/
├── {uid}/
│   ├── uid: "user-id"
│   ├── firstName: "John"
│   ├── lastName: "Doe"
│   ├── email: "john@example.com"
│   ├── phone_number: "555-1234"
│   ├── createdAt: "2024-01-15T10:30:00.000Z"
│   ├── updatedAt: "2024-01-16T15:45:00.000Z"
│   └── emailVerified: false
```

## Security Notes

1. **API Key in Frontend**: Your Firebase API key is public - this is intentional and secure
2. **Service Account**: Keep `.env` file secure and never commit to version control
3. **Password Validation**: Both client and server validate passwords
4. **Email Verification**: Consider implementing email verification before allowing login
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure CORS properly in production (update `server.js`)

## Troubleshooting

### "User not found" Error
- Ensure Firebase Authentication is enabled in your project
- Check that the user was created successfully in Firebase Console

### "Email already in use" Error
- The email is already registered
- User can use the password reset feature if they forgot their password

### Firebase Config Issues
- Verify all credentials in `firebaseConfig.js` match your Firebase project
- Check that Realtime Database is enabled

### Server Connection Issues
- Ensure server is running (`npm run dev`)
- Check that port 5000 is not in use
- Verify CORS is enabled for your frontend URL

### Database Permission Issues
In Firebase Console, set these rules for development:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Next Steps

1. **Email Verification**: Add email verification before allowing login
2. **Password Reset**: Implement sendgrid to send password reset emails
3. **Social Login**: Add GitHub/Google authentication
4. **Token Refresh**: Implement automatic token refresh
5. **Session Management**: Add session timeout and refresh logic
6. **User Dashboard**: Create portal.html with user profile management

## Support

For Firebase issues, visit: https://firebase.google.com/docs
For Express issues, visit: https://expressjs.com/en/api.html