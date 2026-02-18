// auth.js

const authManager = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  SESSION_KEY: 'auth_session',

  // Check if user is authenticated (checks both localStorage and sessionStorage)
  isAuthenticated() {
    return !!(
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.SESSION_KEY)
    );
  },

  // Set authentication data after login
  setAuth(email, rememberMe = false) {
    const token = btoa(email + ':' + Date.now()); // simple token
    const userData = { email, loginTime: Date.now() };

    if (rememberMe) {
      // Persist across browser sessions
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    } else {
      // Only for current browser session
      sessionStorage.setItem(this.SESSION_KEY, token);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  },

  // Get current user data
  getUser() {
    const raw =
      localStorage.getItem(this.USER_KEY) ||
      sessionStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  // Logout: clear all auth data
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  },

  // Call this on protected pages — redirects to index.html if not logged in
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
    }
  },

  // Call this to validate session is still active (optional extra check)
  checkSession() {
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
    }
  }
};