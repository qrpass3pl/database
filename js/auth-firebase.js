// auth-firebase.js - Authentication using Firebase (Alternative Approach)
// Simpler setup, hosted backend, no server management required

import {
  initializeApp,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "./auth";

import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

// ── Firebase Configuration ───────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const authManager = {
  // ── Registration ─────────────────────────────────────────────────────────────

  /**
   * Register a new user with Firebase Authentication and create user profile
   * @param {object} userData - { firstName, lastName, email, password }
   * @returns {Promise<object>} - { success: boolean, message: string, userId?: string }
   */
  async registerUser({ firstName, lastName, email, password }) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email: email.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivityAt: new Date(),
      });

      return {
        success: true,
        message: "Account created successfully!",
        userId: userCredential.user.uid,
      };
    } catch (error) {
      let message = "Registration failed.";
      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      }

      return { success: false, message };
    }
  },

  // ── Login ────────────────────────────────────────────────────────────────────

  /**
   * Login user with email and password
   * @param {object} credentials - { email, password, remember? }
   * @returns {Promise<object>} - { success: boolean, message: string, user?: object }
   */
  async login({ email, password, remember = false }) {
    try {
      // Set persistence before signing in
      const persistence = remember
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();

      // Update last activity
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        { lastActivityAt: new Date() },
        { merge: true }
      );

      return {
        success: true,
        message: "Login successful!",
        user: {
          id: userCredential.user.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      };
    } catch (error) {
      let message = "Login failed.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "Invalid email or password.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many login attempts. Try again later.";
      }

      return { success: false, message };
    }
  },

  // ── Logout ───────────────────────────────────────────────────────────────────

  /**
   * Logout current user
   * @returns {Promise<object>} - { success: boolean, message: string }
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true, message: "Logged out successfully!" };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Logout failed." };
    }
  },

  // ── Authentication State ─────────────────────────────────────────────────────

  /**
   * Get current authenticated user
   * @returns {Promise<object|null>} - User object or null
   */
  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data();

          resolve({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
          });
        } else {
          resolve(null);
        }

        unsubscribe();
      });
    });
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  },

  // ── Session Monitoring ───────────────────────────────────────────────────────

  _monitoringIntervals: [],
  _lastActivityTime: null,

  /**
   * Start monitoring for inactivity timeout
   */
  startSessionMonitoring() {
    this._lastActivityTime = Date.now();

    // Check inactivity every minute
    const checkInterval = setInterval(async () => {
      const elapsed = Date.now() - this._lastActivityTime;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        await this.logout();
        window.location.href = "index.html";
      }
    }, 60 * 1000);

    this._monitoringIntervals.push(checkInterval);

    // Update activity timestamp
    const refreshActivity = () => {
      this._lastActivityTime = Date.now();
      this.updateLastActivity();
    };

    ["click", "keydown", "mousemove", "touchstart", "scroll"].forEach((evt) => {
      document.addEventListener(evt, refreshActivity, { passive: true });
    });
  },

  /**
   * Update last activity timestamp in Firestore
   */
  async updateLastActivity() {
    if (auth.currentUser) {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { lastActivityAt: new Date() },
        { merge: true }
      );
    }
  },

  /**
   * Stop session monitoring
   */
  stopSessionMonitoring() {
    this._monitoringIntervals.forEach((interval) => clearInterval(interval));
    this._monitoringIntervals = [];
  },

  // ── Route Protection ─────────────────────────────────────────────────────────

  /**
   * Require authentication for a page
   */
  async requireAuth(redirectTo = "index.html") {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      window.location.href = redirectTo;
    }
  },

  /**
   * Redirect if already authenticated
   */
  async redirectIfAuth(redirectTo = "dashboard.html") {
    const isAuth = await this.isAuthenticated();
    if (isAuth) {
      window.location.href = redirectTo;
    }
  },

  // ── Real-time User State ─────────────────────────────────────────────────────

  /**
   * Subscribe to authentication state changes
   * @param {function} callback - Called with user object or null
   * @returns {function} - Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
        });
      } else {
        callback(null);
      }
    });
  },

  /**
   * Get JWT token for custom claims
   */
  async getToken() {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  },
};

// Auto-cleanup on page unload
window.addEventListener("beforeunload", () => {
  authManager.stopSessionMonitoring();
});

export default authManager;