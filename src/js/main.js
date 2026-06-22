import { initAnimations } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initInteractions } from "./modules/interactions.js";

document.documentElement.classList.add("js-enabled");

function safeInit(name, initializer) {
  try {
    initializer?.();
  } catch (error) {
    console.error(`[${name}] Error:`, error);
  }
}

function bootstrap() {
  safeInit("Animations", initAnimations);
  safeInit("Navigation", initNavigation);
  safeInit("Interactions", initInteractions);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
