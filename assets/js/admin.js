/* =========================================================
   Homiiiego — admin.js
   Everything specific to the Admin side: simulated auth
   (a single hardcoded account — there's no admin sign-up
   flow in a real product either), dashboard chrome, and
   CRUD helpers over the shared mock data.
   ========================================================= */

const ADMIN_CREDENTIALS = { email: "admin@homiiiego.test", password: "admin123" };

SS.adminAuth = {
  login(email, password) {
    if (String(email).toLowerCase() !== ADMIN_CREDENTIALS.email) {
      return { ok: false, message: "No admin account found with this email address." };
    }
    if (password !== ADMIN_CREDENTIALS.password) {
      return { ok: false, message: "Incorrect password. Please try again." };
    }
    SS.data.set("smartAdmin", { name: "Admin", email: ADMIN_CREDENTIALS.email });
    SS.data.set("smartRole", "admin");
    return { ok: true };
  }
};

SS.currentAdmin = function () {
  return SS.data.get("smartAdmin", null);
};

SS.requireAdminAuth = function () {
  if (!SS.currentAdmin()) {
    window.location.href = SS.base + "admin/login.html";
  }
};

SS.logoutAdmin = function () {
  localStorage.removeItem("smartAdmin");
  localStorage.removeItem("smartRole");
  window.location.href = SS.base + "admin/login.html";
};

/* ---------- Sidebar ---------- */
SS.adminSidebarLinks = [
  { key: "dashboard", href: "dashboard.html", icon: "bi-speedometer2", label: "Dashboard" },
  { key: "users", href: "users.html", icon: "bi-people", label: "Users" },
  { key: "providers", href: "providers.html", icon: "bi-briefcase", label: "Providers" },
  { key: "categories", href: "categories.html", icon: "bi-grid", label: "Categories" },
  { key: "services", href: "services.html", icon: "bi-tools", label: "Services" },
  { key: "bookings", href: "bookings.html", icon: "bi-calendar2-check", label: "Bookings" },
  { key: "reviews", href: "reviews.html", icon: "bi-star", label: "Reviews" },
  { key: "notifications", href: "notifications.html", icon: "bi-bell", label: "Notifications" },
  { key: "reports", href: "reports.html", icon: "bi-graph-up", label: "Reports" },
  { key: "settings", href: "settings.html", icon: "bi-gear", label: "Settings" }
];

SS.renderAdminDashboardChrome = function (activeKey, pageTitle, pageSub) {
  SS.requireAdminAuth();
  const admin = SS.currentAdmin();
  if (!admin) return;

  const pendingBookings = SS.data.get("smartBookings", []).filter(b => b.status === "pending").length;
  const pendingProviders = SS.data.get("smartProviders", []).filter(p => p.status === "pending").length;

  const linksHTML = SS.adminSidebarLinks.map(l => {
    let badgeCount = 0;
    if (l.key === "bookings") badgeCount = pendingBookings;
    if (l.key === "providers") badgeCount = pendingProviders;
    const badge = badgeCount ? '<span class="badge-mini">' + badgeCount + '</span>' : "";
    return '<a href="' + l.href + '" class="side-link' + (activeKey === l.key ? " active" : "") + '"><i class="bi ' + l.icon + '"></i>' + l.label + badge + '</a>';
  }).join("");

  const sidebarMount = document.getElementById("dashSidebar");
  if (sidebarMount) {
    sidebarMount.innerHTML =
      '<aside class="dash-sidebar admin-dark" id="dashSidebarEl">' +
        '<div class="side-brand"><span class="brand-icon"><i class="bi bi-shield-lock"></i></span> Homiiiego <span class="text-muted-2" style="font-size:0.7rem; font-weight:600;">ADMIN</span></div>' +
        '<div class="side-section-label">Management</div>' +
        linksHTML +
        '<div class="side-section-label">Account</div>' +
        '<a href="#" class="side-link" onclick="SS.logoutAdmin(); return false;"><i class="bi bi-box-arrow-right"></i>Logout</a>' +
      '</aside>' +
      '<div class="sidebar-backdrop" id="sidebarBackdrop"></div>';
  }

  const topbarMount = document.getElementById("dashTopbar");
  if (topbarMount) {
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
          '<span class="avatar-circle">AD</span>' +
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

/* ---------- CRUD: Users ---------- */
SS.adminUsers = {
  getAll() { return SS.data.get("smartUsers", []); },
  toggleBlock(userId) {
    const users = SS.data.get("smartUsers", []);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx].status = users[idx].status === "blocked" ? "active" : "blocked";
    SS.data.set("smartUsers", users);
    return users[idx];
  },
  update(userId, payload) {
    const users = SS.data.get("smartUsers", []);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx] = Object.assign({}, users[idx], payload);
    SS.data.set("smartUsers", users);
    return users[idx];
  },
  remove(userId) {
    SS.data.set("smartUsers", SS.data.get("smartUsers", []).filter(u => u.id !== userId));
  }
};

