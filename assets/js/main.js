/* =========================================================
   Homiiiego — main.js
   Global helpers: navbar/footer injection, dark mode,
   toasts, back-to-top, data access layer.
   Structured so a real backend can later replace SS.data.*
   with fetch() calls without touching page scripts.
   ========================================================= */

const SS = {};

/* ---------- Base path detection (root vs /user /provider /admin) ---------- */
SS.base = (function () {
  const p = window.location.pathname;
  if (p.includes("/user/") || p.includes("/provider/") || p.includes("/admin/")) return "../";
  return "";
})();

/* ---------- Generic localStorage data layer ---------- */
SS.data = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (fallback !== undefined ? fallback : null);
    } catch (e) {
      console.error("SS.data.get error for " + key, e);
      return fallback !== undefined ? fallback : null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("SS.data.set error for " + key, e);
      return false;
    }
  }
};

SS.currentUser = function () {
  return SS.data.get("smartUser", null);
};

SS.isLoggedIn = function () {
  return !!SS.currentUser();
};

SS.requireAuth = function (loginPathFromRoot) {
  if (!SS.isLoggedIn()) {
    window.location.href = SS.base + (loginPathFromRoot || "login.html");
  }
};

SS.logout = function () {
  localStorage.removeItem("smartUser");
  localStorage.removeItem("smartRole");
  window.location.href = SS.base + "index.html";
};

/* Simple text sanitiser for anything derived from user input before innerHTML use */
SS.escapeHTML = function (str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

SS.formatDate = function (isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

SS.timeAgo = function (isoString) {
  const then = new Date(isoString).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + "d ago";
  return SS.formatDate(isoString);
};

/* ---------- Toasts ---------- */
SS.toast = function (message, type) {
  type = type || "success";
  const icons = { success: "bi-check-circle-fill", warning: "bi-exclamation-triangle-fill", danger: "bi-x-circle-fill", info: "bi-info-circle-fill" };
  const colors = { success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)", info: "var(--info)" };

  let container = document.getElementById("ssToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "ssToastContainer";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(container);
  }

  const el = document.createElement("div");
  el.className = "toast align-items-center border-0 shadow-soft";
  el.style.background = "var(--white)";
  el.setAttribute("role", "alert");
  el.innerHTML =
    '<div class="d-flex">' +
      '<div class="toast-body d-flex align-items-center gap-2" style="color: var(--dark);">' +
        '<i class="bi ' + icons[type] + '" style="color:' + colors[type] + '; font-size:1.1rem;"></i>' +
        '<span>' + SS.escapeHTML(message) + '</span>' +
      '</div>' +
      '<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
    '</div>';
  container.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: 3500 });
  toast.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
};

/* ---------- Theme (dark mode) ---------- */
SS.applyTheme = function () {
  const theme = SS.data.get("smartTheme", "light");
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-switch .knob i").forEach(icn => {
    icn.className = theme === "dark" ? "bi bi-moon-stars" : "bi bi-sun";
  });
};

SS.toggleTheme = function () {
  const current = SS.data.get("smartTheme", "light");
  const next = current === "dark" ? "light" : "dark";
  SS.data.set("smartTheme", next);
  SS.applyTheme();
};

