// login.js

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const successMessage = document.getElementById("successMessage");
const submitBtn = document.getElementById("submitBtn");

// If already logged in, redirect to portal
if (authManager.isAuthenticated()) {
  window.location.href = "portal.html";
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Clear error on input
emailInput.addEventListener("input", () => {
  emailError.classList.remove("show");
  emailInput.classList.remove("error");
});

passwordInput.addEventListener("input", () => {
  passwordError.classList.remove("show");
  passwordInput.classList.remove("error");
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset errors
  emailError.classList.remove("show");
  passwordError.classList.remove("show");
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");

  let isValid = true;

  // Validate email
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

  // Validate password
  if (!passwordInput.value.trim()) {
    passwordError.textContent = "Password is required";
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    isValid = false;
  }

  if (isValid) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    // Simulate API call
    setTimeout(() => {
      // Store authentication token and user data
      const rememberMe = rememberInput.checked;
      authManager.setAuth(emailInput.value, rememberMe);

      successMessage.classList.add("show");
      setTimeout(() => {
        window.location.href = "portal.html";
      }, 1000);
    }, 1000);
  }
});

// Social login buttons
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Social login would be implemented here");
  });
});
