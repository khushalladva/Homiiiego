// admin/notifications.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

function iconFor(type) {
  return { success: "bi-check-circle", warning: "bi-exclamation-triangle", info: "bi-info-circle", danger: "bi-x-circle" }[type] || "bi-bell";
}

function render(source) {
  const customerNotifs = SS.data.get("smartNotifications", []).map(n => Object.assign({}, n, { source: "customer" }));
  const providerNotifs = SS.data.get("smartProviderNotifications", []).map(n => Object.assign({}, n, { source: "provider" }));

  let feed = customerNotifs.concat(providerNotifs);
  if (source !== "all") feed = feed.filter(n => n.source === source);
  feed.sort((a, b) => new Date(b.time) - new Date(a.time));

  const listEl = document.getElementById("notifList");
  const emptyEl = document.getElementById("notifEmpty");

  if (!feed.length) {
    listEl.innerHTML = "";
    emptyEl.classList.remove("d-none");
    emptyEl.innerHTML = SS.emptyStateHTML("bi-bell", "No activity yet", "Platform notifications will appear here as customers and providers interact.");
    return;
  }
  emptyEl.classList.add("d-none");

  listEl.innerHTML = feed.map(n =>
    '<div class="notif-item">' +
      '<span class="n-icon"><i class="bi ' + iconFor(n.type) + '"></i></span>' +
      '<div class="flex-grow-1">' +
        '<div class="n-text">' + SS.escapeHTML(n.text) + ' <span class="badge rounded-pill text-muted-2" style="background:var(--light); font-weight:600; font-size:0.68rem;">' + (n.source === "provider" ? "Provider" : "Customer") + '</span></div>' +
        '<div class="n-time">' + SS.timeAgo(n.time) + '</div>' +
      '</div>' +
    '</div>'
  ).join("");
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("notifications", "Notifications", "");
  if (!SS.currentAdmin()) return;

  document.querySelectorAll("#feedTabs .tab-btn").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll("#feedTabs .tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.source);
  }));

  render("all");
});
