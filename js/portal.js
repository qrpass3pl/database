// portal.js

// CRITICAL: Check authentication before displaying content
authManager.requireAuth();
authManager.checkSession();

const successMessage = document.getElementById("successMessage");

// Update time display
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("timeDisplay").textContent =
    `${hours}:${minutes}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);

// Logout button functionality
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear session/storage through auth manager
  authManager.logout();
  // Show logout message
  successMessage.classList.add("show");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});

// Add interactive card effects
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function () {
    this.style.transform = "scale(0.98)";
    setTimeout(() => {
      this.style.transform = "";
    }, 200);
  });
});

// Animate progress bars on page load
window.addEventListener("load", () => {
  document.querySelectorAll(".progress-fill").forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0";
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
});
