/* ==========================================================
   JV PERSONAL PORTFOLIO - script.js
   Features:
     1. Mobile menu toggle
     2. Active nav link while scrolling (scroll-spy)
     3. Typing effect for the role text
     4. Fade-in animation on scroll
     5. Back-to-top button
     6. Contact form (opens the visitor's email app)
     7. Footer year + "Coming soon" hint on disabled buttons
   All styles for these live in style.css.
   ========================================================== */

(function () {
  "use strict";

  const OWNER_EMAIL = "jayvevalero23@gmail.com";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ----------------------------------------------------------
     1. MOBILE MENU
  ---------------------------------------------------------- */
  const header = document.querySelector("header");
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");

  function setMenu(open) {
    navLinks.classList.toggle("active", open);
    menuIcon.classList.toggle("fa-bars", !open);
    menuIcon.classList.toggle("fa-xmark", open);
    menuIcon.setAttribute("aria-expanded", String(open));
  }

  if (menuIcon && navLinks) {
    // Make the icon behave like a real button (keyboard + screen readers)
    menuIcon.setAttribute("role", "button");
    menuIcon.setAttribute("tabindex", "0");
    menuIcon.setAttribute("aria-label", "Toggle navigation menu");
    menuIcon.setAttribute("aria-controls", "nav-links");
    menuIcon.setAttribute("aria-expanded", "false");

    const toggleMenu = () => setMenu(!navLinks.classList.contains("active"));

    menuIcon.addEventListener("click", toggleMenu);
    menuIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close after tapping a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Close when clicking outside the header
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        header &&
        !header.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    // Close with Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setMenu(false);
        menuIcon.focus();
      }
    });

    // Reset when the screen grows to desktop size
    window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
      if (!e.matches) setMenu(false);
    });
  }

  /* ----------------------------------------------------------
     2. ACTIVE NAV LINK (SCROLL-SPY)
  ---------------------------------------------------------- */
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window && navAnchors.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navAnchors.forEach((a) => {
            const isCurrent = a.getAttribute("href") === `#${entry.target.id}`;
            a.classList.toggle("current", isCurrent);
            if (isCurrent) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      // A section is "current" when it crosses the middle of the screen
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => spy.observe(section));
  }

  /* ----------------------------------------------------------
     3. TYPING EFFECT
  ---------------------------------------------------------- */
  const roleText = document.querySelector(".role");

  if (roleText && !prefersReducedMotion) {
    const roles = [
      "Upcoming Web Developer",
      "Aspiring Software Developer",
      "Aspiring Game Developer",
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length; // page starts with the first role fully shown
    let deleting = true;

    roleText.classList.add("typing-cursor");

    function typeTick() {
      const current = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      roleText.textContent = current.slice(0, charIndex);

      let delay = deleting ? 40 : 80;

      if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 1800; // pause once fully typed
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400; // short pause before the next role
      }

      setTimeout(typeTick, delay);
    }

    setTimeout(typeTick, 2000);
  }

  /* ----------------------------------------------------------
     4. FADE-IN ON SCROLL
  ---------------------------------------------------------- */
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".section-title, .grid-card, .skills img, .projects-card, .contact-container",
    );

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add("reveal-in");
          observer.unobserve(el);

          // Clean up so the normal hover effects work as usual
          setTimeout(() => {
            el.classList.remove("reveal", "reveal-in");
            el.style.transitionDelay = "";
          }, 1200);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    revealTargets.forEach((el) => {
      // Small stagger so cards appear one after another
      const index = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = `${Math.min(index, 3) * 100}ms`;
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     5. BACK-TO-TOP BUTTON
  ---------------------------------------------------------- */
  const topBtn = document.querySelector(".back-to-top");

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });

    let scrollTicking = false;

    const updateTopButton = () => {
      topBtn.classList.toggle("show", window.scrollY > 500);
      scrollTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(updateTopButton);
        }
      },
      { passive: true },
    );

    updateTopButton();
  }

  /* ----------------------------------------------------------
     6. CONTACT FORM
     This is a static site (no server), so instead of storing the
     email, the form checks it and opens the visitor's email app
     with a message already addressed to you.
  ---------------------------------------------------------- */
  const form = document.getElementById("contact-form");

  if (form) {
    const emailInput = document.getElementById("contact-email");
    const message = document.getElementById("form-message");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showMessage = (text, type) => {
      message.textContent = text;
      message.className = type ? `form-message ${type}` : "form-message";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
      }

      const subject = encodeURIComponent("Hello from your portfolio");
      const body = encodeURIComponent(
        `Hi Jayve,\n\nI visited your portfolio and would like to connect.\n\nYou can reach me at: ${email}\n`,
      );

      showMessage("Opening your email app...", "success");
      window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
    });

    // Clear the message once the visitor starts typing again
    emailInput.addEventListener("input", () => showMessage("", ""));
  }

  /* ----------------------------------------------------------
     7. SMALL EXTRAS
  ---------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('.btn[aria-disabled="true"]').forEach((btn) => {
    btn.title = "Coming soon";
  });
})();
