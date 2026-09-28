// index.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  // Populate hero category dropdown
  const catSelect = document.getElementById("heroCategory");
  SS.categories.getAll().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name; opt.textContent = c.name;
    catSelect.appendChild(opt);
  });

  // Categories preview (first 6)
  document.getElementById("homeCategoriesRow").innerHTML =
    SS.categories.getAll().slice(0, 6).map(SS.categoryCardHTML).join("");

  // Services preview (top 6 by reviews)
  const topServices = SS.filterServices(SS.services.getAll(), { sort: "recommended" }).slice(0, 6);
  document.getElementById("homeServicesRow").innerHTML = topServices.map(SS.serviceCardHTML).join("");

  // Testimonials from approved reviews
  const reviews = SS.data.get("smartReviews", []).filter(r => r.status === "approved").slice(0, 3);
  const avatarSeed = ["a1","b2","c3"];
  document.getElementById("testimonialsRow").innerHTML = reviews.map((r, i) =>
    '<div class="col-md-4">' +
      '<div class="testimonial-card">' +
        '<div class="stars">' + SS.renderStars(r.rating) + '</div>' +
        '<p class="quote">"' + SS.escapeHTML(r.text) + '"</p>' +
        '<div class="person">' +
          '<img src="https://i.pravatar.cc/80?u=' + avatarSeed[i % avatarSeed.length] + '" alt="' + SS.escapeHTML(r.userName) + '">' +
          '<div><div class="name">' + SS.escapeHTML(r.userName) + '</div><div class="role">' + SS.escapeHTML(r.serviceName) + '</div></div>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join("");

  // Hero search
  document.getElementById("heroSearchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const service = document.getElementById("heroService").value.trim();
    const location = document.getElementById("heroLocation").value.trim();
    const category = document.getElementById("heroCategory").value;

    if (!service && !category) {
      SS.toast("Please enter a service or select a category.", "warning");
      return;
    }
    const params = new URLSearchParams();
    if (service) params.set("q", service);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    window.location.href = "search.html?" + params.toString();
  });
});
