import { MOTION, SELECTORS } from "../core/config.js";
import { getHashTarget, qs, qsa } from "../core/helpers.js";
import { scrollToElement, scrollToTop } from "./scroll.js";

function closeMenu(body, navMenu, navToggle) {
  body.classList.remove("nav-open");
  navMenu?.classList.remove("is-open");
  navToggle?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function updateHeaderState(header, toTopButton) {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  toTopButton?.classList.toggle("visible", window.scrollY > 520);
}

function revealElement(element) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.classList.add("is-visible", "is-animated");
    });
  });
}

function revealSectionAnimations(section) {
  const targets = qsa(
    ".js-reveal-target, [data-animate], .reveal-up, .motion-card, .motion-item, .motion-image, .slide-item",
    section
  );

  targets.forEach((target, index) => {
    target.style.setProperty("--animation-delay", `${Math.min(index * 60, 420)}ms`);
    revealElement(target);
  });
}

function initActiveNavigation(navLinks) {
  const sections = qsa("main section[id]");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);
        link.classList.toggle("is-active", isActive);
      });
    });
  }, MOTION.activeSectionOptions);

  sections.forEach((section) => observer.observe(section));
}

export function initNavigation() {
  const body = document.body;
  const header = qs(SELECTORS.header);
  const navToggle = qs(SELECTORS.navToggle);
  const navMenu = qs(SELECTORS.mainNav);
  const navLinks = qsa(SELECTORS.navLink);
  const toTopButton = qs(SELECTORS.toTop);

  navToggle?.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navMenu?.classList.toggle("is-open", isOpen);
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    if (navMenu?.contains(event.target) || navToggle?.contains(event.target)) return;
    closeMenu(body, navMenu, navToggle);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(body, navMenu, navToggle);
  });

  window.addEventListener("scroll", () => updateHeaderState(header, toTopButton), { passive: true });
  updateHeaderState(header, toTopButton);

  qsa(SELECTORS.internalLink).forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = getHashTarget(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      closeMenu(body, navMenu, navToggle);
      scrollToElement(target);

      window.setTimeout(() => revealSectionAnimations(target), 450);
    });
  });

  toTopButton?.addEventListener("click", scrollToTop);
  initActiveNavigation(navLinks);
}
