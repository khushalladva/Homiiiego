// admin/providers.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let providerIdPendingDelete = null;

function renderProviders() {
  const providers = SS.adminProviders.getAll();
  const tbody = document.getElementById("providersBody");
  const emptyBox = document.getElementById("providersEmpty");

  if (!providers.length) {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-briefcase", "No providers yet", "Providers who register will appear here for approval.");
    return;
  }
  document.querySelector(".table-wrap-2").classList.remove("d-none");
  emptyBox.classList.add("d-none");

  tbody.innerHTML = providers.map(p =>
    '<tr>' +
      '<td data-label="Provider">' + SS.escapeHTML(p.name) + '</td>' +
      '<td data-label="Business">' + SS.escapeHTML(p.business) + '</td>' +
      '<td data-label="Email">' + SS.escapeHTML(p.email) + '</td>' +
      '<td data-label="Phone">' + SS.escapeHTML(p.phone) + '</td>' +
      '<td data-label="Services">' + p.services + '</td>' +
      '<td data-label="Rating"><span class="stars" style="color:var(--warning)">' + SS.renderStars(p.rating || 0) + '</span> ' + (p.rating || 0).toFixed(1) + '</td>' +
      '<td data-label="Status"><span class="status-badge status-' + (p.status === "blocked" ? "blocked" : p.status === "pending" ? "pending" : "active") + '">' + p.status.charAt(0).toUpperCase() + p.status.slice(1) + '</span></td>' +
      '<td data-label="Actions">' +
        '<div class="d-flex gap-1">' +
          '<button class="btn btn-sm-2 btn-light-2 view-btn" data-id="' + p.id + '" title="View"><i class="bi bi-eye"></i></button>' +
          (p.status === "pending" ? '<button class="btn btn-sm-2 btn-primary approve-btn" data-id="' + p.id + '" title="Approve"><i class="bi bi-check-lg"></i></button>' : '') +
          '<button class="btn btn-sm-2 btn-light-2 block-btn" data-id="' + p.id + '" title="' + (p.status === "blocked" ? "Unblock" : "Block") + '"><i class="bi bi-' + (p.status === "blocked" ? "unlock" : "slash-circle") + '"></i></button>' +
          '<button class="btn btn-sm-2 btn-outline-danger delete-btn" data-id="' + p.id + '" title="Delete"><i class="bi bi-trash"></i></button>' +
        '</div>' +
      '</td>' +
    '</tr>'
  ).join("");

  document.querySelectorAll(".view-btn").forEach(btn => btn.addEventListener("click", () => {
    const p = SS.adminProviders.getAll().find(x => x.id === Number(btn.dataset.id));
    document.getElementById("viewProviderBody").innerHTML =
      '<div class="summary-row"><span class="lbl">Contact Name</span><span class="val">' + SS.escapeHTML(p.name) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Business</span><span class="val">' + SS.escapeHTML(p.business) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Email</span><span class="val">' + SS.escapeHTML(p.email) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Phone</span><span class="val">' + SS.escapeHTML(p.phone) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Joined</span><span class="val">' + SS.formatDate(p.joined) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Active Services</span><span class="val">' + p.services + '</span></div>';
    new bootstrap.Modal(document.getElementById("viewProviderModal")).show();
  }));

  document.querySelectorAll(".approve-btn").forEach(btn => btn.addEventListener("click", () => {
    SS.adminProviders.approve(Number(btn.dataset.id));
    SS.toast("Provider approved.", "success");
    renderProviders();
  }));

  document.querySelectorAll(".block-btn").forEach(btn => btn.addEventListener("click", () => {
    const updated = SS.adminProviders.toggleBlock(Number(btn.dataset.id));
    SS.toast(updated.status === "blocked" ? "Provider blocked." : "Provider unblocked.", "info");
    renderProviders();
  }));

  document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", () => {
    providerIdPendingDelete = Number(btn.dataset.id);
    new bootstrap.Modal(document.getElementById("deleteProviderModal")).show();
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("providers", "Providers", "");
  if (!SS.currentAdmin()) return;

  renderProviders();

  document.getElementById("confirmDeleteProviderBtn").addEventListener("click", function () {
    if (providerIdPendingDelete !== null) {
      SS.adminProviders.remove(providerIdPendingDelete);
      bootstrap.Modal.getInstance(document.getElementById("deleteProviderModal")).hide();
      SS.toast("Provider removed.", "info");
      renderProviders();
      providerIdPendingDelete = null;
    }
  });
});
