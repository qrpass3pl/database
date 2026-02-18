// auth.js - Authentication Manager
// Handles user registration storage and login validation

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const authManager = {
  // ── Storage helpers ──────────────────────────────────────────────────────────

  /** Return all registered users from localStorage */
  getUsers() {
    return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  },

  /** Persist the users array back to localStorage */
  saveUsers(users) {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  },

  // ── Registration ─────────────────────────────────────────────────────────────

  /**
   * Register a new user.
   * @returns {{ success: boolean, message: string }}
   */
  registerUser({ firstName, lastName, email, password }) {
    const users = this.getUsers();

    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }

    users.push({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    });

    this.saveUsers(users);
    return { success: true, message: "Account created successfully!" };
  },

  // ── Login / Session ──────────────────────────────────────────────────────────

  /**
   * Validate credentials against stored users.
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    return { success: true, message: "Login successful!", user };
  },

  /**
   * Persist the logged-in user to session / local storage.
   * @param {object} user      - The matched user object
   * @param {boolean} remember - Whether to persist across browser sessions
   */
  setAuth(user, remember = false) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      loggedInAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(), // ← tracked for checkSession
    };

    if (remember) {
      localStorage.setItem("currentUser", JSON.stringify(payload));
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(payload));
    }
  },

  /** Return the currently logged-in user, or null */
  getCurrentUser() {
    const data =
      sessionStorage.getItem("currentUser") ||
      localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
  },

  /** True when a user session exists */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /** Clear the active session (logout) */
  logout() {
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("currentUser");
  },

  // ── Route guard ──────────────────────────────────────────────────────────────

  /**
   * Redirect unauthenticated visitors to the login page.
   * Call this at the top of every protected page.
   */
  requireAuth(redirectTo = "index.html") {
    if (!this.isAuthenticated()) {
      window.location.href = redirectTo;
    }
  },

  // ── Session timeout ──────────────────────────────────────────────────────────

  /**
   * Enforce an inactivity timeout and keep lastActivityAt fresh.
   * Logs the user out and redirects if the session has gone stale.
   * Call once on page load; attach activity listeners automatically.
   */
  checkSession(redirectTo = "index.html") {
    const _enforce = () => {
      const user = this.getCurrentUser();
      if (!user) return; // already logged out

      const elapsed = Date.now() - new Date(user.lastActivityAt).getTime();
      if (elapsed >= SESSION_TIMEOUT_MS) {
        this.logout();
        window.location.href = redirectTo;
      }
    };

    const _refresh = () => {
      // Update lastActivityAt in whichever storage holds the session
      const raw =
        sessionStorage.getItem("currentUser") ||
        localStorage.getItem("currentUser");
      if (!raw) return;

      const user = JSON.parse(raw);
      user.lastActivityAt = new Date().toISOString();

      if (sessionStorage.getItem("currentUser")) {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    };

    // Check once immediately, then poll every minute
    _enforce();
    setInterval(_enforce, 60 * 1000);

    // Refresh the activity timestamp on meaningful user interactions
    ["click", "keydown", "mousemove", "touchstart", "scroll"].forEach((evt) =>
      document.addEventListener(evt, _refresh, { passive: true })
    );
  },
};