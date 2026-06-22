import { SELECTORS } from "../core/config.js";
import { qsa } from "../core/helpers.js";

export function initFaqAccordion() {
  qsa(SELECTORS.faqDetails).forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;

      qsa(SELECTORS.faqDetails).forEach((item) => {
        if (item !== detail) item.removeAttribute("open");
      });
    });
  });
}
