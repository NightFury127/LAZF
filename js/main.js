// DOM Elements
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
const authButtons = document.querySelector(".auth-buttons");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const modalCloseButtons = document.querySelectorAll(".modal-close");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const serviceCards = document.querySelectorAll(".cash-card");
const ctaButton = document.querySelector(".cta-button");

// Check if DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set active nav link based on current page
  setActiveNavLink();

  // Add animation to service cards
  animateServiceCards();
});

// Mobile Menu Toggle
if (mobileMenuBtn) {
  // Add CSS classes for mobile menu states
  const mobileMenuStyles = document.createElement("style");
  mobileMenuStyles.textContent = `
    .nav-links.mobile-active {
      display: flex !important;
      position: absolute;
      flex-direction: column;
      top: 80px;
      left: 0;
      width: 100%;
      background-color: var(--dark);
      padding: 20px;
      z-index: 100;
    }

    .auth-buttons.mobile-active {
      display: flex !important;
      position: absolute;
      flex-direction: column;
      left: 0;
      width: 100%;
      background-color: var(--dark);
      padding: 0 20px 20px 20px;
      z-index: 100;
    }
  `;
  document.head.appendChild(mobileMenuStyles);

  // Toggle classes instead of directly manipulating styles
  mobileMenuBtn.addEventListener("click", () => {
    const isExpanded = navLinks.classList.contains("mobile-active");

    // Toggle mobile menu classes
    navLinks.classList.toggle("mobile-active");
    authButtons.classList.toggle("mobile-active");

    // Update ARIA attributes for accessibility
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);

    // Update auth buttons position based on nav links height
    if (navLinks.classList.contains("mobile-active")) {
      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        authButtons.style.top = navLinks.offsetHeight + 80 + "px";
      });
    }
  });
}

// Modal Functions
function openModal(modal) {
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal when clicking outside content
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target);
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal.active");
    if (activeModal) {
      closeModal(activeModal);
    }
  }
});

// Modal close buttons
if (modalCloseButtons) {
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });
}

// Login Button
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(loginModal);
  });
}

// Register Button
if (registerBtn) {
  registerBtn.addEventListener("click", (e) => {
    // Don't prevent default - let the link navigate to signup.html
    // This will show the full signup form with phone number field
    // e.preventDefault();
    // openModal(registerModal);
    window.location.href = "signup.html";
  });
}

// Toast notification system
// Add toast styles to document once
(function setupToastSystem() {
  const toastStyles = document.createElement("style");
  toastStyles.textContent = `
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 300px;
    }

    .toast {
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(120%);
      transition: transform 0.3s ease;
      color: white;
      font-size: 14px;
    }

    .toast.active {
      transform: translateX(0);
    }

    .toast.success {
      background-color: #4CAF50;
    }

    .toast.error {
      background-color: #F44336;
    }

    .toast.info {
      background-color: #2196F3;
    }

    .toast.warning {
      background-color: #FF9800;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        transition: none;
      }
    }
  `;
  document.head.appendChild(toastStyles);

  // Create toast container once
  const toastContainer = document.createElement("div");
  toastContainer.className = "toast-container";
  document.body.appendChild(toastContainer);
})();

// Toast notification function
function showToast(message, type = "success", duration = 3000) {
  // Get toast container
  const toastContainer = document.querySelector(".toast-container");

  // Create new toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Add to container
  toastContainer.appendChild(toast);

  // Use requestAnimationFrame for smoother animations
  requestAnimationFrame(() => {
    // Force a reflow to ensure the transition works
    toast.offsetHeight;
    toast.classList.add("active");
  });

  // Set up removal with animation
  const removeToast = () => {
    toast.classList.remove("active");

    // Use transitionend event instead of setTimeout
    toast.addEventListener(
      "transitionend",
      () => {
        toast.remove();
      },
      { once: true }
    );
  };

  // Auto-remove after duration
  const timeoutId = setTimeout(removeToast, duration);

  // Allow clicking to dismiss
  toast.addEventListener("click", () => {
    clearTimeout(timeoutId);
    removeToast();
  });

  return toast;
}

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "index.html" && href === "#")
    ) {
      link.classList.add("active");
    }
  });
}

// Animate service cards on scroll
function animateServiceCards() {
  if (!serviceCards.length) return;

  // Add CSS for animations instead of inline styles
  const cardAnimationStyles = document.createElement("style");
  cardAnimationStyles.textContent = `
    .cash-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      will-change: opacity, transform;
    }

    .cash-card.visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      .cash-card {
        transition: none;
        opacity: 1;
        transform: none;
      }
    }
  `;
  document.head.appendChild(cardAnimationStyles);

  // Use IntersectionObserver for efficient scroll detection
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for smoother animations
          requestAnimationFrame(() => {
            // Stagger the animations
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is in view
    }
  );

  // Observe all service cards
  serviceCards.forEach((card) => observer.observe(card));
}

// CTA Button click
if (ctaButton) {
  ctaButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "contact.html";
  });
}
