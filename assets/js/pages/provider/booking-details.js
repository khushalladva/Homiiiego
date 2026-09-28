// provider/booking-details.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("requests", "Booking Details", "");
  const provider = SS.currentProvider();
  if (!provider) return;

  const params = new URLSearchParams(window.location.search);
  const booking = SS.booking.getById(params.get("id"));
  const content = document.getElementById("pageContent");

  if (!booking || booking.providerId !== provider.id) {
    content.innerHTML = SS.emptyStateHTML("bi-exclamation-circle", "Booking not found", "This booking doesn't exist or isn't assigned to your account.", "Back to Bookings", "bookings.html");
    return;
  }

  function actionsHTML() {
    if (booking.status === "pending") {
      return '<button class="btn btn-primary w-100 mb-2" id="approveBtn"><i class="bi bi-check-lg me-1"></i>Approve Booking</button>' +
             '<button class="btn btn-outline-danger w-100" id="rejectBtn"><i class="bi bi-x-lg me-1"></i>Reject Booking</button>';
    }
    if (booking.status === "approved") {
      return '<button class="btn btn-primary w-100" id="startBtn"><i class="bi bi-play-fill me-1"></i>Start Job (Mark In Progress)</button>';
    }
    if (booking.status === "inprogress") {
      return '<button class="btn btn-primary w-100" id="completeBtn"><i class="bi bi-check2-circle me-1"></i>Mark Completed</button>';
    }
    return "";
  }

  function render() {
    const steps = SS.booking.timelineSteps(booking.status);
    content.innerHTML =
      '<nav class="breadcrumb-2 mb-3"><a href="bookings.html">Bookings</a><span class="sep">/</span><span class="current">#' + booking.id + '</span></nav>' +
      '<div class="row g-4">' +
        '<div class="col-lg-7">' +
          '<div class="card-surface p-4 mb-4">' +
            '<div class="d-flex justify-content-between align-items-start mb-3">' +
              '<div><h5 class="mb-1">' + SS.escapeHTML(booking.serviceName) + '</h5><span class="text-muted-2 small">Booking ID: #' + booking.id + '</span></div>' +
              SS.booking.statusBadgeHTML(booking.status) +
            '</div>' +
            '<div class="summary-row"><span class="lbl">Customer</span><span class="val">' + SS.escapeHTML(booking.userName || "Customer") + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Date</span><span class="val">' + SS.formatDate(booking.date) + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Time</span><span class="val">' + booking.time + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Address</span><span class="val">' + SS.escapeHTML(booking.address) + ', ' + SS.escapeHTML(booking.city) + ' - ' + SS.escapeHTML(booking.pincode) + '</span></div>' +
            (booking.notes ? '<div class="summary-row"><span class="lbl">Customer Notes</span><span class="val">' + SS.escapeHTML(booking.notes) + '</span></div>' : "") +
            '<div class="summary-total"><span>Price</span><span>₹' + booking.price + '</span></div>' +
            '<div class="mt-3">' + actionsHTML() + '</div>' +
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

    const bind = (id, status, msg) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", () => {
        SS.booking.updateStatus(booking.id, status);
        booking.status = status;
        SS.toast(msg, "success");
        render();
      });
    };
    bind("approveBtn", "approved", "Booking approved.");
    bind("rejectBtn", "rejected", "Booking rejected.");
    bind("startBtn", "inprogress", "Job marked in progress.");
    bind("completeBtn", "completed", "Booking marked as completed.");
  }

  render();
});
