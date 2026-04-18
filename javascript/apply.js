// apply.js — multi-step application form that opens a prefilled email (mailto)

const form = document.getElementById("applyForm");

if (form) {
  const steps = Array.from(document.querySelectorAll(".apply-step"));
  const indicators = Array.from(document.querySelectorAll("[data-step-indicator]"));

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("applyStatus");

  let current = 0;

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg || "";
  }

  function showStep(i) {
    current = i;

    steps.forEach((s, idx) => s.classList.toggle("is-active", idx === current));
    indicators.forEach((ind, idx) => ind.classList.toggle("is-active", idx === current));

    prevBtn.style.visibility = current === 0 ? "hidden" : "visible";

    const last = current === steps.length - 1;
    nextBtn.style.display = last ? "none" : "inline-flex";
    submitBtn.style.display = last ? "inline-flex" : "none";

    setStatus(`Step ${current + 1} of ${steps.length}`);
  }

  function validateStep(stepEl) {
    // Validate only fields inside the current step
    const fields = stepEl.querySelectorAll("input, select, textarea");
    for (const field of fields) {
      // Skip disabled
      if (field.disabled) continue;

      // For radio groups, reportValidity on one of them is enough
      if (field.type === "radio") {
        const group = stepEl.querySelectorAll(`input[type="radio"][name="${field.name}"]`);
        const anyChecked = Array.from(group).some(r => r.checked);
        if (!anyChecked) {
          group[0].reportValidity();
          return false;
        }
        continue;
      }

      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
  }

  function getRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  }

  function openMailto(payload) {
    const to = "redfoxtechconsulting@marist.edu";
    const subject = payload.subject;
    const body = payload.body;

    const mailto =
      `mailto:${encodeURIComponent(to)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  // Button handlers
  prevBtn.addEventListener("click", () => {
    if (current > 0) showStep(current - 1);
  });

  nextBtn.addEventListener("click", () => {
    const ok = validateStep(steps[current]);
    if (!ok) return;
    if (current < steps.length - 1) showStep(current + 1);
  });

  // Submit -> open email
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validateStep(steps[current]);
    if (!ok) return;

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const major     = document.getElementById("major").value.trim();
    const gradYear  = document.getElementById("gradYear").value.trim();

    const studentType = getRadioValue("studentType");

    const interests = getCheckedValues("interest");
    const roleType = (document.getElementById("roleType").value || "").trim();

    const projectProud = document.getElementById("projectProud").value.trim();

    const skills = getCheckedValues("skills");
    const skillsOther = (document.getElementById("skillsOther").value || "").trim();

    const portfolio = (document.getElementById("portfolio").value || "").trim();

    const whyJoin = document.getElementById("whyJoin").value.trim();
    const consent = document.getElementById("consent").checked;

    if (!consent) {
      document.getElementById("consent").reportValidity();
      return;
    }

    const subject = `Application – ${firstName} ${lastName} (${major}, ${gradYear})`;

    const bodyLines = [
      "Red Fox Tech Consulting — Application",
      "------------------------------------",
      "",
      "BASIC INFO",
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Student type: ${studentType}`,
      `Major / Program: ${major}`,
      `Graduation year: ${gradYear}`,
      "",
      "INTERESTS & ROLE",
      `Interest areas: ${interests.length ? interests.join(", ") : "N/A"}`,
      `Preferred role type: ${roleType || "N/A"}`,
      "",
      "PROJECT",
      projectProud ? projectProud : "N/A",
      "",
      "SKILLS / TOOLS",
      `Skills: ${skills.length ? skills.join(", ") : "N/A"}`,
      `Other: ${skillsOther || "N/A"}`,
      "",
      "PORTFOLIO",
      portfolio || "N/A",
      "",
      "WHY JOIN",
      whyJoin || "N/A",
      "",
      "RESUME",
      "Please attach your resume (PDF) to this email before sending.",
      "",
      "— End —"
    ];

    openMailto({ subject, body: bodyLines.join("\n") });
  });

  // init
  showStep(0);
}
