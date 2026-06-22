import { SELECTORS } from "../core/config.js";
import { qs, qsa } from "../core/helpers.js";

function setStatus(statusElement, message, type) {
  if (!statusElement) return;

  statusElement.textContent = message;
  statusElement.classList.toggle("is-success", type === "success");
  statusElement.classList.toggle("is-error", type === "error");
}

function markInvalid(field, isInvalid) {
  field.classList.toggle("is-invalid", isInvalid);
  field.setAttribute("aria-invalid", String(isInvalid));
}

export function initContactForm() {
  const form = qs(SELECTORS.contactForm);
  const formStatus = qs(SELECTORS.formStatus);

  if (!form) return;

  form.addEventListener("input", (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (field.value.trim()) markInvalid(field, false);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = qsa("[required]", form);
    const emptyFields = requiredFields.filter((field) => !String(field.value || "").trim());
    const email = qs('input[type="email"]', form);
    const emailValue = String(email?.value || "").trim();
    const emailIsInvalid = Boolean(emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue));

    requiredFields.forEach((field) => markInvalid(field, emptyFields.includes(field)));
    if (email) markInvalid(email, emailIsInvalid || emptyFields.includes(email));

    if (emptyFields.length > 0) {
      setStatus(formStatus, "Completa los campos obligatorios para enviar la consulta.", "error");
      emptyFields[0].focus();
      return;
    }

    if (emailIsInvalid) {
      setStatus(formStatus, "Ingresa un correo electrónico válido.", "error");
      email.focus();
      return;
    }

    setStatus(formStatus, "Consulta registrada correctamente. Nos comunicaremos contigo para coordinar la atención.", "success");
    form.reset();
    requiredFields.forEach((field) => markInvalid(field, false));
  });
}
