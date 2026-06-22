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

export function initCards() {
  initFlipCards();
  initImageParallax();
  initPressedCards();
}
