// login.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  if (SS.isLoggedIn()) { window.location.href = "user/dashboard.html"; return; }

  const emailEl = document.getElementById("loginEmail");
  const pwEl = document.getElementById("loginPassword");
  SS.wirePasswordToggle(pwEl, document.getElementById("loginPwToggle"));

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    if (!SS.validate.isEmail(emailEl.value)) { SS.setFieldError(emailEl, "Please enter a valid email address."); valid = false; } else SS.clearFieldError(emailEl);
    if (!SS.validate.minLen(pwEl.value, 6)) { SS.setFieldError(pwEl, "Password must be at least 6 characters."); valid = false; } else SS.clearFieldError(pwEl);
    if (!valid) return;

    const btn = document.getElementById("loginBtn");
    SS.setButtonLoading(btn, "Logging in...");

    setTimeout(() => {
      const result = SS.auth.login(emailEl.value.trim(), pwEl.value);
      SS.resetButtonLoading(btn);
      if (result.ok) {
        SS.toast("Welcome back, " + result.user.name.split(" ")[0] + "!", "success");
        setTimeout(() => window.location.href = "user/dashboard.html", 600);
      } else {
        const alertBox = document.getElementById("loginAlert");
        alertBox.textContent = result.message;
        alertBox.className = "alert d-block";
        alertBox.style.background = "var(--danger-light)";
        alertBox.style.color = "#B91C1C";
        alertBox.style.borderRadius = "8px";
        alertBox.style.fontSize = "0.88rem";
        alertBox.style.padding = "0.75rem 1rem";
        alertBox.style.marginBottom = "1rem";
      }
    }, 700);
  });
});
