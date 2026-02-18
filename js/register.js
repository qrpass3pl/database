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

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Password strength calculator
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

// Update password strength indicator
passwordInput.addEventListener("input", () => {
  if (passwordInput.value) {
    const strength = getPasswordStrength(passwordInput.value);
    passwordStrength.classList.add("show");
    passwordStrength.className = `password-strength show ${strength}`;
  } else {
    passwordStrength.classList.remove("show");
  }

  if (passwordError.classList.contains("show")) {
    passwordError.classList.remove("show");
    passwordInput.classList.remove("error");
  }
});

// Clear errors on input
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

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset errors
  firstNameError.classList.remove("show");
  lastNameError.classList.remove("show");
  emailError.classList.remove("show");
  passwordError.classList.remove("show");
  confirmPasswordError.classList.remove("show");
  termsError.classList.remove("show");

  firstNameInput.classList.remove("error");
  lastNameInput.classList.remove("error");
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");
  confirmPasswordInput.classList.remove("error");

  let isValid = true;

  // Validate first name
  if (!firstNameInput.value.trim()) {
    firstNameError.textContent = "First name is required";
    firstNameError.classList.add("show");
    firstNameInput.classList.add("error");
    isValid = false;
  }

  // Validate last name
  if (!lastNameInput.value.trim()) {
    lastNameError.textContent = "Last name is required";
    lastNameError.classList.add("show");
    lastNameInput.classList.add("error");
    isValid = false;
  }

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
  } else if (passwordInput.value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters";
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    isValid = false;
  }

  // Validate confirm password
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

  // Validate terms
  if (!termsCheckbox.checked) {
    termsError.textContent = "You must agree to the terms and conditions";
    termsError.classList.add("show");
    isValid = false;
  }

  if (isValid) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";

    // Simulate API call
    setTimeout(() => {
      successMessage.classList.add("show");
      setTimeout(() => {
        alert(
          "Account created successfully!\n\nName: " +
            firstNameInput.value +
            " " +
            lastNameInput.value +
            "\nEmail: " +
            emailInput.value +
            "\n\nRedirecting to login...",
        );
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
        form.reset();
        successMessage.classList.remove("show");
        passwordStrength.classList.remove("show");
        // In a real app, redirect to login page
        // window.location.href = 'login.html';
      }, 1500);
    }, 1000);
  }
});

// Social signup buttons
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Social signup would be implemented here");
  });
});
