// provider/login.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  if (SS.currentProvider()) { window.location.href = "dashboard.html"; return; }

  const emailEl = document.getElementById("plEmail");
  const pwEl = document.getElementById("plPassword");
  SS.wirePasswordToggle(pwEl, document.getElementById("plPwToggle"));

  document.getElementById("providerLoginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    if (!SS.validate.isEmail(emailEl.value)) { SS.setFieldError(emailEl, "Please enter a valid email address."); valid = false; } else SS.clearFieldError(emailEl);
    if (!SS.validate.minLen(pwEl.value, 6)) { SS.setFieldError(pwEl, "Password must be at least 6 characters."); valid = false; } else SS.clearFieldError(pwEl);
    if (!valid) return;

    const btn = document.getElementById("plLoginBtn");
    SS.setButtonLoading(btn, "Logging in...");

    setTimeout(() => {
      const result = SS.providerAuth.login(emailEl.value.trim(), pwEl.value);
      SS.resetButtonLoading(btn);
      if (result.ok) {
        SS.toast("Welcome back, " + result.provider.name + "!", "success");
        setTimeout(() => window.location.href = "dashboard.html", 600);
      } else {
        document.getElementById("loginAlertBox").innerHTML =
          '<div class="alert" style="background:var(--danger-light); color:#B91C1C; border-radius:8px; font-size:0.88rem; padding:0.75rem 1rem;">' + SS.escapeHTML(result.message) + '</div>';
      }
    }, 700);
  });
});