/* ---------- Navbar ---------- */
SS.renderNavbar = function (activePage) {
  const mount = document.getElementById("ssNavbar");
  if (!mount) return;
  const base = SS.base;
  const user = SS.currentUser();

  const navLinks = [
    { key: "home", href: "index.html", label: "Home" },
    // Once someone is logged in, the main "Services" tab takes them to
    // their personalized browsing page (recommended picks, saved items,
    // quick rebooking) instead of the plain public catalog.
    { key: "services", href: user ? "user/browse-services.html" : "services.html", label: "Services" },
    { key: "categories", href: "categories.html", label: "Categories" },
    { key: "how", href: "index.html#how-it-works", label: "How It Works" },
    { key: "about", href: "about.html", label: "About" },
    { key: "contact", href: "contact.html", label: "Contact" }
  ];

  const linksHTML = navLinks.map(l =>
    '<li class="nav-item"><a class="nav-link' + (activePage === l.key ? " active" : "") + '" href="' + base + l.href + '">' + l.label + "</a></li>"
  ).join("");

  let rightHTML;
  if (user) {
    const initials = user.name ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "U";
    const notifs = SS.data.get("smartNotifications", []).filter(n => n.userId === user.id && !n.read);
    rightHTML =
      '<div class="d-flex align-items-center gap-2">' +
        '<button class="theme-switch me-1" onclick="SS.toggleTheme()" title="Toggle dark mode"><span class="knob"><i class="bi bi-sun"></i></span></button>' +
        '<a href="' + base + 'user/notifications.html" class="nav-icon-btn" title="Notifications">' +
          '<i class="bi bi-bell"></i>' + (notifs.length ? '<span class="dot"></span>' : "") +
        '</a>' +
        '<div class="dropdown">' +
          '<button class="btn d-flex align-items-center gap-2 p-0 border-0 bg-transparent" data-bs-toggle="dropdown">' +
            '<span class="avatar-circle">' + initials + '</span>' +
          '</button>' +
          '<ul class="dropdown-menu dropdown-menu-end shadow-soft border-0 mt-2">' +
            '<li><h6 class="dropdown-header">' + SS.escapeHTML(user.name) + '</h6></li>' +
            '<li><a class="dropdown-item" href="' + base + 'user/dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a></li>' +
            '<li><a class="dropdown-item" href="' + base + 'user/profile.html"><i class="bi bi-person me-2"></i>Profile</a></li>' +
            '<li><a class="dropdown-item" href="' + base + 'user/notifications.html"><i class="bi bi-bell me-2"></i>Notifications</a></li>' +
            '<li><hr class="dropdown-divider"></li>' +
            '<li><a class="dropdown-item text-danger" href="#" onclick="SS.logout(); return false;"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>';
  } else {
    rightHTML =
      '<div class="d-flex align-items-center gap-2">' +
        '<button class="theme-switch me-1" onclick="SS.toggleTheme()" title="Toggle dark mode"><span class="knob"><i class="bi bi-sun"></i></span></button>' +
        '<a href="' + base + 'login.html" class="btn btn-light-2 btn-sm-2">Login</a>' +
        '<a href="' + base + 'register.html" class="btn btn-primary btn-sm-2">Register</a>' +
      '</div>';
  }

  mount.innerHTML =
    '<nav class="navbar navbar-expand-lg ss-navbar" id="ssNavbarEl">' +
      '<div class="container">' +
        '<a class="navbar-brand" href="' + base + 'index.html">' +
          '<span class="brand-icon"><i class="bi bi-tools"></i></span> Homiiiego' +
        '</a>' +
        '<button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#ssNavCollapse">' +
          '<i class="bi bi-list fs-2"></i>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="ssNavCollapse">' +
          '<ul class="navbar-nav mx-auto">' + linksHTML + '</ul>' +
          '<div class="d-flex mt-3 mt-lg-0">' + rightHTML + '</div>' +
        '</div>' +
      '</div>' +
    '</nav>';

  const navEl = document.getElementById("ssNavbarEl");
  window.addEventListener("scroll", () => {
    navEl.classList.toggle("is-scrolled", window.scrollY > 8);
  });
  SS.applyTheme();
};

/* ---------- Footer ---------- */
SS.renderFooter = function () {
  const mount = document.getElementById("ssFooter");
  if (!mount) return;
  const base = SS.base;
  const year = new Date().getFullYear();

  mount.innerHTML =
    '<footer class="ss-footer">' +
      '<div class="container">' +
        '<div class="row g-4">' +
          '<div class="col-lg-4 col-md-12">' +
            '<div class="brand-row"><span class="brand-icon"><i class="bi bi-tools"></i></span><span>Homiiiego</span></div>' +
            '<p class="small">A booking platform connecting you with verified professionals for home and technical services — search, book and manage it all from one place.</p>' +
            '<div class="social-row mt-3">' +
              '<a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>' +
              '<a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>' +
              '<a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
              '<a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
            '</div>' +
          '</div>' +
          '<div class="col-lg-2 col-6">' +
            '<h6>Company</h6>' +
            '<ul><li><a href="' + base + 'about.html">About</a></li><li><a href="' + base + 'services.html">Services</a></li><li><a href="' + base + 'categories.html">Categories</a></li><li><a href="' + base + 'contact.html">Contact</a></li></ul>' +
          '</div>' +
          '<div class="col-lg-2 col-6">' +
            '<h6>Customer</h6>' +
            '<ul><li><a href="' + base + 'user/dashboard.html">Dashboard</a></li><li><a href="' + base + 'user/my-bookings.html">My Bookings</a></li><li><a href="' + base + 'user/profile.html">Profile</a></li><li><a href="' + base + 'user/reviews.html">Reviews</a></li></ul>' +
          '</div>' +
          '<div class="col-lg-2 col-6">' +
            '<h6>Provider</h6>' +
            '<ul><li><a href="' + base + 'provider/register.html">Become a Provider</a></li><li><a href="' + base + 'provider/login.html">Provider Login</a></li></ul>' +
          '</div>' +
          '<div class="col-lg-2 col-6">' +
            '<h6>Support</h6>' +
            '<ul><li><a href="' + base + 'contact.html">Help Center</a></li><li><a href="' + base + 'contact.html">Contact</a></li><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul>' +
          '</div>' +
        '</div>' +
        '<hr>' +
        '<div class="d-flex flex-column flex-md-row justify-content-between align-items-center bottom-row gap-2">' +
          '<span>&copy; ' + year + ' Homiiiego. All rights reserved.</span>' +
          '<span>Built as a frontend demo — no real payments or data are processed.</span>' +
        '</div>' +
      '</div>' +
    '</footer>';
};

/* ---------- Back to top ---------- */
SS.initBackToTop = function () {
  const btn = document.createElement("button");
  btn.id = "backToTop";
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 400));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
};

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", function () {
  SS.applyTheme();
  const page = document.body.getAttribute("data-page") || "";
  SS.renderNavbar(page);
  SS.renderFooter();
  SS.initBackToTop();
});
