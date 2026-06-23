import { SELECTORS } from "../core/config.js";
import { prefersReducedMotion, qs, qsa } from "../core/helpers.js";

export function initFlipCards() {
  qsa(SELECTORS.flipCard).forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      if (window.matchMedia("(hover: none)").matches) {
        card.classList.toggle("is-flipped");
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("a")) return;
      event.preventDefault();
      card.classList.toggle("is-flipped");
    });
  });
}

export function initImageParallax() {
  const frames = qsa(SELECTORS.parallaxFrame);
  if (!frames.length || prefersReducedMotion()) return;

  let ticking = false;

  function updateParallax() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    frames.forEach((frame) => {
      const image = qs("img", frame);
      if (!image) return;

      const rect = frame.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = Math.max(-12, Math.min(12, progress * -18));
      image.style.setProperty("--parallax-y", `${offset}px`);
    });

    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
}

export function initPressedCards() {
  qsa(SELECTORS.pressableCard).forEach((card) => {
    card.addEventListener("pointerdown", () => card.classList.add("is-pressed"));
    card.addEventListener("pointerup", () => card.classList.remove("is-pressed"));
    card.addEventListener("pointerleave", () => card.classList.remove("is-pressed"));
  });
}

export function initInteractiveBenefitCards() {
  initOverlayCards(".benefit-card--interactive");
}

export function initLegalAreaCards() {
  initOverlayCards(".legal-area-card--interactive");
}

export function initInteractiveServiceCards() {
  initOverlayCards(".service-card--interactive");
}

export function initExpandableLegalAreas() {
  const section = qs("#areas");
  if (!section || section.dataset.expandableAreasInitialized === "true") return;

  const grid = qs("[data-expandable-grid]", section);
  const button = qs("[data-legal-areas-toggle]", section);
  if (!grid || !button) return;

  const cards = qsa(".legal-area-card", grid);
  if (!cards.length) return;

  section.dataset.expandableAreasInitialized = "true";

  let isExpanded = false;
  let resizeFrame = 0;

  const getInitialVisibleCount = () => {
    if (window.innerWidth <= 980) return Math.min(4, cards.length);
    return Math.min(6, cards.length);
  };

  const applyState = () => {
    const visibleCount = getInitialVisibleCount();
    const hasHiddenCards = cards.length > visibleCount;

    cards.forEach((card, index) => {
      const isExtraCard = index >= visibleCount;
      const shouldHide = !isExpanded && isExtraCard;

      card.classList.toggle("is-hidden-by-toggle", shouldHide);
      card.classList.toggle("is-revealed-by-toggle", isExpanded && isExtraCard);

      if (shouldHide) card.classList.remove("is-open");
    });

    button.hidden = !hasHiddenCards;
    button.textContent = isExpanded ? "Ver menos" : "Ver más áreas";
    button.setAttribute("aria-expanded", String(isExpanded));
  };

  const requestStateUpdate = () => {
    if (resizeFrame) return;

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      applyState();
    });
  };

  button.addEventListener("click", () => {
    isExpanded = !isExpanded;
    applyState();

    if (!isExpanded && section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  });

  window.addEventListener("resize", requestStateUpdate, { passive: true });
  applyState();
}

export function initExpandableServices() {
  const section = qs("#servicios");
  if (!section || section.dataset.expandableServicesInitialized === "true") return;

  const grid = qs("[data-expandable-services-grid]", section);
  const button = qs("[data-services-toggle]", section);
  if (!grid || !button) return;

  const cards = qsa(".service-card", grid);
  if (!cards.length) return;

  section.dataset.expandableServicesInitialized = "true";

  let isExpanded = false;
  let resizeFrame = 0;

  const getInitialVisibleCount = () => {
    if (window.innerWidth <= 980) return Math.min(4, cards.length);
    return Math.min(6, cards.length);
  };

  const applyState = () => {
    const visibleCount = getInitialVisibleCount();
    const hasHiddenCards = cards.length > visibleCount;

    cards.forEach((card, index) => {
      const isExtraCard = index >= visibleCount;
      const shouldHide = !isExpanded && isExtraCard;

      card.classList.toggle("is-hidden-by-toggle", shouldHide);
      card.classList.toggle("is-revealed-by-toggle", isExpanded && isExtraCard);

      if (shouldHide) card.classList.remove("is-open");
    });

    button.hidden = !hasHiddenCards;
    button.textContent = isExpanded ? "Ver menos" : "Ver más servicios";
    button.setAttribute("aria-expanded", String(isExpanded));
  };

  const requestStateUpdate = () => {
    if (resizeFrame) return;

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      applyState();
    });
  };

  button.addEventListener("click", () => {
    isExpanded = !isExpanded;
    applyState();

    if (!isExpanded && section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  });

  window.addEventListener("resize", requestStateUpdate, { passive: true });
  applyState();
}

function initOverlayCards(selector) {
  const cards = qsa(selector);
  if (!cards.length) return;
  const touchQuery = window.matchMedia("(hover: none)");
  const coarseQuery = window.matchMedia("(pointer: coarse)");
  let lastTouchToggle = 0;

  const closeCards = (activeCard = null) => {
    cards.forEach((card) => {
      if (card !== activeCard) card.classList.remove("is-open");
    });
  };

  const toggleCard = (card) => {
    const isOpen = card.classList.contains("is-open");
    closeCards(card);
    card.classList.toggle("is-open", !isOpen);
  };

  cards.forEach((card) => {
    card.addEventListener("pointerup", (event) => {
      if (event.target.closest("a")) return;
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

      lastTouchToggle = Date.now();
      toggleCard(card);
    });

    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      if (Date.now() - lastTouchToggle < 450) return;
      if (!touchQuery.matches && !coarseQuery.matches && navigator.maxTouchPoints < 1) return;

      toggleCard(card);
    });
  });
}

export function initCards() {
  initFlipCards();
  initImageParallax();
  initPressedCards();
  initInteractiveBenefitCards();
  initLegalAreaCards();
  initInteractiveServiceCards();
  initExpandableLegalAreas();
  initExpandableServices();
}
