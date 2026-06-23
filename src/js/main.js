import { initAnimations } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initInteractions } from "./modules/interactions.js";
import { initImmersiveVisual } from "./modules/immersive-visual.js";

document.documentElement.classList.add("js-enabled");

function safeInit(name, initializer) {
  try {
    const result = initializer?.();
    if (result && typeof result.catch === "function") {
      result.catch((error) => console.error(`[${name}] Error:`, error));
    }
  } catch (error) {
    console.error(`[${name}] Error:`, error);
  }
}

function bootstrap() {
  safeInit("Animations", initAnimations);
  safeInit("Navigation", initNavigation);
  safeInit("Interactions", initInteractions);
  safeInit("ImmersiveVisual", initImmersiveVisual);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
