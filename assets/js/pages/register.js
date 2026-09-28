// register.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  if (SS.isLoggedIn()) { window.location.href = "user/dashboard.html"; return; }

  const nameEl = document.getElementById("regName");
  const emailEl = document.getElementById("regEmail");
  const phoneEl = document.getElementById("regPhone");
  const pwEl = document.getElementById("regPassword");
  const confirmEl = document.getElementById("regConfirm");
  const termsEl = document.getElementById("regTerms");

  SS.wirePasswordToggle(pwEl, document.getElementById("regPwToggle"));
  SS.wirePasswordStrength(pwEl, document.getElementById("pwStrengthBar"), document.getElementById("pwStrengthLabel"));

  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    if (!SS.validate.notEmpty(nameEl.value)) { SS.setFieldError(nameEl, "Please enter your full name."); valid = false; } else SS.clearFieldError(nameEl);
    if (!SS.validate.isEmail(emailEl.value)) { SS.setFieldError(emailEl, "Please enter a valid email address."); valid = false; } else SS.clearFieldError(emailEl);
    if (!SS.validate.isPhone(phoneEl.value)) { SS.setFieldError(phoneEl, "Please enter a valid phone number."); valid = false; } else SS.clearFieldError(phoneEl);
    if (!SS.validate.minLen(pwEl.value, 8)) { SS.setFieldError(pwEl, "Password must contain at least 8 characters."); valid = false; } else SS.clearFieldError(pwEl);
    if (confirmEl.value !== pwEl.value || !confirmEl.value) { SS.setFieldError(confirmEl, "Passwords do not match."); valid = false; } else SS.clearFieldError(confirmEl);
    if (!termsEl.checked) { termsEl.classList.add("is-invalid"); valid = false; } else termsEl.classList.remove("is-invalid");

    if (!valid) return;

    const btn = document.getElementById("registerBtn");
    SS.setButtonLoading(btn, "Creating account...");

    setTimeout(() => {
      const result = SS.auth.register({ name: nameEl.value.trim(), email: emailEl.value.trim(), phone: phoneEl.value.trim() });
      SS.resetButtonLoading(btn);
      if (result.ok) {
        SS.toast("Account created successfully! Please login.", "success");
        setTimeout(() => window.location.href = "login.html", 800);
      } else {
        SS.setFieldError(emailEl, result.message);
      }
    }, 700);
  });
});
