// Authentication Management
class AuthManager {
  constructor() {
    this.TOKEN_KEY = "authToken";
    this.USER_KEY = "user";
    this.TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Check if user is logged in
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token has expired
    const user = this.getUser();
    if (!user || !user.loginTime) return false;

    const now = Date.now();
    const loginTime = user.loginTime;
    const isExpired = now - loginTime > this.TOKEN_EXPIRY;

    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }

  // Get stored authentication token
  getToken() {
    return (
      sessionStorage.getItem(this.TOKEN_KEY) ||
      localStorage.getItem(this.TOKEN_KEY)
    );
  }

  // Get stored user data
  getUser() {
    const user =
      sessionStorage.getItem(this.USER_KEY) ||
      localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Store authentication after login
  setAuth(email, rememberMe = false) {
    const token =
      "token_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    const user = {
      email: email,
      loginTime: Date.now(),
      lastActivity: Date.now(),
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, token);
    storage.setItem(this.USER_KEY, JSON.stringify(user));

    return token;
  }

  // Clear authentication
  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Update last activity timestamp
  updateActivity() {
    const user = this.getUser();
    if (user) {
      user.lastActivity = Date.now();
      const storage = localStorage.getItem(this.USER_KEY)
        ? localStorage
        : sessionStorage;
      storage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  // Require authentication - redirect to login if not authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      // Show message before redirecting
      const message = document.createElement("div");
      message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;

      message.innerHTML = `
        <div style="text-align: center;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">⛔ Access Denied</h2>
          <p style="margin: 0 0 20px 0; font-size: 16px;">Please log in to access this page.</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">Redirecting to login...</p>
        </div>
      `;

      document.body.appendChild(message);

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);

      return false;
    }
    return true;
  }
}

// Create global instance
const authManager = new AuthManager();

// Monitor user activity
document.addEventListener("mousemove", () => authManager.updateActivity());
document.addEventListener("keypress", () => authManager.updateActivity());
document.addEventListener("click", () => authManager.updateActivity());
