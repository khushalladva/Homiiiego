// user/my-bookings.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("bookings", "My Bookings", "All your service requests in one place");
  const user = SS.currentUser();
  if (!user) return;

  function render(status) {
    let bookings = SS.booking.getAllForUser(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (status !== "all") bookings = bookings.filter(b => b.status === status);

    const tbody = document.getElementById("bookingsBody");
    const emptyBox = document.getElementById("bookingsEmpty");
    if (!bookings.length) {
      document.querySelector(".table-wrap-2").classList.add("d-none");
      emptyBox.classList.remove("d-none");
      emptyBox.innerHTML = SS.emptyStateHTML("bi-calendar-x", "No bookings yet", "Book your first service and it will appear here.", "Explore Services", "browse-services.html");
      return;
    }
    document.querySelector(".table-wrap-2").classList.remove("d-none");
    emptyBox.classList.add("d-none");
    tbody.innerHTML = bookings.map(b =>
      '<tr>' +
        '<td data-label="Booking ID">#' + b.id + '</td>' +
        '<td data-label="Service">' + SS.escapeHTML(b.serviceName) + '</td>' +
        '<td data-label="Date">' + SS.formatDate(b.date) + '</td>' +
        '<td data-label="Time">' + b.time + '</td>' +
        '<td data-label="Provider">' + SS.escapeHTML(b.provider) + '</td>' +
        '<td data-label="Price">₹' + b.price + '</td>' +
        '<td data-label="Status">' + SS.booking.statusBadgeHTML(b.status) + '</td>' +
        '<td data-label="Action"><a href="booking-details.html?id=' + b.id + '" class="btn btn-sm-2 btn-light-2">View</a></td>' +
      '</tr>'
    ).join("");
  }

  document.querySelectorAll("#statusTabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#statusTabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.status);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const initialStatus = params.get("status") || "all";
  const initialTab = document.querySelector('#statusTabs .tab-btn[data-status="' + initialStatus + '"]');
  if (initialTab) { document.querySelectorAll("#statusTabs .tab-btn").forEach(b => b.classList.remove("active")); initialTab.classList.add("active"); }
  render(initialStatus);
});
