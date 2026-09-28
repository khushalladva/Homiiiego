// user/booking-details.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("bookings", "Booking Details", "");
  const user = SS.currentUser();
  if (!user) return;

  const params = new URLSearchParams(window.location.search);
  const booking = SS.booking.getById(params.get("id"));
  const content = document.getElementById("pageContent");

  if (!booking || booking.userId !== user.id) {
    content.innerHTML = SS.emptyStateHTML("bi-exclamation-circle", "Booking not found", "This booking doesn't exist or doesn't belong to your account.", "Back to My Bookings", "my-bookings.html");
    return;
  }

  function render() {
    const steps = SS.booking.timelineSteps(booking.status);
    const canCancel = ["pending", "approved"].includes(booking.status);

    content.innerHTML =
      '<nav class="breadcrumb-2 mb-3"><a href="my-bookings.html">My Bookings</a><span class="sep">/</span><span class="current">#' + booking.id + '</span></nav>' +
      '<div class="row g-4">' +
        '<div class="col-lg-7">' +
          '<div class="card-surface p-4 mb-4">' +
            '<div class="d-flex justify-content-between align-items-start mb-3">' +
              '<div><h5 class="mb-1">' + SS.escapeHTML(booking.serviceName) + '</h5><span class="text-muted-2 small">Booking ID: #' + booking.id + '</span></div>' +
              SS.booking.statusBadgeHTML(booking.status) +
            '</div>' +
            '<div class="summary-row"><span class="lbl">Provider</span><span class="val">' + SS.escapeHTML(booking.provider) + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Date</span><span class="val">' + SS.formatDate(booking.date) + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Time</span><span class="val">' + booking.time + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Address</span><span class="val">' + SS.escapeHTML(booking.address) + ', ' + SS.escapeHTML(booking.city) + ' - ' + SS.escapeHTML(booking.pincode) + '</span></div>' +
            (booking.notes ? '<div class="summary-row"><span class="lbl">Notes</span><span class="val">' + SS.escapeHTML(booking.notes) + '</span></div>' : "") +
            '<div class="summary-total"><span>Price</span><span>₹' + booking.price + '</span></div>' +
            (canCancel ? '<button class="btn btn-outline-danger w-100 mt-3" id="cancelBookingBtn" data-bs-toggle="modal" data-bs-target="#cancelModal"><i class="bi bi-x-circle me-1"></i>Cancel Booking</button>' : "") +
            (booking.status === "completed" ? '<a href="reviews.html" class="btn btn-primary w-100 mt-3"><i class="bi bi-star me-1"></i>Write a Review</a>' : "") +
          '</div>' +
        '</div>' +
        '<div class="col-lg-5">' +
          '<div class="card-surface p-4">' +
            '<h6 class="mb-3">Status Timeline</h6>' +
            '<ul class="status-timeline">' + steps.map(s =>
              '<li class="' + s.state + '"><span class="t-dot"><i class="bi ' + (s.state === "done" ? "bi-check-lg" : s.state === "current" ? "bi-arrow-repeat" : "bi-circle") + '"></i></span><div><div class="t-title">' + s.label + '</div><div class="t-sub">' + s.sub + '</div></div></li>'
            ).join("") + '</ul>' +
          '</div>' +
        '</div>' +
      '</div>';

    const cancelBtn = document.getElementById("cancelBookingBtn");
    if (cancelBtn) {
      document.getElementById("confirmCancelBtn").onclick = function () {
        const bookings = SS.data.get("smartBookings", []);
        const idx = bookings.findIndex(b => b.id === booking.id);
        if (idx > -1) {
          bookings[idx].status = "cancelled";
          SS.data.set("smartBookings", bookings);
          booking.status = "cancelled";
        }
        bootstrap.Modal.getInstance(document.getElementById("cancelModal")).hide();
        SS.toast("Booking cancelled successfully.", "info");
        render();
      };
    }
  }

  render();
});
