// about.js — Leadership modal (with LinkedIn per member)

const modal = document.getElementById("boardModal");

if (modal) {
  const modalImg  = document.getElementById("modalImg");
  const modalName = document.getElementById("modalName");
  const modalRole = document.getElementById("modalRole");
  const modalBio  = document.getElementById("modalBio");
  const modalLinkedIn = document.getElementById("modalLinkedIn");

  function openModal(card) {
    modalName.textContent = card.dataset.name || "";
    modalRole.textContent = card.dataset.role || "";
    modalBio.textContent  = card.dataset.bio  || "";

    modalImg.src = card.dataset.image || "";
    modalImg.alt = card.dataset.name || "Board member";

    // LinkedIn per card
    const li = card.dataset.linkedin || "";
    if (modalLinkedIn) {
      if (li && li !== "#") {
        modalLinkedIn.href = li;
        modalLinkedIn.style.display = "inline-flex";
      } else {
        modalLinkedIn.href = "#";
        modalLinkedIn.style.display = "none";
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    modalImg.src = "";
    modalImg.alt = "";

    if (modalLinkedIn) {
      modalLinkedIn.href = "#";
      modalLinkedIn.style.display = "none";
    }
  }

  document.querySelectorAll(".board-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  // Close on backdrop or close button (anything with data-close="true")
  modal.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") closeModal();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
