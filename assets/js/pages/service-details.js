// service-details.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const svc = SS.services.getById(id);
  const container = document.getElementById("detailsContent");

  if (!svc) {
    container.innerHTML = '<div class="container">' + SS.emptyStateHTML("bi-exclamation-circle", "Service not found", "This service may have been removed or the link is incorrect.", "Browse All Services", "services.html") + '</div>';
    return;
  }

  document.title = svc.name + " — Homiiiego";
  document.getElementById("crumbName").textContent = svc.name;

  const reviews = SS.data.get("smartReviews", []).filter(r => r.serviceId === svc.id && r.status === "approved");

  container.innerHTML =
    '<div class="container">' +
      '<div class="row g-5">' +
        '<div class="col-lg-7">' +
          '<div class="rounded-lg-2 overflow-hidden mb-4" style="aspect-ratio:16/10;">' +
            '<img src="' + svc.image + '" alt="' + SS.escapeHTML(svc.name) + '" class="w-100 h-100" style="object-fit:cover;">' +
          '</div>' +
          '<h5 class="mb-3">Description</h5>' +
          '<p class="text-muted-2">' + SS.escapeHTML(svc.description) + '</p>' +

          '<h5 class="mt-4 mb-3">What\'s Included</h5>' +
          '<ul class="list-unstyled">' + svc.includes.map(i => '<li class="mb-2"><i class="bi bi-check-circle-fill me-2" style="color:var(--success)"></i>' + SS.escapeHTML(i) + '</li>').join("") + '</ul>' +

          '<h5 class="mt-4 mb-3">Service Process</h5>' +
          '<div class="row g-3">' + svc.process.map((p, i) =>
            '<div class="col-sm-6"><div class="d-flex gap-2 align-items-start"><span class="step-num" style="width:34px;height:34px;font-size:0.95rem;margin-bottom:0;">' + (i+1) + '</span><span class="pt-2 small">' + SS.escapeHTML(p) + '</span></div></div>'
          ).join("") + '</div>' +

          '<h5 class="mt-5 mb-3">Provider Information</h5>' +
          '<div class="card-surface p-3 d-flex flex-row align-items-center gap-3">' +
            '<span class="avatar-circle" style="width:52px;height:52px;font-size:1.1rem;">' + svc.provider.split(" ").map(w=>w[0]).slice(0,2).join("") + '</span>' +
            '<div><div class="fw-display fw-bold" style="color:var(--dark)">' + SS.escapeHTML(svc.provider) + '</div><div class="text-muted-2 small"><span class="stars" style="color:var(--warning)">' + SS.renderStars(svc.rating) + '</span> ' + svc.rating.toFixed(1) + ' · ' + svc.reviews + ' reviews</div></div>' +
          '</div>' +

          '<h5 class="mt-5 mb-3">Customer Reviews (' + reviews.length + ')</h5>' +
          '<div id="reviewsList">' + (reviews.length ? reviews.map(r =>
            '<div class="review-card"><div class="d-flex justify-content-between mb-1"><strong style="color:var(--dark)">' + SS.escapeHTML(r.userName) + '</strong><span class="stars" style="color:var(--warning)">' + SS.renderStars(r.rating) + '</span></div><p class="text-muted-2 mb-0 small">' + SS.escapeHTML(r.text) + '</p></div>'
          ).join("") : SS.emptyStateHTML("bi-chat-square-text", "No reviews yet", "Be the first to review this service after booking.")) + '</div>' +
        '</div>' +

        '<div class="col-lg-5">' +
          '<div class="summary-card">' +
            '<span class="cat-badge mb-2 d-inline-block" style="position:static; background:var(--primary-light); color:var(--primary);">' + SS.escapeHTML(svc.category) + '</span>' +
            '<h3 class="mb-2">' + SS.escapeHTML(svc.name) + '</h3>' +
            '<div class="rating-line mb-3"><span class="stars" style="color:var(--warning)">' + SS.renderStars(svc.rating) + '</span><strong>' + svc.rating.toFixed(1) + '</strong><span class="text-muted-2">(' + svc.reviews + ' reviews)</span></div>' +
            '<div class="summary-row"><span class="lbl">Provider</span><span class="val">' + SS.escapeHTML(svc.provider) + '</span></div>' +
            '<div class="summary-row"><span class="lbl">Duration</span><span class="val">' + svc.duration + '</span></div>' +
            '<div class="summary-total"><span>Starting from</span><span>₹' + svc.price + '</span></div>' +
            '<a href="booking.html?serviceId=' + svc.id + '" class="btn btn-primary w-100 mt-3 btn-lg">Book Now</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  const related = SS.services.related(svc, 3);
  if (related.length) {
    document.getElementById("relatedSection").classList.remove("d-none");
    document.getElementById("relatedGrid").innerHTML = related.map(SS.serviceCardHTML).join("");
  }
});
