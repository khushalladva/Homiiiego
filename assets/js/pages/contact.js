// contact.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;
  const name = document.getElementById("cName");
  const email = document.getElementById("cEmail");
  const subject = document.getElementById("cSubject");
  const message = document.getElementById("cMessage");

  if (!SS.validate.notEmpty(name.value)) { SS.setFieldError(name, "Please enter your name."); valid = false; } else SS.clearFieldError(name);
  if (!SS.validate.isEmail(email.value)) { SS.setFieldError(email, "Please enter a valid email address."); valid = false; } else SS.clearFieldError(email);
  if (!SS.validate.notEmpty(subject.value)) { SS.setFieldError(subject, "Please enter a subject."); valid = false; } else SS.clearFieldError(subject);
  if (!SS.validate.notEmpty(message.value)) { SS.setFieldError(message, "Please enter a message."); valid = false; } else SS.clearFieldError(message);
  if (!valid) return;

  const btn = document.getElementById("contactBtn");
  SS.setButtonLoading(btn, "Sending...");
  setTimeout(() => {
    SS.resetButtonLoading(btn);
    SS.toast("Your message has been sent. We'll get back to you soon.", "success");
    document.getElementById("contactForm").reset();
    document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
  }, 800);
});
