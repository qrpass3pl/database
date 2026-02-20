// login.js - Login Form Handler (Updated for async auth.js integration)

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const successMessage = document.getElementById("successMessage");
const submitBtn = document.getElementById("submitBtn");

// If already logged in, go straight to the portal
if (authManager.isAuthenticated()) {
  window.location.href = "portal.html";
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Live feedback ──────────────────────────────────────────────────────────────

emailInput.addEventListener("input", () => {
  emailError.classList.remove("show");
  emailInput.classList.remove("error");
});

passwordInput.addEventListener("input", () => {
  passwordError.classList.remove("show");
  passwordInput.classList.remove("error");
});

// ── Form submission ────────────────────────────────────────────────────────────

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset errors
  emailError.classList.remove("show");
  passwordError.classList.remove("show");
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");

  let isValid = true;

  // ── Client-side format checks ──────────────────────────────────────────────
  if (!emailInput.value.trim()) {
    emailError.textContent = "Email is required";
    emailError.classList.add("show");
    emailInput.classList.add("error");
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    emailError.textContent = "Please enter a valid email";
    emailError.classList.add("show");
    emailInput.classList.add("error");
    isValid = false;
  }

  if (!passwordInput.value.trim()) {
    passwordError.textContent = "Password is required";
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    isValid = false;
  }

  if (!isValid) return;

  // ── Credential check ───────────────────────────────────────────────────────
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";

  try {
    // Call auth.js login (now properly awaited)
    const result = await authManager.login(
      emailInput.value.trim(),
      passwordInput.value
    );

    if (!result.success) {
      // Show error on password field (generic message to avoid leaking info)
      passwordError.textContent =
        result.message || "Invalid email or password.";
      passwordError.classList.add("show");
      passwordInput.classList.add("error");
      passwordInput.value = ""; // clear password field on failure
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
      return;
    }

    // ── Success ────────────────────────────────────────────────────────────────
    // Update auth state with "remember me" preference
    authManager.setAuth(result.user, rememberInput.checked);
    
    // Show success feedback
    successMessage.classList.add("show");

    // Redirect to portal after brief success message
    setTimeout(() => {
      window.location.href = "portal.html";
    }, 1000);
  } catch (error) {
    console.error("Login error:", error);
    passwordError.textContent =
      "An unexpected error occurred. Please try again.";
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign In";
  }
});

// ── Social login (placeholder) ────────────────────────────────────────────────
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Social login would be implemented here");
  });
});