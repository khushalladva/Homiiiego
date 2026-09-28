// admin/login.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  if (SS.currentAdmin()) { window.location.href = "dashboard.html"; return; }

  const emailEl = document.getElementById("alEmail");
  const pwEl = document.getElementById("alPassword");
  SS.wirePasswordToggle(pwEl, document.getElementById("alPwToggle"));

  document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!SS.validate.isEmail(emailEl.value)) { SS.setFieldError(emailEl, "Please enter a valid email address."); return; }
    SS.clearFieldError(emailEl);

    const btn = document.getElementById("alLoginBtn");
    SS.setButtonLoading(btn, "Logging in...");

    setTimeout(() => {
      const result = SS.adminAuth.login(emailEl.value.trim(), pwEl.value);
      SS.resetButtonLoading(btn);
      if (result.ok) {
        SS.toast("Welcome back, Admin.", "success");
        setTimeout(() => window.location.href = "dashboard.html", 500);
      } else {
        document.getElementById("loginAlertBox").innerHTML =
          '<div class="alert" style="background:var(--danger-light); color:#B91C1C; border-radius:8px; font-size:0.88rem; padding:0.75rem 1rem;">' + SS.escapeHTML(result.message) + '</div>';
      }
    }, 600);
  });
});
