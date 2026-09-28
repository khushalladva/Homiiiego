// admin/reports.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("reports", "Reports", "");
  if (!SS.currentAdmin()) return;

  const stats = SS.adminStats();
  document.getElementById("repTotal").textContent = stats.totalBookings;
  document.getElementById("repCompleted").textContent = stats.completedBookings;
  document.getElementById("repCancelled").textContent = stats.cancelledBookings;
  const rate = stats.totalBookings ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0;
  document.getElementById("repCompletionRate").textContent = rate + "%";

  Chart.defaults.font.family = "Inter, sans-serif";
  Chart.defaults.color = "#64748B";
  const gridColor = "rgba(100,116,139,0.12)";

  new Chart(document.getElementById("topServicesChart"), {
    type: "bar",
    data: {
      labels: stats.serviceDemand.map(s => s.name.length > 20 ? s.name.slice(0, 18) + "…" : s.name),
      datasets: [{ data: stats.serviceDemand.map(s => s.count), backgroundColor: "#2563EB", borderRadius: 6, maxBarThickness: 30 }]
    },
    options: { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: gridColor }, ticks: { precision: 0 } }, y: { grid: { display: false } } } }
  });

  new Chart(document.getElementById("topCategoriesChart"), {
    type: "pie",
    data: {
      labels: stats.categoryDemand.map(c => c.name),
      datasets: [{ data: stats.categoryDemand.map(c => c.count), backgroundColor: ["#2563EB", "#16A34A", "#F59E0B", "#0284C7", "#DC2626", "#7C3AED"] }]
    },
    options: { plugins: { legend: { position: "bottom", labels: { boxWidth: 10, padding: 12 } } } }
  });

  document.getElementById("performanceBody").innerHTML = stats.providerPerformance.map(p =>
    '<tr>' +
      '<td data-label="Provider">' + SS.escapeHTML(p.name) + '</td>' +
      '<td data-label="Completed Bookings">' + p.completed + '</td>' +
      '<td data-label="Rating"><span class="stars" style="color:var(--warning)">' + SS.renderStars(p.rating) + '</span> ' + p.rating.toFixed(1) + '</td>' +
    '</tr>'
  ).join("");
});
