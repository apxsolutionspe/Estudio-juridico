export const SELECTORS = {
  header: ".site-header",
  navToggle: "[data-nav-toggle]",
  mainNav: "[data-main-nav]",
  navLink: ".nav-link",
  internalLink: 'a[href^="#"]',
  toTop: "[data-to-top]",
  contactForm: "[data-contact-form]",
  formStatus: "[data-form-status]",
  faqDetails: "[data-faq-list] details",
  flipCard: ".flip-card",
  pressableCard: ".feature-card, .service-card, .wide-card, .step, .quote-card",
  parallaxFrame: ".image-frame",
  heroVideo: ".hero-video"
};

export const MOTION = {
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  revealOptions: { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
  sectionOptions: { threshold: 0.18, rootMargin: "0px 0px -12% 0px" },
  activeSectionOptions: { threshold: 0.01, rootMargin: "-34% 0px -56% 0px" }
};
