// provider/notifications.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

function iconFor(type) {
  return { success: "bi-check-circle", warning: "bi-exclamation-triangle", info: "bi-info-circle", danger: "bi-x-circle" }[type] || "bi-bell";
}

function renderNotifs(providerId) {
  const notifs = SS.data.get("smartProviderNotifications", []).filter(n => n.providerId === providerId).sort((a, b) => new Date(b.time) - new Date(a.time));
  const listEl = document.getElementById("notifList");
  const emptyEl = document.getElementById("notifEmpty");

  if (!notifs.length) {
    listEl.innerHTML = "";
    emptyEl.classList.remove("d-none");
    emptyEl.innerHTML = SS.emptyStateHTML("bi-bell", "You're all caught up", "New booking requests and updates will show up here.");
    return;
  }
  emptyEl.classList.add("d-none");
  listEl.innerHTML = notifs.map(n =>
    '<div class="notif-item' + (n.read ? "" : " unread") + '">' +
      '<span class="n-icon"><i class="bi ' + iconFor(n.type) + '"></i></span>' +
      '<div class="flex-grow-1">' +
        '<div class="n-text">' + SS.escapeHTML(n.text) + '</div>' +
        '<div class="n-time">' + SS.timeAgo(n.time) + '</div>' +
      '</div>' +
      (n.read ? "" : '<button class="btn btn-sm-2 btn-light-2 mark-read-btn" data-id="' + n.id + '">Mark read</button>') +
    '</div>'
  ).join("");

  document.querySelectorAll(".mark-read-btn").forEach(btn => btn.addEventListener("click", () => {
    const all = SS.data.get("smartProviderNotifications", []);
    const idx = all.findIndex(n => n.id === Number(btn.dataset.id));
    if (idx > -1) { all[idx].read = true; SS.data.set("smartProviderNotifications", all); }
    renderNotifs(providerId);
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("notifications", "Notifications", "");
  const provider = SS.currentProvider();
  if (!provider) return;

  renderNotifs(provider.id);

  document.getElementById("markAllReadBtn").addEventListener("click", () => {
    const all = SS.data.get("smartProviderNotifications", []);
    all.forEach(n => { if (n.providerId === provider.id) n.read = true; });
    SS.data.set("smartProviderNotifications", all);
    renderNotifs(provider.id);
    SS.toast("All notifications marked as read.", "success");
  });
});
