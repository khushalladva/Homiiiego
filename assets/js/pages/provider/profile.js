// provider/profile.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("profile", "My Profile", "");
  const provider = SS.currentProvider();
  if (!provider) return;

  const initials = provider.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  document.getElementById("providerAvatar").textContent = initials;
  document.getElementById("providerBusinessName").textContent = provider.business;
  document.getElementById("providerContactName").textContent = provider.name;
  document.getElementById("providerStars").textContent = SS.renderStars(provider.rating || 0);
  document.getElementById("providerRatingNum").textContent = (provider.rating || 0).toFixed(1);

  const statusBadge = document.getElementById("providerStatusBadge");
  statusBadge.className = "status-badge status-" + provider.status;
  statusBadge.textContent = provider.status.charAt(0).toUpperCase() + provider.status.slice(1);

  document.getElementById("pfContact").value = provider.name;
  document.getElementById("pfBusiness").value = provider.business;
  document.getElementById("pfEmail").value = provider.email;
  document.getElementById("pfPhone").value = provider.phone;

  document.getElementById("providerProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    const contactEl = document.getElementById("pfContact");
    const businessEl = document.getElementById("pfBusiness");
    const phoneEl = document.getElementById("pfPhone");

    if (!SS.validate.notEmpty(contactEl.value)) { SS.setFieldError(contactEl, "Please enter a contact name."); valid = false; } else SS.clearFieldError(contactEl);
    if (!SS.validate.notEmpty(businessEl.value)) { SS.setFieldError(businessEl, "Please enter a business name."); valid = false; } else SS.clearFieldError(businessEl);
    if (!SS.validate.isPhone(phoneEl.value)) { SS.setFieldError(phoneEl, "Please enter a valid phone number."); valid = false; } else SS.clearFieldError(phoneEl);
    if (!valid) return;

    const btn = document.getElementById("saveProviderProfileBtn");
    SS.setButtonLoading(btn, "Saving...");

    setTimeout(() => {
      const updated = Object.assign({}, provider, { name: contactEl.value.trim(), business: businessEl.value.trim(), phone: phoneEl.value.trim() });
      SS.data.set("smartProvider", updated);

      const providers = SS.data.get("smartProviders", []);
      const idx = providers.findIndex(p => p.id === provider.id);
      if (idx > -1) { providers[idx] = updated; SS.data.set("smartProviders", providers); }

      SS.resetButtonLoading(btn);
      SS.toast("Profile updated successfully.", "success");
      document.getElementById("providerBusinessName").textContent = updated.business;
      document.getElementById("providerContactName").textContent = updated.name;
    }, 600);
  });
});
