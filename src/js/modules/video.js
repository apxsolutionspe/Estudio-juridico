import { SELECTORS } from "../core/config.js";
import { prefersReducedMotion, qs } from "../core/helpers.js";

export function initHeroVideo() {
  const video = qs(SELECTORS.heroVideo);
  if (!video || prefersReducedMotion()) return;

  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      video.controls = false;
    });
  }
}
