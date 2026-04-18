// main.js

// Stop browser from restoring old scroll position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     NAV DROPDOWNS (<details>) + MOBILE HAMBURGER
  ========================== */
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");

  if (nav) {
    const dropdowns = Array.from(nav.querySelectorAll("details"));

    const closeDropdowns = () => dropdowns.forEach((d) => d.removeAttribute("open"));

    // Only one dropdown open at a time
    dropdowns.forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        dropdowns.forEach((other) => {
          if (other !== d) other.removeAttribute("open");
        });
      });
    });

    // Close dropdowns after selecting an item
    nav.querySelectorAll("details a").forEach((a) => {
      a.addEventListener("click", () => closeDropdowns());
    });

    // Optional: header "scrolled" class
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Mobile hamburger toggle
    const toggleBtn = nav.querySelector(".nav-toggle");
    const menuWrap = nav.querySelector(".nav-menu");

    const closeMobileMenu = () => {
      nav.classList.remove("nav-open");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    };

    if (toggleBtn && menuWrap) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nav.classList.toggle("nav-open");
        const isOpen = nav.classList.contains("nav-open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        if (isOpen) closeDropdowns();
      });

      // Close mobile menu if you click a link inside it
      menuWrap.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          closeMobileMenu();
          closeDropdowns();
        });
      });

      // Close on ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeMobileMenu();
          closeDropdowns();
        }
      });
    }

    // One global click handler:
    // - close dropdowns if click outside dropdown
    // - close mobile menu if click outside nav
    document.addEventListener("click", (e) => {
      // close dropdowns if clicked outside any details
      const clickedInsideDropdown = dropdowns.some((d) => d.contains(e.target));
      if (!clickedInsideDropdown) closeDropdowns();

      // close mobile menu if clicked outside nav
      if (!nav.contains(e.target)) {
        const toggleBtn = nav.querySelector(".nav-toggle");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
        nav.classList.remove("nav-open");
      }
    });
  }

  /* =========================
     HOME UPDATES CAROUSEL
     Arrows + dots + snap scroll
  ========================== */
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-track]");
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  if (!track || slides.length === 0) return;

  const section = carousel.closest(".home-updates") || document;
  const dotsWrap = section.querySelector("[data-dots]");
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".up-dot")) : [];

  let current = 0;

  function setActiveDot(i) {
    if (!dots.length) return;
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
  }

  function goTo(i, smooth = true) {
  current = (i + slides.length) % slides.length;

  // scroll the TRACK horizontally (does not move page vertically)
  const left = slides[current].offsetLeft;
  track.scrollTo({
    left,
    behavior: smooth ? "smooth" : "auto",
  });

  setActiveDot(current);
}

  // Arrow clicks (your HTML already has these buttons)
  const prevBtn = carousel.querySelector(".up-prev");
  const nextBtn = carousel.querySelector(".up-next");
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  // Dot clicks
  dots.forEach((dot, idx) => dot.addEventListener("click", () => goTo(idx)));

  // Update dots when user scrolls manually
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const idx = slides.indexOf(visible.target);
      if (idx >= 0 && idx !== current) {
        current = idx;
        setActiveDot(current);
      }
    },
    { root: track, threshold: 0.6 }
  );

  slides.forEach((s) => io.observe(s));

  window.addEventListener("resize", () => goTo(current, false));

// Initialize without scrolling the PAGE down
current = 0;
setActiveDot(0);
track.scrollTo({ left: 0, behavior: "auto" });
});