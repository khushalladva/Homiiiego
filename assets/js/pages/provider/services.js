// provider/services.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let serviceIdPendingDelete = null;

function renderProviderServices(providerId) {
  const services = SS.providerServices.getAll(providerId);
  const grid = document.getElementById("servicesGrid");
  const emptyBox = document.getElementById("servicesEmpty");

  if (!services.length) {
    grid.innerHTML = "";
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-briefcase", "No services listed yet", "Add your first service so customers can start booking you.", "Add Service", "add-service.html");
    return;
  }
  emptyBox.classList.add("d-none");

  grid.innerHTML = services.map(svc =>
    '<div class="col-sm-6 col-lg-4">' +
      '<div class="service-card">' +
        '<div class="thumb-wrap">' +
          '<img src="' + svc.image + '" alt="' + SS.escapeHTML(svc.name) + '" loading="lazy">' +
          '<span class="cat-badge">' + SS.escapeHTML(svc.category) + '</span>' +
        '</div>' +
        '<div class="body">' +
          '<div class="d-flex justify-content-between align-items-start mb-1">' +
            '<h5 class="mb-0">' + SS.escapeHTML(svc.name) + '</h5>' +
          '</div>' +
          '<div class="mb-2">' + SS.booking.statusBadgeHTML(svc.status === "active" ? "active" : "cancelled") + '</div>' +
          '<div class="price-row">' +
            '<div class="price">₹' + svc.price + '</div>' +
            '<div class="duration-pill"><i class="bi bi-clock me-1"></i>' + svc.duration + '</div>' +
          '</div>' +
          '<div class="actions">' +
            '<button class="btn btn-light-2 btn-sm-2 toggle-status-btn" data-id="' + svc.id + '"><i class="bi bi-toggle2-' + (svc.status === "active" ? "on" : "off") + ' me-1"></i>' + (svc.status === "active" ? "Deactivate" : "Activate") + '</button>' +
            '<button class="btn btn-outline-primary btn-sm-2 edit-service-btn" data-id="' + svc.id + '"><i class="bi bi-pencil"></i></button>' +
            '<button class="btn btn-outline-danger btn-sm-2 delete-service-btn" data-id="' + svc.id + '"><i class="bi bi-trash"></i></button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join("");

  document.querySelectorAll(".toggle-status-btn").forEach(btn => btn.addEventListener("click", () => {
    SS.providerServices.toggleStatus(Number(btn.dataset.id));
    SS.toast("Service status updated.", "success");
    renderProviderServices(providerId);
  }));

  document.querySelectorAll(".edit-service-btn").forEach(btn => btn.addEventListener("click", () => {
    window.location.href = "add-service.html?id=" + btn.dataset.id;
  }));

  document.querySelectorAll(".delete-service-btn").forEach(btn => btn.addEventListener("click", () => {
    serviceIdPendingDelete = Number(btn.dataset.id);
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("services", "My Services", "");
  const provider = SS.currentProvider();
  if (!provider) return;

  renderProviderServices(provider.id);

  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (serviceIdPendingDelete !== null) {
      SS.providerServices.remove(serviceIdPendingDelete);
      bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
      SS.toast("Service deleted.", "info");
      renderProviderServices(provider.id);
      serviceIdPendingDelete = null;
    }
  });
});
