// admin/dashboard.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("dashboard", "Dashboard", "Platform overview");
  if (!SS.currentAdmin()) return;

  const stats = SS.adminStats();
  SS.animateCounter(document.getElementById("statUsers"), stats.totalUsers);
  SS.animateCounter(document.getElementById("statProviders"), stats.totalProviders);
  SS.animateCounter(document.getElementById("statServices"), stats.totalServices);
  SS.animateCounter(document.getElementById("statBookings"), stats.totalBookings);
  SS.animateCounter(document.getElementById("statPending"), stats.pendingBookings);
  SS.animateCounter(document.getElementById("statCompleted"), stats.completedBookings);

  const gridColor = "rgba(100,116,139,0.12)";
  Chart.defaults.font.family = "Inter, sans-serif";
  Chart.defaults.color = "#64748B";

  // Bookings overview — grouped by month
  const bookings = SS.data.get("smartBookings", []);
  const monthBuckets = {};
  bookings.forEach(b => {
    const d = new Date(b.createdAt);
    const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    monthBuckets[label] = (monthBuckets[label] || 0) + 1;
  });
  new Chart(document.getElementById("bookingsChart"), {
    type: "line",
    data: {
      labels: Object.keys(monthBuckets),
      datasets: [{
        label: "Bookings",
        data: Object.values(monthBuckets),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#2563EB"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: gridColor } }, x: { grid: { display: false } } }
    }
  });

  // Booking status doughnut
  new Chart(document.getElementById("statusChart"), {
    type: "doughnut",
    data: {
      labels: ["Pending", "Approved", "Completed", "Cancelled/Rejected"],
      datasets: [{
        data: [stats.pendingBookings, stats.approvedBookings, stats.completedBookings, stats.cancelledBookings],
        backgroundColor: ["#F59E0B", "#0284C7", "#16A34A", "#DC2626"],
        borderWidth: 0
      }]
    },
    options: { plugins: { legend: { position: "bottom", labels: { boxWidth: 10, padding: 14 } } }, cutout: "65%" }
  });

  // Popular categories
  new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels: stats.categoryDemand.map(c => c.name),
      datasets: [{ data: stats.categoryDemand.map(c => c.count), backgroundColor: "#2563EB", borderRadius: 6, maxBarThickness: 34 }]
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, grid: { color: gridColor }, ticks: { precision: 0 } }, y: { grid: { display: false } } }
    }
  });

  // Service demand
  new Chart(document.getElementById("serviceDemandChart"), {
    type: "bar",
    data: {
      labels: stats.serviceDemand.map(s => s.name.length > 22 ? s.name.slice(0, 20) + "…" : s.name),
      datasets: [{ data: stats.serviceDemand.map(s => s.count), backgroundColor: "#16A34A", borderRadius: 6, maxBarThickness: 34 }]
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, grid: { color: gridColor }, ticks: { precision: 0 } }, y: { grid: { display: false } } }
    }
  });
});
