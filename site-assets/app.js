(() => {
  const body = document.body;
  const loader = document.querySelector("[data-site-loader]");
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-scroll-progress]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const serviceDropdown = document.querySelector("[data-services-dropdown]");
  const serviceToggle = document.querySelector("[data-services-toggle]");
  const yearTargets = document.querySelectorAll("[data-year]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const desktopPointer = window.matchMedia("(min-width: 861px)").matches;
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  body.classList.add("is-loading");

  if (finePointer && desktopPointer && !reduceMotion && cursorDot && cursorRing) {
    body.classList.add("cursor-ready");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const moveCursor = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      window.requestAnimationFrame(renderCursor);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.querySelectorAll("a, button, input, select, textarea, .service-card, .work-card, .card, .result-card, .process-card, .link-card, .faq-item, .image-placeholder, .image-frame, .client-card, .proof-quote").forEach((item) => {
      item.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
      item.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
    });
    renderCursor();
  }

  function finishLoader() {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
    if (loader) {
      window.setTimeout(() => {
        loader.setAttribute("aria-hidden", "true");
      }, reduceMotion ? 20 : 560);
    }
  }

  if (loader) {
    const delay = reduceMotion ? 80 : 900;
    if (document.readyState === "complete") {
      window.setTimeout(finishLoader, delay);
    } else {
      window.addEventListener("load", () => window.setTimeout(finishLoader, delay), { once: true });
      window.setTimeout(finishLoader, 2200);
    }
  } else {
    body.classList.add("is-loaded");
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${amount})`;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  function closeServicesDropdown() {
    if (!serviceDropdown || !serviceToggle) return;
    serviceDropdown.classList.remove("is-open");
    serviceToggle.setAttribute("aria-expanded", "false");
  }

  function openServicesDropdown() {
    if (!serviceDropdown || !serviceToggle) return;
    serviceDropdown.classList.add("is-open");
    serviceToggle.setAttribute("aria-expanded", "true");
  }

  if (serviceToggle && serviceDropdown) {
    serviceToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      serviceDropdown.classList.contains("is-open") ? closeServicesDropdown() : openServicesDropdown();
    });

    document.addEventListener("click", (event) => {
      if (!serviceDropdown.contains(event.target)) {
        closeServicesDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeServicesDropdown();
        serviceToggle.focus();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.setAttribute("aria-label", "Open menu");
      closeServicesDropdown();
    });
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const required = Array.from(form.querySelectorAll("[required]"));
      const missing = required.find((field) => !String(field.value || "").trim());
      const email = form.querySelector('input[type="email"]');
      const emailOk = !email || !email.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

      if (missing || !emailOk) {
        if (status) status.textContent = emailOk ? "Please complete the required fields." : "Please enter a valid email address.";
        (missing || email).focus();
        return;
      }

      const data = new FormData(form);
      const lines = [
        `Name: ${data.get("name") || ""}`,
        `Phone: ${data.get("phone") || "Not shared"}`,
        `Email: ${data.get("email") || "Not shared"}`,
        `Company: ${data.get("company") || "Not shared"}`,
        `Service: ${data.get("service") || "Not selected"}`,
        "",
        "Message:",
        data.get("message") || ""
      ];
      if (status) status.textContent = "Opening your email app with the inquiry ready to send.";
      window.location.href = `mailto:design@coloursandpatterns.in?subject=${encodeURIComponent("New project inquiry for Colours & Patterns")}&body=${encodeURIComponent(lines.join("\n"))}`;
      form.reset();
    });
  });

  yearTargets.forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  document.querySelectorAll(".marquee-track").forEach((track) => {
    Array.from(track.children).forEach((logo) => {
      const clone = logo.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });
})();
