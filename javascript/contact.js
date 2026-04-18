// contact.js — opens user's email app with a prefilled message (no backend)

(function () {
  const TO_EMAIL = "redfoxtechconsulting@marist.edu";

  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("contactStatus");

  // Copy email button
  document.querySelectorAll(".contact-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1200);
      } catch (e) {
        // fallback
        const tmp = document.createElement("input");
        tmp.value = text;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1200);
      }
    });
  });

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const subject   = document.getElementById("subject").value.trim();
    const message   = document.getElementById("message").value.trim();

    const fullName = `${firstName} ${lastName}`.trim();

    const bodyLines = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      ``,
      `Message:`,
      message,
      ``,
      `---`,
      `Sent via Red Fox Tech Consulting website contact form`
    ];

    const mailto = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    if (statusEl) statusEl.textContent = "Opening your email app…";

    window.location.href = mailto;

    setTimeout(() => {
      if (statusEl) statusEl.textContent = "";
    }, 2000);
  });
})();
