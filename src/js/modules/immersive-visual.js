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

function setLayerState(section, layers, activeIndex) {
  section.dataset.visualStep = String(activeIndex);

  layers.forEach((layer, index) => {
    const isActive = index === activeIndex;

    layer.classList.toggle("is-active", isActive);
    layer.setAttribute("aria-pressed", String(isActive));
  });
}

function updateVisual(image, progress, activeIndex, reducedMotion) {
  if (!image || reducedMotion) return;

  const stepOffset = (activeIndex - 1) * -5;
  const y = Math.round((progress - 0.5) * -16 + stepOffset);
  const x = Math.round((activeIndex - 1) * -4);
  const scale = 1.025 + progress * 0.028 + activeIndex * 0.006;

  image.style.setProperty("--visual-x", `${x}px`);
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
  let activeIndex = -1;
  let transitionTimer = 0;

  const activateLayer = (nextIndex) => {
    if (nextIndex === activeIndex) return;

    activeIndex = nextIndex;
    setLayerState(section, layers, activeIndex);

    section.classList.add("is-visual-transitioning");
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      section.classList.remove("is-visual-transitioning");
    }, 460);
  };

  const update = () => {
    const progress = getSectionProgress(section);
    const nextIndex = getActiveLayerIndex(progress, layers.length);

    activateLayer(nextIndex);
    updateVisual(image, progress, activeIndex, reducedMotion);
  };

  layers.forEach((layer, index) => {
    layer.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      activateLayer(index);
      updateVisual(image, getSectionProgress(section), index, reducedMotion);
    });

    layer.addEventListener("focus", () => {
      activateLayer(index);
      updateVisual(image, getSectionProgress(section), index, reducedMotion);
    });

    layer.addEventListener("click", () => {
      activateLayer(index);
      updateVisual(image, getSectionProgress(section), index, reducedMotion);
    });
  });

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}
