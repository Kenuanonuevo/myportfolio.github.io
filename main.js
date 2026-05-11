/* ============================================
   PORTFOLIO — main.js
   Author: Kenu Añonuevo
   ============================================ */

// ─── 1. TYPED.JS — Typing animation ──────────────────────────
const typed = new Typed(".typed-text", {
  strings: ["Network Engineer", "Programmer", "Web Developer", "University Professor"],
  typeSpeed: 80,
  backSpeed: 60,
  backDelay: 1500,
  loop: true,
});


// ─── 2. NAVBAR — Scroll-based background + active link ───────
const header      = document.querySelector(".header");
const navLinks    = document.querySelectorAll(".nav-link");
const sections    = document.querySelectorAll("section[id]");

function updateHeader() {
  // Add shadow/bg after scrolling 50px
  header.classList.toggle("scrolled", window.scrollY > 50);
}

function updateActiveLink() {
  const scrollY = window.scrollY + 100; // offset for header height

  sections.forEach((section) => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute("id");

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveLink();
});

updateHeader(); // run on page load too


// ─── 3. MOBILE MENU — Hamburger toggle ───────────────────────
const menuToggle = document.getElementById("menuToggle");
const navbar     = document.getElementById("navbar");

function toggleMenu(open) {
  const isOpen = open ?? !navbar.classList.contains("open");
  navbar.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? "hidden" : "";
}

menuToggle.addEventListener("click", () => toggleMenu());

// Close menu when a nav link is clicked
navLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    navbar.classList.contains("open") &&
    !navbar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    toggleMenu(false);
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbar.classList.contains("open")) {
    toggleMenu(false);
    menuToggle.focus();
  }
});


// ─── 4. SCROLL REVEAL — Animate elements into view ───────────
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each element slightly
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 100);
        revealObserver.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));


// ─── 5. SKILL BARS — Animate progress bars on scroll ─────────
const skillBars = document.querySelectorAll(".skill-progress");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // The target width is set via CSS custom property --progress
        bar.style.width = bar.style.getPropertyValue("--progress") ||
          getComputedStyle(bar).getPropertyValue("--progress").trim();
        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach((bar) => skillObserver.observe(bar));


// ─── 6. BACK TO TOP BUTTON ───────────────────────────────────
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 400);
});


// ─── 7. CONTACT FORM — Validation + Formspree submit ─────────
const contactForm = document.getElementById("contactForm");
const submitBtn   = document.getElementById("submitBtn");
const formSuccess = document.getElementById("formSuccess");

function showError(input, message) {
  const group = input.closest(".form-group");
  const errorEl = group.querySelector(".form-error");
  input.classList.add("invalid");
  if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
  const group = input.closest(".form-group");
  const errorEl = group.querySelector(".form-error");
  input.classList.remove("invalid");
  if (errorEl) errorEl.textContent = "";
}

function validateForm(form) {
  let valid = true;

  const name  = form.querySelector("#name");
  const email = form.querySelector("#email");
  const msg   = form.querySelector("#message");

  // Clear previous errors
  [name, email, msg].forEach(clearError);

  if (!name.value.trim()) {
    showError(name, "Please enter your name.");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError(email, "Please enter your email.");
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    valid = false;
  }

  if (!msg.value.trim()) {
    showError(msg, "Please enter a message.");
    valid = false;
  }

  return valid;
}

if (contactForm) {
  // Live validation — clear errors as user types
  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => clearError(field));
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) return;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Sending…";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactForm.reset();
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setTimeout(() => {
          formSuccess.hidden = true;
        }, 6000);
      } else {
        alert("Something went wrong. Please try again or email me directly.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").textContent = "Send Message";
    }
  });
}


// ─── 8. FOOTER — Dynamic year ────────────────────────────────
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