/* ---------- CRUD: Providers ---------- */
SS.adminProviders = {
  getAll() { return SS.data.get("smartProviders", []); },
  approve(providerId) {
    const providers = SS.data.get("smartProviders", []);
    const idx = providers.findIndex(p => p.id === providerId);
    if (idx === -1) return null;
    providers[idx].status = "active";
    SS.data.set("smartProviders", providers);
    return providers[idx];
  },
  toggleBlock(providerId) {
    const providers = SS.data.get("smartProviders", []);
    const idx = providers.findIndex(p => p.id === providerId);
    if (idx === -1) return null;
    providers[idx].status = providers[idx].status === "blocked" ? "active" : "blocked";
    SS.data.set("smartProviders", providers);
    return providers[idx];
  },
  remove(providerId) {
    SS.data.set("smartProviders", SS.data.get("smartProviders", []).filter(p => p.id !== providerId));
  }
};

/* ---------- CRUD: Categories ---------- */
SS.adminCategories = {
  getAll() { return SS.data.get("smartCategories", []); },
  add(payload) {
    const categories = SS.data.get("smartCategories", []);
    const newCat = {
      id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: payload.name,
      icon: payload.icon || "bi-grid",
      description: payload.description,
      count: 0
    };
    categories.push(newCat);
    SS.data.set("smartCategories", categories);
    return newCat;
  },
  update(catId, payload) {
    const categories = SS.data.get("smartCategories", []);
    const idx = categories.findIndex(c => c.id === catId);
    if (idx === -1) return null;
    categories[idx] = Object.assign({}, categories[idx], payload);
    SS.data.set("smartCategories", categories);
    return categories[idx];
  },
  remove(catId) {
    SS.data.set("smartCategories", SS.data.get("smartCategories", []).filter(c => c.id !== catId));
  }
};

/* ---------- CRUD: Reviews ---------- */
SS.adminReviews = {
  getAll() { return SS.data.get("smartReviews", []); },
  setStatus(reviewId, status) {
    const reviews = SS.data.get("smartReviews", []);
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx === -1) return null;
    reviews[idx].status = status;
    SS.data.set("smartReviews", reviews);
    return reviews[idx];
  },
  remove(reviewId) {
    SS.data.set("smartReviews", SS.data.get("smartReviews", []).filter(r => r.id !== reviewId));
  }
};

/* ---------- Platform-wide stats (dashboard + reports) ---------- */
SS.adminStats = function () {
  const users = SS.data.get("smartUsers", []);
  const providers = SS.data.get("smartProviders", []);
  const services = SS.data.get("smartServices", []);
  const bookings = SS.data.get("smartBookings", []);
  const categories = SS.data.get("smartCategories", []);

  const byStatus = status => bookings.filter(b => b.status === status).length;

  const categoryDemand = categories.map(c => ({
    name: c.name,
    count: bookings.filter(b => {
      const svc = services.find(s => s.id === b.serviceId);
      return svc && svc.category === c.name;
    }).length
  })).sort((a, b) => b.count - a.count);

  const serviceDemand = services.map(s => ({
    name: s.name,
    count: bookings.filter(b => b.serviceId === s.id).length
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  const providerPerformance = providers.map(p => ({
    name: p.name,
    completed: bookings.filter(b => b.providerId === p.id && b.status === "completed").length,
    rating: p.rating
  })).sort((a, b) => b.completed - a.completed);

  return {
    totalUsers: users.length,
    totalProviders: providers.length,
    totalServices: services.length,
    totalBookings: bookings.length,
    pendingBookings: byStatus("pending"),
    approvedBookings: byStatus("approved"),
    completedBookings: byStatus("completed"),
    cancelledBookings: byStatus("cancelled") + byStatus("rejected"),
    categoryDemand,
    serviceDemand,
    providerPerformance
  };
};

/* Simple count-up animation for dashboard stat numbers */
SS.animateCounter = function (el, target, duration) {
  duration = duration || 800;
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(start + (target - start) * progress);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
};
