// register.js

const form = document.getElementById("signupForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const termsCheckbox = document.getElementById("terms");
const passwordStrength = document.getElementById("passwordStrength");

const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const termsError = document.getElementById("termsError");
const successMessage = document.getElementById("successMessage");
const submitBtn = document.getElementById("submitBtn");

// If already logged in, skip registration
if (authManager.isAuthenticated()) {
  window.location.href = "portal.html";
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(password) {
  if (password.length < 8) return "weak";
  let strength = 0;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  if (strength <= 1) return "weak";
  if (strength <= 2) return "fair";
  return "strong";
}

// ── Live feedback ──────────────────────────────────────────────────────────────

passwordInput.addEventListener("input", () => {
  if (passwordInput.value) {
    const strength = getPasswordStrength(passwordInput.value);
    passwordStrength.className = `password-strength show ${strength}`;
  } else {
    passwordStrength.classList.remove("show");
  }
  passwordError.classList.remove("show");
  passwordInput.classList.remove("error");
});

firstNameInput.addEventListener("input", () => {
  firstNameError.classList.remove("show");
  firstNameInput.classList.remove("error");
});

lastNameInput.addEventListener("input", () => {
  lastNameError.classList.remove("show");
  lastNameInput.classList.remove("error");
});

emailInput.addEventListener("input", () => {
  emailError.classList.remove("show");
  emailInput.classList.remove("error");
});

confirmPasswordInput.addEventListener("input", () => {
  confirmPasswordError.classList.remove("show");
  confirmPasswordInput.classList.remove("error");
});

termsCheckbox.addEventListener("change", () => {
  termsError.classList.remove("show");
});

// ── Form submission ────────────────────────────────────────────────────────────

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset all error states
  [firstNameError, lastNameError, emailError, passwordError, confirmPasswordError, termsError]
    .forEach((el) => el.classList.remove("show"));
  [firstNameInput, lastNameInput, emailInput, passwordInput, confirmPasswordInput]
    .forEach((el) => el.classList.remove("error"));

  let isValid = true;

  if (!firstNameInput.value.trim()) {
    firstNameError.textContent = "First name is required";
    firstNameError.classList.add("show");
    firstNameInput.classList.add("error");
    isValid = false;
  }

  if (!lastNameInput.value.trim()) {
    lastNameError.textContent = "Last name is required";
    lastNameError.classList.add("show");
    lastNameInput.classList.add("error");
    isValid = false;
  }

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
  } else if (passwordInput.value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters";
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    isValid = false;
  }

  if (!confirmPasswordInput.value.trim()) {
    confirmPasswordError.textContent = "Please confirm your password";
    confirmPasswordError.classList.add("show");
    confirmPasswordInput.classList.add("error");
    isValid = false;
  } else if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordError.textContent = "Passwords do not match";
    confirmPasswordError.classList.add("show");
    confirmPasswordInput.classList.add("error");
    isValid = false;
  }

  if (!termsCheckbox.checked) {
    termsError.textContent = "You must agree to the terms and conditions";
    termsError.classList.add("show");
    isValid = false;
  }

  if (!isValid) return;

  // ── All client-side checks passed — attempt registration ──────────────────
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";

  // Check for duplicate email BEFORE the fake delay so feedback is instant
  const result = authManager.registerUser({
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
  });

  if (!result.success) {
    // Duplicate email — surface the error on the email field
    emailError.textContent = result.message;
    emailError.classList.add("show");
    emailInput.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
    return;
  }

  // Simulate network latency, then redirect
  setTimeout(() => {
    successMessage.classList.add("show");
    setTimeout(() => {
      window.location.href = "index.html"; // go to login page
    }, 1500);
  }, 1000);
});

// ── Social sign-up (placeholder) ─────────────────────────────────────────────
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Social signup would be implemented here");
  });
});