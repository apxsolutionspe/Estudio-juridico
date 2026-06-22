const DEBUG_ANIMATIONS = false;
const FORCE_MOTION_FOR_PREVIEW = true;

const REVEAL_SELECTOR = [
  "[data-animate]",
  ".reveal-up",
  ".reveal-left",
  ".reveal-right",
  ".reveal-scale",
  ".slide-item",
  ".motion-item",
  ".motion-card",
  ".motion-image",
  ".stagger-item",
  ".section-head",
  ".section-copy",
  ".feature-card",
  ".service-card",
  ".wide-card",
  ".step",
  ".quote-card",
  ".flip-card",
  ".image-panel",
  ".image-frame",
  ".faq-list details",
  ".contact-card",
  ".contact-info",
  ".footer-grid",
  ".footer-bottom",
  ".hero-title",
  ".hero-title span",
  ".hero-video",
  ".btn",
  ".mini-btn",
  ".nav-cta"
].join(",");

const CARD_SELECTOR = [
  ".feature-card",
  ".service-card",
  ".wide-card",
  ".step",
  ".quote-card",
  ".flip-card",
  ".contact-card",
  ".contact-info",
  ".faq-list details"
].join(",");

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function isRenderable(element, index, array) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    array.indexOf(element) === index &&
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== "none" &&
    style.visibility !== "hidden"
  );
}

function inferAnimationType(element) {
  if (element.matches("img, video, .hero-video, .motion-image, .image-panel, .image-frame, .flip-card")) {
    return "scale-in";
  }

  if (element.matches(".reveal-left")) return "slide-left";
  if (element.matches(".reveal-right")) return "slide-right";
  if (element.matches(".hero-title, .hero-title span, .section-head, h1, h2, h3, " + CARD_SELECTOR)) {
    return "fade-up";
  }

  return "fade-in";
}

function getDelay(element, index) {
  if (element.matches(".hero-title span")) return Math.min(index * 90, 360);
  if (element.matches(CARD_SELECTOR)) return Math.min(index * 55, 520);
  if (element.matches(".btn, .mini-btn, .nav-cta")) return Math.min(index * 35, 280);

  return Math.min(index * 28, 340);
}

function revealElement(element) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.classList.add("is-visible");
      element.classList.add("is-animated");
    });
  });
}

function logState(elements, reducedMotion) {
  if (!DEBUG_ANIMATIONS) return;

  console.log("Animables:", elements.length);
  console.log("Animados:", document.querySelectorAll(".js-reveal-target.is-visible").length);
  console.log("Data animate:", document.querySelectorAll("[data-animate]").length);
  console.log("Reduced motion:", reducedMotion);
  console.log("Force motion:", document.documentElement.classList.contains("force-motion"));
}

function setupRevealElements() {
  return qsa(REVEAL_SELECTOR)
    .filter(isRenderable)
    .map((element, index) => {
      element.classList.add("js-reveal-target");

      if (!element.hasAttribute("data-animate")) {
        element.setAttribute("data-animate", inferAnimationType(element));
      }

      element.style.setProperty("--animation-delay", `${getDelay(element, index)}ms`);
      return element;
    });
}

function observeElements(elements) {
  if (!("IntersectionObserver" in window)) {
    elements.forEach(revealElement);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 80px 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));

  window.setTimeout(() => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        revealElement(element);
      }
    });
  }, 180);
}

function startAnimations() {
  if (FORCE_MOTION_FOR_PREVIEW) {
    document.documentElement.classList.add("force-motion");
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldReduceMotion = reducedMotion && !document.documentElement.classList.contains("force-motion");

  const elements = setupRevealElements();

  if (DEBUG_ANIMATIONS) {
    document.documentElement.classList.add("debug-animations");
  } else {
    document.documentElement.classList.remove("debug-animations");
  }

  logState(elements, reducedMotion);

  if (shouldReduceMotion) {
    elements.forEach((element) => element.classList.add("is-visible", "is-animated"));
    logState(elements, reducedMotion);
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      observeElements(elements);
      logState(elements, reducedMotion);
    });
  });
}

export function initAnimations() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAnimations, { once: true });
    return;
  }

  startAnimations();
}
