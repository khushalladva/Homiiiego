// admin/bookings.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

function render(status) {
  let bookings = SS.data.get("smartBookings", []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status !== "all") bookings = bookings.filter(b => b.status === status);

  const tbody = document.getElementById("bookingsBody");
  const emptyBox = document.getElementById("bookingsEmpty");
  if (!bookings.length) {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-calendar-x", "No bookings found", "Bookings matching this filter will show up here.");
    return;
  }
  document.querySelector(".table-wrap-2").classList.remove("d-none");
  emptyBox.classList.add("d-none");

  tbody.innerHTML = bookings.map(b =>
    '<tr>' +
      '<td data-label="Booking ID">#' + b.id + '</td>' +
      '<td data-label="Customer">' + SS.escapeHTML(b.userName || "Customer") + '</td>' +
      '<td data-label="Service">' + SS.escapeHTML(b.serviceName) + '</td>' +
      '<td data-label="Provider">' + SS.escapeHTML(b.provider) + '</td>' +
      '<td data-label="Date">' + SS.formatDate(b.date) + '</td>' +
      '<td data-label="Price">₹' + b.price + '</td>' +
      '<td data-label="Status">' + SS.booking.statusBadgeHTML(b.status) + '</td>' +
      '<td data-label="Actions"><button class="btn btn-sm-2 btn-light-2 view-booking-btn" data-id="' + b.id + '"><i class="bi bi-eye"></i> View</button></td>' +
    '</tr>'
  ).join("");

  document.querySelectorAll(".view-booking-btn").forEach(btn => btn.addEventListener("click", () => {
    const b = SS.booking.getById(btn.dataset.id);
    document.getElementById("viewBookingBody").innerHTML =
      '<div class="summary-row"><span class="lbl">Booking ID</span><span class="val">#' + b.id + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Customer</span><span class="val">' + SS.escapeHTML(b.userName || "Customer") + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Service</span><span class="val">' + SS.escapeHTML(b.serviceName) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Provider</span><span class="val">' + SS.escapeHTML(b.provider) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Date</span><span class="val">' + SS.formatDate(b.date) + ' · ' + b.time + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Address</span><span class="val">' + SS.escapeHTML(b.address) + ', ' + SS.escapeHTML(b.city) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Status</span><span class="val">' + SS.booking.statusBadgeHTML(b.status) + '</span></div>' +
      '<div class="summary-total"><span>Price</span><span>₹' + b.price + '</span></div>';
    new bootstrap.Modal(document.getElementById("viewBookingModal")).show();
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("bookings", "Bookings", "");
  if (!SS.currentAdmin()) return;

  document.querySelectorAll("#statusTabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#statusTabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.status);
    });
  });

  render("all");
});
