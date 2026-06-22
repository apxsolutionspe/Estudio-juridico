import { initCards } from "./cards.js";
import { initFaqAccordion } from "./faq.js";
import { initContactForm } from "./form.js";
import { initHeroVideo } from "./video.js";
import { qsa } from "../core/helpers.js";

export function initInteractions() {
  qsa(".btn, .mini-btn, .nav-cta, .whatsapp-float, .to-top").forEach((element) => {
    element.addEventListener("pointerdown", () => element.classList.add("is-interacting"));
    element.addEventListener("pointerup", () => element.classList.remove("is-interacting"));
    element.addEventListener("pointerleave", () => element.classList.remove("is-interacting"));
  });

  initCards();
  initFaqAccordion();
  initHeroVideo();
  initContactForm();
}
