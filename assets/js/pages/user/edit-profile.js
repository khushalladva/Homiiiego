// user/edit-profile.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("profile", "Edit Profile", "");
  const user = SS.currentUser();
  if (!user) return;

  document.getElementById("efName").value = user.name || "";
  document.getElementById("efEmail").value = user.email || "";
  document.getElementById("efPhone").value = user.phone || "";
  document.getElementById("efCity").value = user.city || "";
  document.getElementById("efPincode").value = user.pincode || "";
  document.getElementById("efAddress").value = user.address || "";

  document.getElementById("editProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    const nameEl = document.getElementById("efName");
    const phoneEl = document.getElementById("efPhone");
    const pinEl = document.getElementById("efPincode");

    if (!SS.validate.notEmpty(nameEl.value)) { SS.setFieldError(nameEl, "Please enter your full name."); valid = false; } else SS.clearFieldError(nameEl);
    if (!SS.validate.isPhone(phoneEl.value)) { SS.setFieldError(phoneEl, "Please enter a valid phone number."); valid = false; } else SS.clearFieldError(phoneEl);
    if (pinEl.value && !SS.validate.isPincode(pinEl.value)) { SS.setFieldError(pinEl, "Please enter a valid pincode."); valid = false; } else SS.clearFieldError(pinEl);
    if (!valid) return;

    const btn = document.getElementById("saveProfileBtn");
    SS.setButtonLoading(btn, "Saving...");

    setTimeout(() => {
      const updatedUser = Object.assign({}, user, {
        name: nameEl.value.trim(),
        phone: phoneEl.value.trim(),
        city: document.getElementById("efCity").value.trim(),
        pincode: pinEl.value.trim(),
        address: document.getElementById("efAddress").value.trim()
      });
      SS.data.set("smartUser", updatedUser);

      const users = SS.data.get("smartUsers", []);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx > -1) { users[idx] = updatedUser; SS.data.set("smartUsers", users); }

      SS.resetButtonLoading(btn);
      SS.toast("Profile updated successfully.", "success");
      setTimeout(() => window.location.href = "profile.html", 700);
    }, 700);
  });
});
