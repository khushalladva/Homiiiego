// forgot-password.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.getElementById("forgotForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const emailEl = document.getElementById("forgotEmail");
  if (!SS.validate.isEmail(emailEl.value)) { SS.setFieldError(emailEl, "Please enter a valid email address."); return; }
  SS.clearFieldError(emailEl);

  const btn = document.getElementById("forgotBtn");
  SS.setButtonLoading(btn, "Sending...");

  setTimeout(() => {
    const result = SS.auth.requestPasswordReset(emailEl.value.trim());
    SS.resetButtonLoading(btn);
    if (result.ok) {
      document.getElementById("forgotForm").classList.add("d-none");
      document.getElementById("forgotSuccessBox").classList.remove("d-none");
    } else {
      SS.setFieldError(emailEl, result.message);
    }
  }, 700);
});
