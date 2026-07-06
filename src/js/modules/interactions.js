import { initCards } from "./cards.js";
import { initFaqAccordion } from "./faq.js";
import { initContactForm } from "./form.js";
import { initHeroVideo } from "./video.js";
import { prefersReducedMotion, qsa } from "../core/helpers.js";

export function initCardContactActions() {
  const triggers = qsa("[data-contact-topic]");
  const contactSection = document.querySelector("#contacto");

  if (!triggers.length || !contactSection || contactSection.dataset.cardContactActionsInitialized === "true") return;

  contactSection.dataset.cardContactActionsInitialized = "true";

  const normalizeText = (value = "") =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const findField = (selectors) => {
    for (const selector of selectors) {
      const field = document.querySelector(selector);
      if (field) return field;
    }

    return null;
  };

  const areaField = findField([
    "select[name='area']",
    "select[name='servicio']",
    "input[name='area']",
    "input[name='servicio']"
  ]);

  const messageField = findField([
    "textarea[name='mensaje']",
    "textarea[name='message']",
    "textarea"
  ]);

  const setAreaTopic = (topic) => {
    if (!topic || !areaField) return false;

    if (areaField.tagName === "SELECT") {
      const normalizedTopic = normalizeText(topic);
      const option = Array.from(areaField.options).find((item) => {
        const normalizedOption = normalizeText(item.textContent);
        return normalizedOption && (normalizedOption.includes(normalizedTopic) || normalizedTopic.includes(normalizedOption));
      });

      if (!option) return false;

      areaField.value = option.value;
    } else {
      areaField.value = topic;
    }

    areaField.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  const setMessageTopic = (topic) => {
    if (!topic || !messageField || messageField.value.trim()) return false;

    messageField.value = `Hola, quiero consultar sobre: ${topic}.`;
    messageField.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      const topic = trigger.dataset.contactTopic?.trim();
      const areaWasSet = setAreaTopic(topic);
      const messageWasSet = setMessageTopic(topic);

      contactSection.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });

      window.setTimeout(() => {
        const focusTarget = areaWasSet ? areaField : messageWasSet ? messageField : areaField || messageField || contactSection;
        focusTarget?.focus?.({ preventScroll: true });
      }, prefersReducedMotion() ? 0 : 520);
    });
  });
}

export function initInteractions() {
  qsa(".btn, .mini-btn, .nav-cta, .whatsapp-float, .to-top").forEach((element) => {
    element.addEventListener("pointerdown", () => element.classList.add("is-interacting"));
    element.addEventListener("pointerup", () => element.classList.remove("is-interacting"));
    element.addEventListener("pointerleave", () => element.classList.remove("is-interacting"));
  });

  initCards();
  initCardContactActions();
  initFaqAccordion();
  initHeroVideo();
  initContactForm();
}
