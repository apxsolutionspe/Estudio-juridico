import { MOTION } from "./config.js";

export const qs = (selector, scope = document) => scope.querySelector(selector);

export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const prefersReducedMotion = () => window.matchMedia(MOTION.reducedMotionQuery).matches;

export function getHashTarget(href) {
  if (!href || !href.startsWith("#") || href.length === 1) return null;

  try {
    const id = decodeURIComponent(href.slice(1));
    return document.getElementById(id) || document.querySelector(href);
  } catch {
    return null;
  }
}
