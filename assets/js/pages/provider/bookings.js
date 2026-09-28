// provider/bookings.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let providerId;

function actionButtonsFor(b) {
  if (b.status === "pending") {
    return '<div class="d-flex gap-1">' +
      '<button class="btn btn-sm-2 btn-primary status-btn" data-id="' + b.id + '" data-status="approved">Approve</button>' +
      '<button class="btn btn-sm-2 btn-outline-danger status-btn" data-id="' + b.id + '" data-status="rejected">Reject</button>' +
    '</div>';
  }
  if (b.status === "approved") {
    return '<button class="btn btn-sm-2 btn-primary status-btn" data-id="' + b.id + '" data-status="inprogress">Start Job</button>';
  }
  if (b.status === "inprogress") {
    return '<button class="btn btn-sm-2 btn-primary status-btn" data-id="' + b.id + '" data-status="completed">Mark Completed</button>';
  }
  return '<a href="booking-details.html?id=' + b.id + '" class="btn btn-sm-2 btn-light-2">View</a>';
}

function render(status) {
  let bookings = SS.booking.getAllForProvider(providerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status !== "all") {
    bookings = status === "cancelled"
      ? bookings.filter(b => b.status === "cancelled" || b.status === "rejected")
      : bookings.filter(b => b.status === status);
  }

  const tbody = document.getElementById("bookingsBody");
  const emptyBox = document.getElementById("bookingsEmpty");
  if (!bookings.length) {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-calendar-x", "No bookings here", "Bookings matching this filter will show up here.");
    return;
  }
  document.querySelector(".table-wrap-2").classList.remove("d-none");
  emptyBox.classList.add("d-none");

  tbody.innerHTML = bookings.map(b =>
    '<tr>' +
      '<td data-label="Customer">' + SS.escapeHTML(b.userName || "Customer") + '</td>' +
      '<td data-label="Service">' + SS.escapeHTML(b.serviceName) + '</td>' +
      '<td data-label="Date">' + SS.formatDate(b.date) + ' · ' + b.time + '</td>' +
      '<td data-label="Address">' + SS.escapeHTML(b.city) + '</td>' +
      '<td data-label="Price">₹' + b.price + '</td>' +
      '<td data-label="Status">' + SS.booking.statusBadgeHTML(b.status) + '</td>' +
      '<td data-label="Action">' + actionButtonsFor(b) + '</td>' +
    '</tr>'
  ).join("");

  document.querySelectorAll(".status-btn").forEach(btn => btn.addEventListener("click", () => {
    SS.booking.updateStatus(btn.dataset.id, btn.dataset.status);
    SS.toast("Booking updated.", "success");
    render(document.querySelector("#statusTabs .tab-btn.active").dataset.status);
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("requests", "Bookings", "");
  const provider = SS.currentProvider();
  if (!provider) return;
  providerId = provider.id;

  document.querySelectorAll("#statusTabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#statusTabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.status);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const initialStatus = params.get("status") || "all";
  const initialTab = document.querySelector('#statusTabs .tab-btn[data-status="' + initialStatus + '"]') || document.querySelector('#statusTabs .tab-btn[data-status="all"]');
  initialTab.classList.add("active");
  render(initialTab.dataset.status);
});
