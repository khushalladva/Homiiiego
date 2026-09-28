// services.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

const PER_PAGE = 6;
let currentPage = 1;

function getParams() {
  return new URLSearchParams(window.location.search);
}

function buildCategoryFilters() {
  const params = getParams();
  const activeCat = params.get("category") || "all";
  const cats = SS.categories.getAll();
  let html = '<div class="form-check"><input class="form-check-input filter-cat" type="radio" name="fltCat" id="catAll" value="all"' + (activeCat === "all" ? " checked" : "") + '><label class="form-check-label" for="catAll">All</label></div>';
  cats.forEach((c, i) => {
    html += '<div class="form-check"><input class="form-check-input filter-cat" type="radio" name="fltCat" id="cat' + i + '" value="' + SS.escapeHTML(c.name) + '"' + (activeCat === c.name ? " checked" : "") + '><label class="form-check-label" for="cat' + i + '">' + SS.escapeHTML(c.name) + '</label></div>';
  });
  document.getElementById("fltCategoryList").innerHTML = html;
  document.querySelectorAll(".filter-cat").forEach(r => r.addEventListener("change", () => { currentPage = 1; runFilters(); }));
}

function getFilterOpts() {
  const catChecked = document.querySelector('input[name="fltCat"]:checked');
  const ratingChecked = document.querySelector('input[name="fltRating"]:checked');
  return {
    query: document.getElementById("fltQuery").value.trim(),
    category: catChecked ? catChecked.value : "all",
    minPrice: document.getElementById("fltMinPrice").value,
    maxPrice: document.getElementById("fltMaxPrice").value,
    rating: ratingChecked ? ratingChecked.value : "",
    sort: document.getElementById("fltSort").value
  };
}

function renderPagination(total) {
  const pages = Math.ceil(total / PER_PAGE);
  const wrap = document.getElementById("paginationWrap");
  if (pages <= 1) { wrap.innerHTML = ""; return; }
  let html = '<ul class="pagination justify-content-center">';
  for (let i = 1; i <= pages; i++) {
    html += '<li class="page-item' + (i === currentPage ? " active" : "") + '"><a class="page-link pg-link" href="#" data-page="' + i + '" style="' + (i===currentPage ? 'background:var(--primary);border-color:var(--primary);' : 'color:var(--dark);') + '">' + i + '</a></li>';
  }
  html += '</ul>';
  wrap.innerHTML = html;
  document.querySelectorAll(".pg-link").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    currentPage = Number(a.dataset.page);
    runFilters(false);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }));
}

function runFilters(resetPage) {
  if (resetPage) currentPage = 1;
  const opts = getFilterOpts();
  const filtered = SS.filterServices(SS.services.getAll(), opts);
  const grid = document.getElementById("servicesGrid");
  const emptyBox = document.getElementById("servicesEmpty");

  document.getElementById("resultsCount").textContent = filtered.length + " service" + (filtered.length === 1 ? "" : "s") + " found";

  if (!filtered.length) {
    grid.innerHTML = "";
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-search", "No services found", "Try adjusting your filters or search with different keywords.", "Clear Filters", "#");
    emptyBox.querySelector("a").addEventListener("click", e => { e.preventDefault(); clearFilters(); });
    document.getElementById("paginationWrap").innerHTML = "";
    return;
  }
  emptyBox.classList.add("d-none");
  const pageItems = SS.paginate(filtered, currentPage, PER_PAGE);
  grid.innerHTML = pageItems.map(SS.serviceCardHTML).join("");
  renderPagination(filtered.length);
}

function clearFilters() {
  document.getElementById("fltQuery").value = "";
  document.getElementById("fltMinPrice").value = "";
  document.getElementById("fltMaxPrice").value = "";
  document.getElementById("catAll").checked = true;
  document.getElementById("r0").checked = true;
  document.getElementById("fltSort").value = "recommended";
  currentPage = 1;
  runFilters();
}

document.addEventListener("DOMContentLoaded", function () {
  const params = getParams();
  if (params.get("q")) document.getElementById("fltQuery").value = params.get("q");

  buildCategoryFilters();
  runFilters();

  document.getElementById("fltQuery").addEventListener("input", () => runFilters(true));
  document.getElementById("fltMinPrice").addEventListener("input", () => runFilters(true));
  document.getElementById("fltMaxPrice").addEventListener("input", () => runFilters(true));
  document.querySelectorAll('input[name="fltRating"]').forEach(r => r.addEventListener("change", () => runFilters(true)));
  document.getElementById("fltSort").addEventListener("change", () => runFilters(true));
  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
});
