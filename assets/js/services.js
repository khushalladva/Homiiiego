/* =========================================================
   Homiiiego — services.js
   Rendering + filter/sort/pagination logic for services
   and categories, shared by index, services, categories,
   search and service-details pages.
   ========================================================= */

SS.services = {
  getAll() { return SS.data.get("smartServices", []); },
  getById(id) { return this.getAll().find(s => String(s.id) === String(id)); },
  getByCategory(catName) { return this.getAll().filter(s => s.category === catName); },
  related(service, limit) {
    return this.getAll().filter(s => s.category === service.category && s.id !== service.id).slice(0, limit || 3);
  }
};

SS.categories = {
  getAll() { return SS.data.get("smartCategories", []); },
  getByName(name) { return this.getAll().find(c => c.name === name); }
};

SS.renderStars = function (rating) {
  const full = Math.round(rating);
  let s = "";
  for (let i = 1; i <= 5; i++) s += i <= full ? "★" : "☆";
  return s;
};

/* ---------- Saved services ("wishlist") for logged-in customers ----------
   Stored as a flat list of {userId, serviceId} pairs under "smartWishlist",
   the same pattern as everything else in SS.data. Kept separate from
   SS.services (which just reads the catalog) because this is about one
   user's relationship to the catalog, not the catalog itself. */
SS.wishlist = {
  // Every service id this user has saved
  getForUser(userId) {
    return SS.data.get("smartWishlist", [])
      .filter(w => w.userId === userId)
      .map(w => w.serviceId);
  },
  isSaved(userId, serviceId) {
    return this.getForUser(userId).includes(Number(serviceId));
  },
  // Adds the service if it wasn't saved, removes it if it was.
  // Returns true/false so the calling code knows which one happened.
  toggle(userId, serviceId) {
    const list = SS.data.get("smartWishlist", []);
    const idx = list.findIndex(w => w.userId === userId && w.serviceId === Number(serviceId));
    if (idx > -1) {
      list.splice(idx, 1);
      SS.data.set("smartWishlist", list);
      return false;
    }
    list.push({ userId, serviceId: Number(serviceId) });
    SS.data.set("smartWishlist", list);
    return true;
  }
};

/* Builds one service card as an HTML string.
   `opts.showWishlist: true` adds the little heart button in the corner —
   only the logged-in "Browse Services" page passes this; the public
   services/search/home pages call this the same way they always did. */
SS.serviceCardHTML = function (svc, opts) {
  opts = opts || {};
  const heartButton = opts.showWishlist
    ? '<button class="wishlist-btn' + (opts.saved ? " active" : "") + '" data-id="' + svc.id + '" title="Save for later" aria-label="Save for later">' +
        '<i class="bi ' + (opts.saved ? "bi-heart-fill" : "bi-heart") + '"></i>' +
      '</button>'
    : "";

  return (
    '<div class="col-sm-6 col-lg-4">' +
      '<div class="service-card">' +
        '<div class="thumb-wrap">' +
          '<img src="' + svc.image + '" alt="' + SS.escapeHTML(svc.name) + '" loading="lazy">' +
          '<span class="cat-badge">' + SS.escapeHTML(svc.category) + '</span>' +
          heartButton +
        '</div>' +
        '<div class="body">' +
          '<h5>' + SS.escapeHTML(svc.name) + '</h5>' +
          '<div class="provider-line"><i class="bi bi-shop me-1"></i>' + SS.escapeHTML(svc.provider) + '</div>' +
          '<div class="rating-line"><span class="stars">' + SS.renderStars(svc.rating) + '</span><strong>' + svc.rating.toFixed(1) + '</strong><span class="text-muted-2">(' + svc.reviews + ' reviews)</span></div>' +
          '<div class="price-row">' +
            '<div class="price">₹' + svc.price + '<br><small>Starting from</small></div>' +
            '<div class="duration-pill"><i class="bi bi-clock me-1"></i>' + svc.duration + '</div>' +
          '</div>' +
          '<div class="actions">' +
            '<a href="' + SS.base + 'service-details.html?id=' + svc.id + '" class="btn btn-outline-primary btn-sm-2">View Details</a>' +
            '<a href="' + SS.base + 'booking.html?serviceId=' + svc.id + '" class="btn btn-primary btn-sm-2">Book Now</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
};

SS.categoryCardHTML = function (cat) {
  return (
    '<div class="col-sm-6 col-lg-4">' +
      '<a href="' + SS.base + 'services.html?category=' + encodeURIComponent(cat.name) + '" class="text-decoration-none">' +
        '<div class="category-card">' +
          '<div class="cat-icon"><i class="bi ' + cat.icon + '"></i></div>' +
          '<h5>' + SS.escapeHTML(cat.name) + '</h5>' +
          '<p>' + SS.escapeHTML(cat.description) + '</p>' +
          '<div class="cat-meta">' +
            '<span>' + cat.count + ' services</span>' +
            '<span class="cat-arrow"><i class="bi bi-arrow-right"></i></span>' +
          '</div>' +
        '</div>' +
      '</a>' +
    '</div>'
  );
};

SS.emptyStateHTML = function (icon, title, text, btnLabel, btnHref) {
  return (
    '<div class="state-box">' +
      '<div class="state-icon"><i class="bi ' + icon + '"></i></div>' +
      '<h5>' + title + '</h5>' +
      '<p>' + text + '</p>' +
      (btnLabel ? '<a href="' + btnHref + '" class="btn btn-primary">' + btnLabel + '</a>' : "") +
    '</div>'
  );
};

/* ---------- Filter / sort / paginate (used by services.html) ---------- */
SS.filterServices = function (services, opts) {
  let result = services.slice();
  if (opts.query) {
    const q = opts.query.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q));
  }
  if (opts.category && opts.category !== "all") {
    result = result.filter(s => s.category === opts.category);
  }
  if (opts.minPrice) result = result.filter(s => s.price >= Number(opts.minPrice));
  if (opts.maxPrice) result = result.filter(s => s.price <= Number(opts.maxPrice));
  if (opts.rating) result = result.filter(s => s.rating >= Number(opts.rating));

  switch (opts.sort) {
    case "price-low": result.sort((a, b) => a.price - b.price); break;
    case "price-high": result.sort((a, b) => b.price - a.price); break;
    case "rating": result.sort((a, b) => b.rating - a.rating); break;
    default: result.sort((a, b) => b.reviews - a.reviews);
  }
  return result;
};

SS.paginate = function (items, page, perPage) {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};
