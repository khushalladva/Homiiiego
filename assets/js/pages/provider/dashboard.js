// provider/dashboard.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("dashboard", "Dashboard", "Overview of your business");
  const provider = SS.currentProvider();
  if (!provider) return;

  document.getElementById("welcomeMsg").textContent = "Welcome back, " + provider.name.split(" ")[0] + " 👋";

  const stats = SS.providerStats(provider.id);
  document.getElementById("statServices").textContent = stats.totalServices;
  document.getElementById("statPending").textContent = stats.pending;
  document.getElementById("statApproved").textContent = stats.approved;
  document.getElementById("statCompleted").textContent = stats.completed;

  const pending = stats.bookings.filter(b => b.status === "pending").sort((a, b) => new Date(a.date) - new Date(b.date));
  const tbody = document.getElementById("requestsBody");

  if (pending.length) {
    tbody.innerHTML = pending.map(b =>
      '<tr>' +
        '<td data-label="Customer">' + SS.escapeHTML(b.userName || "Customer") + '</td>' +
        '<td data-label="Service">' + SS.escapeHTML(b.serviceName) + '</td>' +
        '<td data-label="Date">' + SS.formatDate(b.date) + '</td>' +
        '<td data-label="Time">' + b.time + '</td>' +
        '<td data-label="Price">₹' + b.price + '</td>' +
        '<td data-label="Action"><a href="booking-details.html?id=' + b.id + '" class="btn btn-sm-2 btn-primary">Review</a></td>' +
      '</tr>'
    ).join("");
  } else {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    const emptyBox = document.getElementById("requestsEmpty");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-inbox", "No new requests", "New booking requests from customers will show up here.");
  }
});
