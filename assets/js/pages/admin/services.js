// admin/services.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let serviceIdPendingDelete = null;

function renderServices() {
  const services = SS.services.getAll();
  const tbody = document.getElementById("servicesBody");
  const emptyBox = document.getElementById("servicesEmpty");

  if (!services.length) {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-tools", "No services listed", "Services added by providers will appear here.");
    return;
  }
  document.querySelector(".table-wrap-2").classList.remove("d-none");
  emptyBox.classList.add("d-none");

  tbody.innerHTML = services.map(s =>
    '<tr>' +
      '<td data-label="Service">' + SS.escapeHTML(s.name) + '</td>' +
      '<td data-label="Category">' + SS.escapeHTML(s.category) + '</td>' +
      '<td data-label="Provider">' + SS.escapeHTML(s.provider) + '</td>' +
      '<td data-label="Price">₹' + s.price + '</td>' +
      '<td data-label="Rating"><span class="stars" style="color:var(--warning)">' + SS.renderStars(s.rating) + '</span> ' + s.rating.toFixed(1) + '</td>' +
      '<td data-label="Status"><span class="status-badge status-' + (s.status === "active" ? "active" : "blocked") + '">' + (s.status === "active" ? "Active" : "Inactive") + '</span></td>' +
      '<td data-label="Actions">' +
        '<div class="d-flex gap-1">' +
          '<a href="../service-details.html?id=' + s.id + '" target="_blank" class="btn btn-sm-2 btn-light-2" title="View"><i class="bi bi-eye"></i></a>' +
          '<button class="btn btn-sm-2 btn-light-2 edit-svc-btn" data-id="' + s.id + '" title="Edit"><i class="bi bi-pencil"></i></button>' +
          '<button class="btn btn-sm-2 btn-light-2 toggle-svc-btn" data-id="' + s.id + '" title="Toggle status"><i class="bi bi-toggle2-' + (s.status === "active" ? "on" : "off") + '"></i></button>' +
          '<button class="btn btn-sm-2 btn-outline-danger delete-svc-btn" data-id="' + s.id + '" title="Delete"><i class="bi bi-trash"></i></button>' +
        '</div>' +
      '</td>' +
    '</tr>'
  ).join("");

  document.querySelectorAll(".edit-svc-btn").forEach(btn => btn.addEventListener("click", () => {
    const s = SS.services.getById(btn.dataset.id);
    document.getElementById("esId").value = s.id;
    document.getElementById("esName").value = s.name;
    document.getElementById("esPrice").value = s.price;
    document.getElementById("esDuration").value = s.duration;
    new bootstrap.Modal(document.getElementById("editServiceModal")).show();
  }));

  document.querySelectorAll(".toggle-svc-btn").forEach(btn => btn.addEventListener("click", () => {
    SS.providerServices.toggleStatus(Number(btn.dataset.id));
    SS.toast("Service status updated.", "success");
    renderServices();
  }));

  document.querySelectorAll(".delete-svc-btn").forEach(btn => btn.addEventListener("click", () => {
    serviceIdPendingDelete = Number(btn.dataset.id);
    new bootstrap.Modal(document.getElementById("deleteServiceModal")).show();
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("services", "Services", "");
  if (!SS.currentAdmin()) return;

  renderServices();

  document.getElementById("saveServiceEditBtn").addEventListener("click", function () {
    const id = Number(document.getElementById("esId").value);
    SS.providerServices.update(id, {
      name: document.getElementById("esName").value.trim(),
      price: Number(document.getElementById("esPrice").value),
      duration: document.getElementById("esDuration").value.trim()
    });
    bootstrap.Modal.getInstance(document.getElementById("editServiceModal")).hide();
    SS.toast("Service updated successfully.", "success");
    renderServices();
  });

  document.getElementById("confirmDeleteServiceBtn").addEventListener("click", function () {
    if (serviceIdPendingDelete !== null) {
      SS.providerServices.remove(serviceIdPendingDelete);
      bootstrap.Modal.getInstance(document.getElementById("deleteServiceModal")).hide();
      SS.toast("Service deleted.", "info");
      renderServices();
      serviceIdPendingDelete = null;
    }
  });
});
