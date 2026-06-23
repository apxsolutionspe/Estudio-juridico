function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function getSectionProgress(section) {
  const rect = section.getBoundingClientRect();
  const total = Math.max(rect.height - window.innerHeight, 1);
  const current = clamp(-rect.top, 0, total);
  return current / total;
}

function getActiveLayerIndex(progress, totalLayers) {
  if (totalLayers <= 1) return 0;
  if (progress < 0.34) return 0;
  if (progress < 0.67) return 1;
  return totalLayers - 1;
}

function setLayerState(layers, progress) {
  const activeIndex = getActiveLayerIndex(progress, layers.length);

  layers.forEach((layer, index) => {
    layer.classList.toggle("is-active", index === activeIndex);
  });
}

function updateVisual(image, progress, reducedMotion) {
  if (!image || reducedMotion) return;

  const y = Math.round((progress - 0.5) * -18);
  const scale = 1.02 + progress * 0.035;

  image.style.setProperty("--visual-y", `${y}px`);
  image.style.setProperty("--visual-scale", scale.toFixed(3));
}

export function initImmersiveVisual() {
  if (window.__IMMERSIVE_VISUAL_INITIALIZED__) return;

  const section = document.querySelector(".immersive-visual-section");
  const image = document.querySelector(".immersive-visual-image");
  const layers = Array.from(document.querySelectorAll(".immersive-layer"));

  if (!section || !layers.length) return;

  window.__IMMERSIVE_VISUAL_INITIALIZED__ = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    const progress = getSectionProgress(section);

    setLayerState(layers, progress);
    updateVisual(image, progress, reducedMotion);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}
