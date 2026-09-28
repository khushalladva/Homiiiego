// user/change-password.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("profile", "Change Password", "");
  if (!SS.currentUser()) return;

  const curEl = document.getElementById("cpCurrent");
  const newEl = document.getElementById("cpNew");
  const confirmEl = document.getElementById("cpConfirm");

  SS.wirePasswordToggle(curEl, document.getElementById("cpCurrentToggle"));
  SS.wirePasswordToggle(newEl, document.getElementById("cpNewToggle"));
  SS.wirePasswordStrength(newEl, document.getElementById("cpStrengthBar"), document.getElementById("cpStrengthLabel"));

  document.getElementById("cpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    if (!SS.validate.minLen(curEl.value, 6)) { SS.setFieldError(curEl, "Current password looks incorrect."); valid = false; } else SS.clearFieldError(curEl);
    if (!SS.validate.minLen(newEl.value, 8)) { SS.setFieldError(newEl, "Password must contain at least 8 characters."); valid = false; } else SS.clearFieldError(newEl);
    if (confirmEl.value !== newEl.value || !confirmEl.value) { SS.setFieldError(confirmEl, "Passwords do not match."); valid = false; } else SS.clearFieldError(confirmEl);
    if (!valid) return;

    const btn = document.getElementById("cpBtn");
    SS.setButtonLoading(btn, "Updating...");
    setTimeout(() => {
      const result = SS.auth.changePassword(curEl.value, newEl.value);
      SS.resetButtonLoading(btn);
      if (result.ok) {
        SS.toast("Password updated successfully.", "success");
        document.getElementById("cpForm").reset();
        document.getElementById("cpStrengthBar").style.width = "0%";
        document.getElementById("cpStrengthLabel").textContent = "";
      } else {
        SS.setFieldError(curEl, result.message);
      }
    }, 700);
  });
});
