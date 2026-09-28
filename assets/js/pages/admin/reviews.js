// admin/reviews.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

function statusBadge(status) {
  const map = { approved: "active", hidden: "blocked", pending: "pending" };
  return '<span class="status-badge status-' + (map[status] || "pending") + '">' + status.charAt(0).toUpperCase() + status.slice(1) + '</span>';
}

function renderReviews() {
  const reviews = SS.adminReviews.getAll();
  const tbody = document.getElementById("reviewsBody");
  const emptyBox = document.getElementById("reviewsEmpty");

  if (!reviews.length) {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-star", "No reviews yet", "Customer reviews will show up here once submitted.");
    return;
  }
  document.querySelector(".table-wrap-2").classList.remove("d-none");
  emptyBox.classList.add("d-none");

  tbody.innerHTML = reviews.map(r =>
    '<tr>' +
      '<td data-label="Customer">' + SS.escapeHTML(r.userName) + '</td>' +
      '<td data-label="Service">' + SS.escapeHTML(r.serviceName) + '</td>' +
      '<td data-label="Rating"><span class="stars" style="color:var(--warning)">' + SS.renderStars(r.rating) + '</span></td>' +
      '<td data-label="Review" style="max-width:260px;">' + SS.escapeHTML(r.text.length > 90 ? r.text.slice(0, 88) + "…" : r.text) + '</td>' +
      '<td data-label="Date">' + SS.formatDate(r.date) + '</td>' +
      '<td data-label="Status">' + statusBadge(r.status) + '</td>' +
      '<td data-label="Actions">' +
        '<div class="d-flex gap-1">' +
          (r.status !== "approved" ? '<button class="btn btn-sm-2 btn-primary approve-rev-btn" data-id="' + r.id + '">Approve</button>' : '<button class="btn btn-sm-2 btn-light-2 hide-rev-btn" data-id="' + r.id + '">Hide</button>') +
          '<button class="btn btn-sm-2 btn-outline-danger delete-rev-btn" data-id="' + r.id + '"><i class="bi bi-trash"></i></button>' +
        '</div>' +
      '</td>' +
    '</tr>'
  ).join("");

  document.querySelectorAll(".approve-rev-btn").forEach(btn => btn.addEventListener("click", () => {
    SS.adminReviews.setStatus(Number(btn.dataset.id), "approved");
    SS.toast("Review approved.", "success");
    renderReviews();
  }));
  document.querySelectorAll(".hide-rev-btn").forEach(btn => btn.addEventListener("click", () => {
    SS.adminReviews.setStatus(Number(btn.dataset.id), "hidden");
    SS.toast("Review hidden.", "info");
    renderReviews();
  }));
  document.querySelectorAll(".delete-rev-btn").forEach(btn => btn.addEventListener("click", () => {
    if (confirm("Delete this review permanently?")) {
      SS.adminReviews.remove(Number(btn.dataset.id));
      SS.toast("Review deleted.", "info");
      renderReviews();
    }
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("reviews", "Reviews", "");
  if (!SS.currentAdmin()) return;
  renderReviews();
});
