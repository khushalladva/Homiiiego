// admin/settings.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

const DEFAULT_SETTINGS = { name: "Homiiiego", supportEmail: "support@homiiiego.test", currency: "₹", commission: 10, autoApprove: false, requireReview: true, allowCancel: true };

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("settings", "Settings", "");
  if (!SS.currentAdmin()) return;

  const settings = SS.data.get("smartSettings", DEFAULT_SETTINGS);
  document.getElementById("setName").value = settings.name;
  document.getElementById("setSupportEmail").value = settings.supportEmail;
  document.getElementById("setCurrency").value = settings.currency;
  document.getElementById("setCommission").value = settings.commission;
  document.getElementById("setAutoApprove").checked = settings.autoApprove;
  document.getElementById("setRequireReview").checked = settings.requireReview;
  document.getElementById("setAllowCancel").checked = settings.allowCancel;

  document.getElementById("settingsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = document.getElementById("saveSettingsBtn");
    SS.setButtonLoading(btn, "Saving...");
    setTimeout(() => {
      SS.data.set("smartSettings", {
        name: document.getElementById("setName").value.trim(),
        supportEmail: document.getElementById("setSupportEmail").value.trim(),
        currency: document.getElementById("setCurrency").value.trim() || "₹",
        commission: Number(document.getElementById("setCommission").value) || 0,
        autoApprove: document.getElementById("setAutoApprove").checked,
        requireReview: document.getElementById("setRequireReview").checked,
        allowCancel: document.getElementById("setAllowCancel").checked
      });
      SS.resetButtonLoading(btn);
      SS.toast("Settings saved successfully.", "success");
    }, 600);
  });

  document.getElementById("resetDataBtn").addEventListener("click", function () {
    if (!confirm("This will clear all demo data and reload the app. Continue?")) return;
    ["smartUser", "smartProvider", "smartAdmin", "smartRole", "smartUsers", "smartProviders", "smartCategories",
     "smartServices", "smartBookings", "smartReviews", "smartNotifications", "smartProviderNotifications", "smartSettings"]
      .forEach(key => localStorage.removeItem(key));
    SS.toast("Demo data reset. Reloading...", "info");
    setTimeout(() => window.location.href = "../index.html", 900);
  });
});
