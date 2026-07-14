(function () {
  "use strict";

  /* ============ DATA ============ */
  const CARS = [
    { id: 1, name: "Nova Compact", category: "economy", seats: 4, trans: "Manual", spec: "38 MPG", price: 39, badge: "available", left: null,
      note: "Light on gas, easy to park downtown.", color: "#c9c4b7" },
    { id: 2, name: "Meridian Sedan", category: "sedan", seats: 5, trans: "Automatic", spec: "34 MPG", price: 52, badge: "available", left: null,
      note: "The one that disappoints nobody.", color: "#8fa3b8" },
    { id: 3, name: "Trailhead 4x4", category: "suv", seats: 7, trans: "Automatic", spec: "AWD", price: 74, badge: "limited", left: 2,
      note: "Takes the gravel road just as happily.", color: "#6f8f63" },
    { id: 4, name: "Volt Line EV", category: "electric", seats: 5, trans: "Automatic", spec: "260mi range", price: 68, badge: "available", left: null,
      note: "Quiet enough to hear the tires.", color: "#5fb0a6" },
    { id: 5, name: "Coastline Convertible", category: "luxury", seats: 2, trans: "Automatic", spec: "V6", price: 129, badge: "limited", left: 1,
      note: "Top down, receipts expensed later.", color: "#e0a94f" },
    { id: 6, name: "Longhaul Van", category: "van", seats: 8, trans: "Automatic", spec: "120 cf cargo", price: 89, badge: "available", left: null,
      note: "Fits the band and the gear.", color: "#b57a5a" }
  ];

  const REVIEWS = [
    { channel: "CH 04 — DOWNTOWN DEPOT", quote: "Picked up the Trailhead at 7am, no line, no lecture about the gas tank. Back on the road in nine minutes.", who: "— M. Ferro, contractor" },
    { channel: "CH 11 — HARBOR STATION", quote: "Rented the Volt Line for a coastal loop. Charged once, never thought about it again.", who: "— D. Okafor, teacher" },
    { channel: "CH 02 — AIRPORT LOT B", quote: "Flight got in late and the counter was still open. Meridian Sedan was clean and ready.", who: "— S. Park, sales rep" },
    { channel: "CH 07 — NORTH RIDGE YARD", quote: "Took the convertible up the ridge for a weekend. Worth every mile of the detour.", who: "— A. Whitfield, photographer" }
  ];

  const FAQS = [
    { q: "What do I need to pick up a car?", a: "A valid driver's license, a card in your name for the deposit hold, and the confirmation code from your booking. That's the whole counter process." },
    { q: "Is there a mileage limit?", a: "No. Every rental, in every class, comes with unlimited miles. Drive across town or across the state." },
    { q: "Can I return the car to a different lot?", a: "Yes — pick any of our four lots as your drop-off when you book. A small relocation fee may apply for cross-region drop-offs." },
    { q: "What happens if I return the car late?", a: "You get a two-hour grace window. After that, we bill the extra time at your daily rate, prorated by the hour." },
    { q: "Do you offer insurance?", a: "Basic coverage is included in every rate. Extended coverage can be added at pick-up, no need to decide now." }
  ];

  const FEE = 15; // flat service fee
  const TAX_RATE = 0.08;

  let currentFilter = "all";
  let rentalDays = 1;
  let dispatchIndex = 0;
  let selectedCar = null;

  /* ============ UTIL ============ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function money(n) {
    return "$" + n.toFixed(2);
  }

  function carSVG(color) {
    return `<svg viewBox="0 0 120 60" width="120" height="60">
      <path d="M10 42 L20 20 Q24 14 34 14 L82 14 Q92 14 96 20 L108 42 L108 48 L10 48 Z" fill="${color}"/>
      <path d="M28 20 L34 15 L82 15 L88 20 Z" fill="#14181f" opacity="0.35"/>
      <circle cx="32" cy="48" r="8" fill="#14181f" stroke="#f1ede4" stroke-width="2.4"/>
      <circle cx="88" cy="48" r="8" fill="#14181f" stroke="#f1ede4" stroke-width="2.4"/>
    </svg>`;
  }

  /* ============ FLEET RENDER ============ */
  function renderFleet() {
    const grid = $("#fleetGrid");
    const cars = CARS.filter(c => currentFilter === "all" || c.category === currentFilter);
    grid.innerHTML = cars.map(c => {
      const total = (c.price * rentalDays) + FEE;
      const withTax = total * (1 + TAX_RATE);
      const badgeClass = c.badge === "available" ? "badge--available" : "badge--limited";
      const badgeText = c.badge === "available" ? "Available" : `${c.left} left`;
      return `
        <article class="car-card" data-id="${c.id}">
          <div class="car-card__top">
            <span></span>
            <span class="car-card__badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="car-card__art">${carSVG(c.color)}</div>
          <h3 class="car-card__name">${c.name}</h3>
          <p class="car-card__category">${c.category}</p>
          <div class="car-card__specs">
            <div>Seats <span>${c.seats}</span></div>
            <div>Trans <span>${c.trans}</span></div>
            <div>Spec <span>${c.spec}</span></div>
            <div>Class <span>${c.category}</span></div>
          </div>
          <div class="car-card__price">
            <span class="amount">${money(c.price)}</span>
            <span class="unit">/ day</span>
          </div>
          <div class="car-card__total">${rentalDays} night${rentalDays === 1 ? "" : "s"} + fees ≈ <strong>${money(withTax)}</strong></div>
          <button class="btn btn--outline btn--full" data-reserve="${c.id}">Reserve</button>
        </article>`;
    }).join("");
  }

  function setupFilters() {
    $all(".pill").forEach(pill => {
      pill.addEventListener("click", () => {
        $all(".pill").forEach(p => p.classList.remove("is-active"));
        pill.classList.add("is-active");
        currentFilter = pill.dataset.filter;
        renderFleet();
      });
    });
  }

  /* ============ BOOKING FORM ============ */
  function computeDays() {
    const pu = $("#pickupDate").value;
    const rt = $("#returnDate").value;
    if (!pu || !rt) return 1;
    const d1 = new Date(pu);
    const d2 = new Date(rt);
    const diff = Math.round((d2 - d1) / 86400000);
    return diff > 0 ? diff : 1;
  }

  function setupBookingForm() {
    const form = $("#bookingForm");
    const hint = $("#bookingHint");

    function updateHint() {
      const pu = $("#pickupDate").value;
      const rt = $("#returnDate").value;
      if (pu && rt) {
        rentalDays = computeDays();
        hint.textContent = `${rentalDays} night${rentalDays === 1 ? "" : "s"} selected — totals below are live.`;
      } else {
        hint.textContent = "Pick your dates to see live nightly totals below.";
      }
      renderFleet();
    }

    $("#pickupDate").addEventListener("change", updateHint);
    $("#returnDate").addEventListener("change", updateHint);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      rentalDays = computeDays();
      currentFilter = $("#carClass").value;
      $all(".pill").forEach(p => p.classList.toggle("is-active", p.dataset.filter === currentFilter));
      renderFleet();
      $("#fleet").scrollIntoView({ behavior: "smooth" });
    });

    // sensible default dates: today and +3 days
    const today = new Date();
    const later = new Date(today.getTime() + 3 * 86400000);
    $("#pickupDate").value = today.toISOString().slice(0, 10);
    $("#returnDate").value = later.toISOString().slice(0, 10);
    rentalDays = computeDays();
  }

  /* ============ RESERVE / MODAL ============ */
  function openModal(carId) {
    selectedCar = CARS.find(c => c.id === carId);
    if (!selectedCar) return;
    renderBookingStep();
    $("#modalBackdrop").classList.add("is-open");
  }

  function closeModal() {
    $("#modalBackdrop").classList.remove("is-open");
  }

  function renderBookingStep() {
    const c = selectedCar;
    const subtotal = c.price * rentalDays;
    const withFee = subtotal + FEE;
    const tax = withFee * TAX_RATE;
    const total = withFee + tax;

    $("#modalBody").innerHTML = `
      <h3>${c.name}</h3>
      <p class="modal__sub">${rentalDays} night${rentalDays === 1 ? "" : "s"} · ${c.category} · ${$("#pickupLoc").value}</p>
      <div class="receipt-line"><span>Nightly rate</span><strong>${money(c.price)} × ${rentalDays}</strong></div>
      <div class="receipt-line"><span>Service fee</span><strong>${money(FEE)}</strong></div>
      <div class="receipt-line"><span>Tax (8%)</span><strong>${money(tax)}</strong></div>
      <div class="receipt-line receipt-line--total"><span>Total due at pick-up</span><strong>${money(total)}</strong></div>

      <form id="reserveForm">
        <div class="field">
          <label for="renterName">Full name</label>
          <input type="text" id="renterName" required placeholder="Jordan Alvarez">
        </div>
        <div class="field">
          <label for="renterEmail">Email</label>
          <input type="email" id="renterEmail" required placeholder="you@example.com">
        </div>
        <button type="submit" class="btn btn--amber btn--full">Confirm reservation</button>
      </form>
    `;

    $("#reserveForm").addEventListener("submit", (e) => {
      e.preventDefault();
      renderConfirmation();
    });
  }

  function renderConfirmation() {
    const code = "OVR-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    $("#modalBody").innerHTML = `
      <h3>You're booked.</h3>
      <p class="modal__sub">${selectedCar.name} · ${rentalDays} night${rentalDays === 1 ? "" : "s"}</p>
      <div class="confirm-code">${code}</div>
      <p>Bring this code and your license to ${$("#pickupLoc").value}. We'll have the car pulled around.</p>
      <button class="btn btn--outline btn--full" id="modalDoneBtn">Done</button>
    `;
    $("#modalDoneBtn").addEventListener("click", closeModal);
  }

  function setupReserveClicks() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-reserve]");
      if (btn) openModal(Number(btn.dataset.reserve));
    });
    $("#modalClose").addEventListener("click", closeModal);
    $("#modalBackdrop").addEventListener("click", (e) => {
      if (e.target.id === "modalBackdrop") closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ============ DISPATCH CAROUSEL ============ */
  function renderDispatch() {
    $("#dispatchTrack").innerHTML = REVIEWS.map(r => `
      <div class="dispatch-card">
        <span class="dispatch-card__channel">${r.channel}</span>
        <p class="dispatch-card__quote">“${r.quote}”</p>
        <p class="dispatch-card__who">${r.who}</p>
      </div>
    `).join("");
    $("#dispatchDots").innerHTML = REVIEWS.map((_, i) =>
      `<button class="dispatch__dot${i === 0 ? " is-active" : ""}" data-dot="${i}" aria-label="Go to review ${i + 1}"></button>`
    ).join("");
  }

  function goToDispatch(i) {
    dispatchIndex = (i + REVIEWS.length) % REVIEWS.length;
    $("#dispatchTrack").style.transform = `translateX(-${dispatchIndex * 100}%)`;
    $all(".dispatch__dot").forEach((d, idx) => d.classList.toggle("is-active", idx === dispatchIndex));
  }

  function setupDispatch() {
    renderDispatch();
    $("#dispatchPrev").addEventListener("click", () => goToDispatch(dispatchIndex - 1));
    $("#dispatchNext").addEventListener("click", () => goToDispatch(dispatchIndex + 1));
    $("#dispatchDots").addEventListener("click", (e) => {
      const dot = e.target.closest("[data-dot]");
      if (dot) goToDispatch(Number(dot.dataset.dot));
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      let timer = setInterval(() => goToDispatch(dispatchIndex + 1), 6000);
      const pause = () => clearInterval(timer);
      const resume = () => { timer = setInterval(() => goToDispatch(dispatchIndex + 1), 6000); };
      $("#dispatch").addEventListener("mouseenter", pause);
      $("#dispatch").addEventListener("mouseleave", resume);
    }
  }

  /* ============ FAQ ACCORDION ============ */
  function setupAccordion() {
    $("#accordion").innerHTML = FAQS.map((f, i) => `
      <div class="accordion__item" data-index="${i}">
        <button class="accordion__q" aria-expanded="false">
          ${f.q}
          <span class="accordion__chevron">+</span>
        </button>
        <div class="accordion__a"><p>${f.a}</p></div>
      </div>
    `).join("");

    $all(".accordion__q").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion__item");
        const answer = $(".accordion__a", item);
        const isOpen = item.classList.contains("is-open");

        $all(".accordion__item").forEach(other => {
          other.classList.remove("is-open");
          $(".accordion__q", other).setAttribute("aria-expanded", "false");
          $(".accordion__a", other).style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  /* ============ HEADER / NAV ============ */
  function setupHeader() {
    const header = $("#siteHeader");
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    });

    const toggle = $("#navToggle");
    const nav = $("#mainNav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $all("[data-nav]").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupScrollspy() {
    const sections = ["fleet", "how", "reviews", "faq"].map(id => document.getElementById(id));
    const links = $all("[data-nav]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach(s => s && observer.observe(s));
  }

  /* ============ ROAD SPINE PROGRESS ============ */
  function setupRoadSpine() {
    const spine = $("#roadSpine");
    const car = $("#spineCar");
    if (!spine || !car) return;

    function update() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const spineHeight = window.innerHeight;
      car.style.top = (clamped * spineHeight) + "px";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ============ INIT ============ */
  function init() {
    $("#year").textContent = new Date().getFullYear();
    setupBookingForm();
    setupFilters();
    renderFleet();
    setupReserveClicks();
    setupDispatch();
    setupAccordion();
    setupHeader();
    setupScrollspy();
    setupRoadSpine();
  }

  document.addEventListener("DOMContentLoaded", init);
})();