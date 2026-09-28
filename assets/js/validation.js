/* =========================================================
   Homiiiego — validation.js
   Shared, reusable frontend validation helpers.
   ========================================================= */

SS.validate = {
  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  },
  isPhone(value) {
    return /^[+]?[\d\s-]{8,15}$/.test(String(value || "").trim());
  },
  isPincode(value) {
    return /^\d{5,6}$/.test(String(value || "").trim());
  },
  minLen(value, len) {
    return String(value || "").length >= len;
  },
  notEmpty(value) {
    return String(value || "").trim().length > 0;
  },
  passwordScore(pw) {
    pw = pw || "";
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    return Math.min(score, 4);
  }
};

/* Show/hide a Bootstrap-style invalid state on a field with a message */
SS.setFieldError = function (fieldEl, message) {
  fieldEl.classList.add("is-invalid");
  fieldEl.classList.remove("is-valid");
  const fb = fieldEl.parentElement.querySelector(".invalid-feedback-2") || fieldEl.closest(".input-icon-group, .mb-3, .col-12, .col-md-6")?.querySelector(".invalid-feedback-2");
  if (fb) fb.textContent = message;
};

SS.clearFieldError = function (fieldEl) {
  fieldEl.classList.remove("is-invalid");
  fieldEl.classList.add("is-valid");
};

/* Password strength meter wiring — call with the password input + bar element */
SS.wirePasswordStrength = function (inputEl, barEl, labelEl) {
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const classes = ["", "pw-weak", "pw-weak", "pw-fair", "pw-good"];
  inputEl.addEventListener("input", () => {
    const score = SS.validate.passwordScore(inputEl.value);
    const pct = (score / 4) * 100;
    barEl.style.width = pct + "%";
    barEl.className = "pw-strength-bar " + (score <= 1 ? "pw-weak" : score === 2 ? "pw-fair" : score === 3 ? "pw-good" : "pw-strong");
    if (labelEl) labelEl.textContent = inputEl.value ? labels[score] : "";
  });
};

/* Password visibility toggle — call with the input + the toggle icon button */
SS.wirePasswordToggle = function (inputEl, toggleEl) {
  toggleEl.addEventListener("click", () => {
    const isPw = inputEl.type === "password";
    inputEl.type = isPw ? "text" : "password";
    toggleEl.innerHTML = isPw ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
  });
};

/* Prevent duplicate submissions + show a loading state on a submit button */
SS.setButtonLoading = function (btnEl, loadingText) {
  if (btnEl.dataset.originalText === undefined) {
    btnEl.dataset.originalText = btnEl.innerHTML;
  }
  btnEl.classList.add("is-loading");
  btnEl.disabled = true;
  btnEl.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + (loadingText || "Processing...");
};

SS.resetButtonLoading = function (btnEl) {
  btnEl.classList.remove("is-loading");
  btnEl.disabled = false;
  if (btnEl.dataset.originalText !== undefined) btnEl.innerHTML = btnEl.dataset.originalText;
};
