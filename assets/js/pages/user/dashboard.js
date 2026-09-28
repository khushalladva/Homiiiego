// user/dashboard.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("dashboard", "Dashboard", "Overview of your account");
  const user = SS.currentUser();
  if (!user) return;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  document.getElementById("welcomeMsg").textContent = greeting + ", " + user.name.split(" ")[0] + " 👋";

  const stats = SS.userBookingStats(user.id);
  document.getElementById("statTotal").textContent = stats.total;
  document.getElementById("statPending").textContent = stats.pending;
  document.getElementById("statApproved").textContent = stats.approved;
  document.getElementById("statCompleted").textContent = stats.completed;

  const upcoming = stats.bookings
    .filter(b => ["pending", "approved", "inprogress"].includes(b.status))
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const upcomingBox = document.getElementById("upcomingBox");
  if (upcoming) {
    upcomingBox.innerHTML =
      '<div class="d-flex justify-content-between align-items-start mb-2"><strong style="color:var(--dark)">' + SS.escapeHTML(upcoming.serviceName) + '</strong>' + SS.booking.statusBadgeHTML(upcoming.status) + '</div>' +
      '<div class="summary-row"><span class="lbl">Date</span><span class="val">' + SS.formatDate(upcoming.date) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Time</span><span class="val">' + upcoming.time + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Provider</span><span class="val">' + SS.escapeHTML(upcoming.provider) + '</span></div>' +
      '<a href="booking-details.html?id=' + upcoming.id + '" class="btn btn-outline-primary w-100 mt-3">View Booking</a>';
  } else {
    upcomingBox.innerHTML = SS.emptyStateHTML("bi-calendar-x", "No upcoming bookings", "Book your first service and it will appear here.", "Explore Services", "browse-services.html");
  }

  document.getElementById("quickCategories").innerHTML = SS.categories.getAll().slice(0, 4).map(c =>
    '<a href="browse-services.html?category=' + encodeURIComponent(c.name) + '" class="btn btn-sm-2 btn-light-2"><i class="bi ' + c.icon + ' me-1"></i>' + SS.escapeHTML(c.name) + '</a>'
  ).join("");

  const recent = stats.bookings.slice(0, 5);
  const tbody = document.getElementById("recentBookingsBody");
  if (recent.length) {
    tbody.innerHTML = recent.map(b =>
      '<tr>' +
        '<td data-label="Booking ID">#' + b.id + '</td>' +
        '<td data-label="Service">' + SS.escapeHTML(b.serviceName) + '</td>' +
        '<td data-label="Date">' + SS.formatDate(b.date) + '</td>' +
        '<td data-label="Provider">' + SS.escapeHTML(b.provider) + '</td>' +
        '<td data-label="Price">₹' + b.price + '</td>' +
        '<td data-label="Status">' + SS.booking.statusBadgeHTML(b.status) + '</td>' +
        '<td data-label="Action"><a href="booking-details.html?id=' + b.id + '" class="btn btn-sm-2 btn-light-2">View</a></td>' +
      '</tr>'
    ).join("");
  } else {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    const emptyBox = document.getElementById("recentBookingsEmpty");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-calendar-x", "No bookings yet", "Book your first service and it will appear here.", "Explore Services", "browse-services.html");
  }
});
