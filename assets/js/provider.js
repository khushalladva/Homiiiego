/* =========================================================
   Homiiiego — provider.js
   Everything specific to the Provider side: simulated auth,
   dashboard chrome (sidebar/topbar), and helpers for a
   provider's own services and bookings.
   ========================================================= */

SS.providerAuth = {
  login(email, password) {
    const providers = SS.data.get("smartProviders", []);
    const match = providers.find(p => p.email.toLowerCase() === String(email).toLowerCase());
    if (!match) return { ok: false, message: "No provider account found with this email address." };
    if (match.status === "blocked") return { ok: false, message: "This provider account has been blocked. Please contact support." };
    if (!SS.validate.minLen(password, 6)) return { ok: false, message: "Incorrect password. Please try again." };

    SS.data.set("smartProvider", match);
    SS.data.set("smartRole", "provider");
    return { ok: true, provider: match };
  },

  register(payload) {
    const providers = SS.data.get("smartProviders", []);
    if (providers.some(p => p.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const newProvider = {
      id: providers.length ? Math.max(...providers.map(p => p.id)) + 1 : 1,
      name: payload.name,
      business: payload.business,
      email: payload.email,
      phone: payload.phone,
      rating: 0,
      services: 0,
      status: "pending",
      joined: new Date().toISOString().slice(0, 10)
    };
    providers.push(newProvider);
    SS.data.set("smartProviders", providers);
    return { ok: true, provider: newProvider };
  }
};

SS.currentProvider = function () {
  return SS.data.get("smartProvider", null);
};

SS.requireProviderAuth = function () {
  if (!SS.currentProvider()) {
    window.location.href = SS.base + "provider/login.html";
  }
};

SS.logoutProvider = function () {
  localStorage.removeItem("smartProvider");
  localStorage.removeItem("smartRole");
  window.location.href = SS.base + "provider/login.html";
};

/* ---------- Sidebar ---------- */
SS.providerSidebarLinks = [
  { key: "dashboard", href: "dashboard.html", icon: "bi-speedometer2", label: "Dashboard" },
  { key: "services", href: "services.html", icon: "bi-briefcase", label: "My Services" },
  { key: "requests", href: "bookings.html?status=pending", icon: "bi-inbox", label: "Booking Requests" },
  { key: "upcoming", href: "bookings.html?status=approved", icon: "bi-calendar2-week", label: "Upcoming Services" },
  { key: "completed", href: "bookings.html?status=completed", icon: "bi-check2-circle", label: "Completed Services" },
  { key: "profile", href: "profile.html", icon: "bi-person", label: "Profile" },
  { key: "notifications", href: "notifications.html", icon: "bi-bell", label: "Notifications" }
];

SS.renderProviderDashboardChrome = function (activeKey, pageTitle, pageSub) {
  SS.requireProviderAuth();
  const provider = SS.currentProvider();
  if (!provider) return;

  const pendingCount = SS.booking.getAllForProvider(provider.id).filter(b => b.status === "pending").length;
  const unreadNotifs = SS.data.get("smartProviderNotifications", []).filter(n => n.providerId === provider.id && !n.read).length;

  const linksHTML = SS.providerSidebarLinks.map(l => {
    let badgeCount = 0;
    if (l.key === "requests") badgeCount = pendingCount;
    if (l.key === "notifications") badgeCount = unreadNotifs;
    const badge = badgeCount ? '<span class="badge-mini">' + badgeCount + '</span>' : "";
    return '<a href="' + l.href + '" class="side-link' + (activeKey === l.key ? " active" : "") + '"><i class="bi ' + l.icon + '"></i>' + l.label + badge + '</a>';
  }).join("");

  const sidebarMount = document.getElementById("dashSidebar");
  if (sidebarMount) {
    sidebarMount.innerHTML =
      '<aside class="dash-sidebar" id="dashSidebarEl">' +
        '<div class="side-brand"><span class="brand-icon"><i class="bi bi-tools"></i></span> Homiiiego</div>' +
        '<div class="side-section-label">Provider Menu</div>' +
        linksHTML +
        '<div class="side-section-label">Account</div>' +
        '<a href="#" class="side-link" onclick="SS.logoutProvider(); return false;"><i class="bi bi-box-arrow-right"></i>Logout</a>' +
      '</aside>' +
      '<div class="sidebar-backdrop" id="sidebarBackdrop"></div>';
  }

  const topbarMount = document.getElementById("dashTopbar");
  if (topbarMount) {
    const initials = provider.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
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
          '<span class="small text-muted-2 d-none d-md-inline">' + SS.escapeHTML(provider.business) + '</span>' +
          '<span class="avatar-circle">' + initials + '</span>' +
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

/* ---------- Provider services (their own listings) ---------- */
SS.providerServices = {
  getAll(providerId) {
    return SS.services.getAll().filter(s => s.providerId === providerId);
  },

  add(providerId, payload) {
    const services = SS.data.get("smartServices", []);
    const newService = {
      id: services.length ? Math.max(...services.map(s => s.id)) + 1 : 1,
      name: payload.name,
      category: payload.category,
      categoryId: (SS.categories.getByName(payload.category) || {}).id || null,
      providerId: providerId,
      provider: payload.providerName,
      price: Number(payload.price),
      rating: 0,
      reviews: 0,
      duration: payload.duration,
      status: payload.status || "active",
      image: payload.image || ("https://picsum.photos/seed/svc" + Date.now() + "/640/480"),
      description: payload.description,
      includes: payload.includes || [],
      process: payload.process || ["Book a slot", "Provider confirms", "Service carried out", "Job completed"]
    };
    services.push(newService);
    SS.data.set("smartServices", services);
    return newService;
  },

  update(serviceId, payload) {
    const services = SS.data.get("smartServices", []);
    const idx = services.findIndex(s => s.id === serviceId);
    if (idx === -1) return null;
    services[idx] = Object.assign({}, services[idx], payload);
    SS.data.set("smartServices", services);
    return services[idx];
  },

  remove(serviceId) {
    const services = SS.data.get("smartServices", []).filter(s => s.id !== serviceId);
    SS.data.set("smartServices", services);
  },

  toggleStatus(serviceId) {
    const services = SS.data.get("smartServices", []);
    const idx = services.findIndex(s => s.id === serviceId);
    if (idx === -1) return null;
    services[idx].status = services[idx].status === "active" ? "inactive" : "active";
    SS.data.set("smartServices", services);
    return services[idx];
  }
};

/* ---------- Provider stats ---------- */
SS.providerStats = function (providerId) {
  const bookings = SS.booking.getAllForProvider(providerId);
  return {
    totalServices: SS.providerServices.getAll(providerId).length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    completed: bookings.filter(b => b.status === "completed").length,
    bookings: bookings
  };
};
