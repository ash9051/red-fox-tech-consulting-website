// javascript/calendar.js — Monthly calendar + popup near clicked date

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("calGrid");
  const label = document.getElementById("calLabel");
  const prevBtn = document.getElementById("calPrev");
  const nextBtn = document.getElementById("calNext");

  const pop = document.getElementById("calPopover");
  const popDate = document.getElementById("calPopDate");
  const popBody = document.getElementById("calPopBody");
  const popClose = document.getElementById("calPopClose");

  if (!grid || !label || !prevBtn || !nextBtn || !pop || !popDate || !popBody || !popClose) return;

  // --- EVENTS DATA ---
  // Use YYYY-MM-DD as keys
  const EVENTS = {
    "2026-04-10": [
      {
        title: "Interest Meeting",
        meta: "TBA · Marist University (Room TBA)",
        desc: "Intro session for prospective members."
      }
    ],
    "2026-04-01": [
      {
        title: "Launch Event",
        meta: "11:00 Am - 2:00 PM · Hancock (Room 2023)",
        desc: "Official launch"
      }
    ]
  };

  // --- state ---
  let view = new Date();
  view.setDate(1);
  let selectedBtn = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function keyFor(y, m1, d) {
    return `${y}-${pad(m1)}-${pad(d)}`;
  }

  function formatMonthYear(date) {
    return date.toLocaleString(undefined, { month: "long", year: "numeric" });
  }

  function formatLongDate(y, m0, d) {
    const tmp = new Date(y, m0, d);
    return tmp.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function clearSelection() {
    if (selectedBtn) selectedBtn.classList.remove("is-selected");
    selectedBtn = null;
  }

  function closePopover() {
    pop.hidden = true;
    pop.style.top = "";
    pop.style.left = "";
    clearSelection();
  }

  function positionPopover(anchorBtn) {
    // Must be visible to measure
    pop.hidden = false;

    const r = anchorBtn.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Try above first; if not enough space, place below
    let top = scrollY + r.top - pr.height - 10;
    const minTop = scrollY + 80; // don't hide under header
    if (top < minTop) top = scrollY + r.bottom + 10;

    // Center horizontally on the day cell
    let left = scrollX + r.left + (r.width / 2) - (pr.width / 2);

    // Clamp within viewport
    const minLeft = scrollX + 12;
    const maxLeft = scrollX + window.innerWidth - pr.width - 12;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
  }

  function openPopover(dateKey, anchorBtn) {
    const items = EVENTS[dateKey];
    if (!items || items.length === 0) {
      closePopover();
      return;
    }

    // selection highlight
    clearSelection();
    selectedBtn = anchorBtn;
    selectedBtn.classList.add("is-selected");

    // fill popup
    const parts = dateKey.split("-");
    const y = Number(parts[0]);
    const m0 = Number(parts[1]) - 1;
    const d = Number(parts[2]);

    popDate.textContent = formatLongDate(y, m0, d);

    popBody.innerHTML = items.map(ev => {
      return `
        <div class="cal-pop-item">
          <p class="cal-pop-title">${ev.title}</p>
          ${ev.meta ? `<p class="cal-pop-meta">${ev.meta}</p>` : ``}
          ${ev.desc ? `<p class="cal-pop-desc">${ev.desc}</p>` : ``}
        </div>
      `;
    }).join("");

    positionPopover(anchorBtn);
  }

  function render() {
    label.textContent = formatMonthYear(view);
    grid.innerHTML = "";

    const y = view.getFullYear();
    const m0 = view.getMonth();

    // Live current date
    const liveToday = new Date();
    const todayKey = keyFor(
      liveToday.getFullYear(),
      liveToday.getMonth() + 1,
      liveToday.getDate()
    );

    const firstDow = new Date(y, m0, 1).getDay();         // 0..6
    const daysInMonth = new Date(y, m0 + 1, 0).getDate(); // 28..31

    const totalCells = firstDow + daysInMonth;
    const endPad = (7 - (totalCells % 7)) % 7;
    const total = totalCells + endPad;

    for (let i = 0; i < total; i++) {
      // leading/trailing placeholders
      if (i < firstDow || i >= firstDow + daysInMonth) {
        const empty = document.createElement("div");
        empty.className = "cal-empty";
        grid.appendChild(empty);
        continue;
      }

      const day = (i - firstDow) + 1;
      const dateKey = keyFor(y, m0 + 1, day);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day";
      btn.setAttribute("data-date", dateKey);

      // Highlight live today's date
      if (dateKey === todayKey) {
        btn.classList.add("is-today");
      }

      const num = document.createElement("div");
      num.className = "cal-num";
      num.textContent = String(day);
      btn.appendChild(num);

      // Show event label
      const items = EVENTS[dateKey];
      if (items && items.length) {
        const pill = document.createElement("div");
        pill.className = "cal-evt";
        pill.textContent = items.length === 1 ? items[0].title : `${items.length} events`;
        btn.appendChild(pill);
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // prevents instant outside-click close
        openPopover(dateKey, btn);
      });

      grid.appendChild(btn);
    }
  }

  // Month navigation
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closePopover();
    view.setMonth(view.getMonth() - 1);
    render();
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closePopover();
    view.setMonth(view.getMonth() + 1);
    render();
  });

  // Close controls
  popClose.addEventListener("click", (e) => {
    e.preventDefault();
    closePopover();
  });

  document.addEventListener("click", (e) => {
    if (pop.hidden) return;
    const clickedInsidePopup = pop.contains(e.target);
    const clickedDay = e.target.closest && e.target.closest(".cal-day");
    if (!clickedInsidePopup && !clickedDay) closePopover();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopover();
  });

  window.addEventListener("resize", () => {
    // If open, keep it reasonable
    closePopover();
  });

  // init
  render();
});