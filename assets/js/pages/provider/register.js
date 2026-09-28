// provider/register.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  if (SS.currentProvider()) { window.location.href = "dashboard.html"; return; }

  const nameEl = document.getElementById("prName");
  const businessEl = document.getElementById("prBusiness");
  const emailEl = document.getElementById("prEmail");
  const phoneEl = document.getElementById("prPhone");
  const pwEl = document.getElementById("prPassword");
  const termsEl = document.getElementById("prTerms");

  SS.wirePasswordToggle(pwEl, document.getElementById("prPwToggle"));

  document.getElementById("providerRegisterForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    if (!SS.validate.notEmpty(nameEl.value)) { SS.setFieldError(nameEl, "Please enter a contact name."); valid = false; } else SS.clearFieldError(nameEl);
    if (!SS.validate.notEmpty(businessEl.value)) { SS.setFieldError(businessEl, "Please enter your business name."); valid = false; } else SS.clearFieldError(businessEl);
    if (!SS.validate.isEmail(emailEl.value)) { SS.setFieldError(emailEl, "Please enter a valid email address."); valid = false; } else SS.clearFieldError(emailEl);
    if (!SS.validate.isPhone(phoneEl.value)) { SS.setFieldError(phoneEl, "Please enter a valid phone number."); valid = false; } else SS.clearFieldError(phoneEl);
    if (!SS.validate.minLen(pwEl.value, 8)) { SS.setFieldError(pwEl, "Password must contain at least 8 characters."); valid = false; } else SS.clearFieldError(pwEl);
    if (!termsEl.checked) { termsEl.classList.add("is-invalid"); valid = false; } else termsEl.classList.remove("is-invalid");

    if (!valid) return;

    const btn = document.getElementById("prRegisterBtn");
    SS.setButtonLoading(btn, "Submitting...");

    setTimeout(() => {
      const result = SS.providerAuth.register({
        name: nameEl.value.trim(),
        business: businessEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl.value.trim()
      });
      SS.resetButtonLoading(btn);
      if (result.ok) {
        SS.toast("Application submitted! We'll review it shortly.", "success");
        setTimeout(() => window.location.href = "login.html", 900);
      } else {
        SS.setFieldError(emailEl, result.message);
      }
    }, 700);
  });
});
