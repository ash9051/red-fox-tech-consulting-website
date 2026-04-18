// services.js - highlight active service pill on scroll

document.addEventListener("DOMContentLoaded", () => {
  const pills = Array.from(document.querySelectorAll(".svc-pill"));
  if (!pills.length) return;

  const sections = pills
    .map(p => document.querySelector(p.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    pills.forEach(p => {
      const href = p.getAttribute("href");
      p.classList.toggle("is-active", href === `#${id}`);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && visible.target && visible.target.id) setActive(visible.target.id);
    },
    { threshold: [0.35, 0.55, 0.7] }
  );

  sections.forEach(sec => io.observe(sec));
});