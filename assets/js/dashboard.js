/* =========================================================
   Homiiiego — dashboard.js
   Shared user-dashboard chrome: sidebar, topbar, mobile
   toggle. Provider/Admin dashboards reuse the same
   .dash-wrap / .dash-sidebar / .dash-main structure.
   ========================================================= */

SS.userSidebarLinks = [
  { key: "dashboard", href: "dashboard.html", icon: "bi-speedometer2", label: "Dashboard" },
  { key: "browse", href: "browse-services.html", icon: "bi-search", label: "Browse Services" },
  { key: "bookings", href: "my-bookings.html", icon: "bi-calendar-check", label: "My Bookings" },
  { key: "reviews", href: "reviews.html", icon: "bi-star", label: "Reviews" },
  { key: "notifications", href: "notifications.html", icon: "bi-bell", label: "Notifications" },
  { key: "profile", href: "profile.html", icon: "bi-person", label: "Profile" },
  { key: "password", href: "change-password.html", icon: "bi-shield-lock", label: "Change Password" }
];

SS.renderUserDashboardChrome = function (activeKey, pageTitle, pageSub) {
  SS.requireAuth("login.html");
  const user = SS.currentUser();
  if (!user) return;

  const notifCount = SS.data.get("smartNotifications", []).filter(n => n.userId === user.id && !n.read).length;

  const linksHTML = SS.userSidebarLinks.map(l => {
    const badge = l.key === "notifications" && notifCount ? '<span class="badge-mini">' + notifCount + '</span>' : "";
    return '<a href="' + l.href + '" class="side-link' + (activeKey === l.key ? " active" : "") + '"><i class="bi ' + l.icon + '"></i>' + l.label + badge + '</a>';
  }).join("");

  const sidebarMount = document.getElementById("dashSidebar");
  if (sidebarMount) {
    sidebarMount.innerHTML =
      '<aside class="dash-sidebar" id="dashSidebarEl">' +
        '<div class="side-brand"><span class="brand-icon"><i class="bi bi-tools"></i></span> Homiiiego</div>' +
        '<div class="side-section-label">Menu</div>' +
        linksHTML +
        '<div class="side-section-label">Account</div>' +
        '<a href="#" class="side-link" onclick="SS.logout(); return false;"><i class="bi bi-box-arrow-right"></i>Logout</a>' +
      '</aside>' +
      '<div class="sidebar-backdrop" id="sidebarBackdrop"></div>';
  }

  const topbarMount = document.getElementById("dashTopbar");
  if (topbarMount) {
    const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    topbarMount.innerHTML =
      '<div class="dash-topbar">' +
        '<div class="d-flex align-items-center gap-3">' +
          '<button class="sidebar-toggle" id="sidebarToggleBtn"><i class="bi bi-list"></i></button>' +
          '<div>' +
            '<div class="fw-display fw-bold" style="color:var(--dark)">' + SS.escapeHTML(pageTitle || "Dashboard") + '</div>' +
            (pageSub ? '<div class="dash-page-sub" style="font-size:0.82rem;">' + SS.escapeHTML(pageSub) + '</div>' : "") +
          '</div>' +
        '</div>' +
        '<div class="d-flex align-items-center gap-2">' +
          '<button class="theme-switch" onclick="SS.toggleTheme()"><span class="knob"><i class="bi bi-sun"></i></span></button>' +
          '<a href="notifications.html" class="nav-icon-btn"><i class="bi bi-bell"></i>' + (notifCount ? '<span class="dot"></span>' : "") + '</a>' +
          '<a href="../index.html" class="avatar-circle text-decoration-none">' + initials + '</a>' +
        '</div>' +
      '</div>';
  }

  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const sideEl = document.getElementById("dashSidebarEl");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (toggleBtn && sideEl && backdrop) {
    toggleBtn.addEventListener("click", () => { sideEl.classList.add("open"); backdrop.classList.add("show"); });
    backdrop.addEventListener("click", () => { sideEl.classList.remove("open"); backdrop.classList.remove("show"); });
  }

  SS.applyTheme();
};

/* ---------- Booking stats for a user ---------- */
SS.userBookingStats = function (userId) {
  const bookings = SS.booking.getAllForUser(userId);
  return {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    completed: bookings.filter(b => b.status === "completed").length,
    bookings: bookings
  };
};
