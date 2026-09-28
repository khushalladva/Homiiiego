// booking-success.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  const bookingId = sessionStorage.getItem("lastBookingId");
  const booking = bookingId ? SS.booking.getById(bookingId) : null;
  const card = document.getElementById("successCard");

  if (!booking) {
    card.innerHTML = SS.emptyStateHTML("bi-info-circle", "No recent booking found", "It looks like you haven't just completed a booking. Browse services to book one.", "Browse Services", "user/browse-services.html");
    return;
  }

  card.innerHTML =
    '<div class="state-icon mx-auto mb-3" style="width:84px;height:84px;font-size:2.4rem; background:var(--success-light); color:var(--success);"><i class="bi bi-check-lg"></i></div>' +
    '<h3 class="mb-1">Booking Request Submitted!</h3>' +
    '<p class="text-muted-2 mb-4">We\'ve notified the provider. You\'ll be updated once it\'s approved.</p>' +
    '<div class="text-start card-surface p-3 mb-4">' +
      '<div class="summary-row"><span class="lbl">Booking ID</span><span class="val">#' + booking.id + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Service</span><span class="val">' + SS.escapeHTML(booking.serviceName) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Date</span><span class="val">' + SS.formatDate(booking.date) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Time</span><span class="val">' + booking.time + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Address</span><span class="val">' + SS.escapeHTML(booking.address) + ', ' + SS.escapeHTML(booking.city) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Price</span><span class="val">₹' + booking.price + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Status</span><span class="val">' + SS.booking.statusBadgeHTML(booking.status) + '</span></div>' +
    '</div>' +
    '<div class="d-flex gap-2 justify-content-center flex-wrap">' +
      '<a href="user/booking-details.html?id=' + booking.id + '" class="btn btn-primary">View My Booking</a>' +
      '<a href="user/browse-services.html" class="btn btn-light-2">Browse More Services</a>' +
    '</div>';
});
