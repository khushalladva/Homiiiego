// user/browse-services.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

// Everything on this page depends on knowing who's logged in, so we grab
// that first and stop early (via the auth guard) if nobody is.
let currentUser;

/* Works out which category this person books the most, then shows other
   good services from that category they haven't already tried. If they
   have no booking history yet, it just falls back to the top-rated
   services so the section is never empty. */
function getRecommendedServices() {
  const pastBookings = SS.booking.getAllForUser(currentUser.id);
  const alreadyBookedIds = new Set(pastBookings.map(b => b.serviceId));
  const allServices = SS.services.getAll();

  let favoriteCategory = null;
  if (pastBookings.length) {
    const categoryCounts = {};
    pastBookings.forEach(b => {
      const svc = SS.services.getById(b.serviceId);
      if (svc) categoryCounts[svc.category] = (categoryCounts[svc.category] || 0) + 1;
    });
    favoriteCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0];
  }

  let pool = allServices.filter(s => !alreadyBookedIds.has(s.id));
  if (favoriteCategory) {
    const sameCategoryOnly = pool.filter(s => s.category === favoriteCategory);
    if (sameCategoryOnly.length) pool = sameCategoryOnly;
  }
  return pool.sort((a, b) => b.rating - a.rating).slice(0, 4);
}

/* Every service the person has completed at least once, so they can
   book the same thing again without hunting for it. */
function getBookAgainServices() {
  const completedBookings = SS.booking.getAllForUser(currentUser.id).filter(b => b.status === "completed");
  const uniqueServiceIds = [...new Set(completedBookings.map(b => b.serviceId))];
  return uniqueServiceIds.map(id => SS.services.getById(id)).filter(Boolean).slice(0, 4);
}

function renderRecommended() {
  const services = getRecommendedServices();
  document.getElementById("recommendedRow").innerHTML = services.map(s => SS.serviceCardHTML(s, {
    showWishlist: true,
    saved: SS.wishlist.isSaved(currentUser.id, s.id)
  })).join("");
}

function renderBookAgain() {
  const services = getBookAgainServices();
  const section = document.getElementById("bookAgainSection");
  if (!services.length) { section.classList.add("d-none"); return; }
  section.classList.remove("d-none");
  document.getElementById("bookAgainRow").innerHTML = services.map(s => SS.serviceCardHTML(s, {
    showWishlist: true,
    saved: SS.wishlist.isSaved(currentUser.id, s.id)
  })).join("");
}

function renderSaved() {
  const savedIds = SS.wishlist.getForUser(currentUser.id);
  const section = document.getElementById("savedSection");
  const services = savedIds.map(id => SS.services.getById(id)).filter(Boolean);
  if (!services.length) { section.classList.add("d-none"); return; }
  section.classList.remove("d-none");
  document.getElementById("savedRow").innerHTML = services.map(s => SS.serviceCardHTML(s, { showWishlist: true, saved: true })).join("");
}

function renderCatalog() {
  const opts = {
    query: document.getElementById("bsQuery").value.trim(),
    category: document.getElementById("bsCategory").value,
    sort: document.getElementById("bsSort").value
  };
  const results = SS.filterServices(SS.services.getAll(), opts);
  document.getElementById("bsCount").textContent = results.length + " service" + (results.length === 1 ? "" : "s");

  const grid = document.getElementById("catalogGrid");
  const emptyBox = document.getElementById("catalogEmpty");
  if (!results.length) {
    grid.innerHTML = "";
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-search", "No services found", "Try a different search term or category.");
    return;
  }
  emptyBox.classList.add("d-none");
  grid.innerHTML = results.map(s => SS.serviceCardHTML(s, {
    showWishlist: true,
    saved: SS.wishlist.isSaved(currentUser.id, s.id)
  })).join("");
}

/* One heart button anywhere on the page (recommended, book-again, saved,
   or the main catalog) all go through this same handler. Toggling it
   saves straight to localStorage, then re-renders every section so the
   "Saved Services" row and every heart icon on the page stay in sync. */
function wireWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const nowSaved = SS.wishlist.toggle(currentUser.id, btn.dataset.id);
      SS.toast(nowSaved ? "Saved to your list." : "Removed from your list.", "info");
      renderRecommended();
      renderBookAgain();
      renderSaved();
      renderCatalog();
    });
  });
}

function renderEverything() {
  renderRecommended();
  renderBookAgain();
  renderSaved();
  renderCatalog();
  wireWishlistButtons();
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("browse", "Browse Services", "");
  currentUser = SS.currentUser();
  if (!currentUser) return; // the auth guard above already redirects to login

  document.getElementById("pageGreeting").textContent = "Browse Services, " + currentUser.name.split(" ")[0];

  // Fill the category dropdown from the same category list every other page uses
  const categorySelect = document.getElementById("bsCategory");
  SS.categories.getAll().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    categorySelect.appendChild(opt);
  });

  // Someone can land here from a "category" link elsewhere in the
  // dashboard (e.g. ?category=Plumber) — if so, pre-select it.
  const urlParams = new URLSearchParams(window.location.search);
  const requestedCategory = urlParams.get("category");
  if (requestedCategory && [...categorySelect.options].some(o => o.value === requestedCategory)) {
    categorySelect.value = requestedCategory;
  }

  renderEverything();

  // Re-run the catalog search whenever any filter changes.
  // (Recommended / Book Again / Saved don't need to re-run here — they
  // only change when a heart button is clicked, handled separately above.)
  document.getElementById("bsQuery").addEventListener("input", renderCatalog);
  document.getElementById("bsCategory").addEventListener("change", renderCatalog);
  document.getElementById("bsSort").addEventListener("change", renderCatalog);

  // Every re-render above only redraws the sections that changed, but the
  // heart buttons themselves are brand-new DOM elements each time, so we
  // need to re-wire clicks after any redraw. Easiest is to just re-wire
  // after each filter change too.
  ["bsQuery", "bsCategory", "bsSort"].forEach(id => {
    document.getElementById(id).addEventListener("input", wireWishlistButtons);
    document.getElementById(id).addEventListener("change", wireWishlistButtons);
  });
});
