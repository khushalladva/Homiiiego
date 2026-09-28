// search.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

function runSearch() {
  const q = document.getElementById("searchQuery").value.trim();
  const category = document.getElementById("searchCategory").value;
  const location = document.getElementById("searchLocation").value.trim();

  const results = SS.filterServices(SS.services.getAll(), { query: q, category: category || "all", sort: "recommended" });

  document.getElementById("searchTitle").textContent = q ? 'Results for "' + q + '"' : "Search Results";
  document.getElementById("searchSub").textContent = results.length + " service" + (results.length === 1 ? "" : "s") + " found" + (location ? " near " + location : "");

  const grid = document.getElementById("searchResultsGrid");
  const emptyBox = document.getElementById("searchEmpty");
  if (!results.length) {
    grid.innerHTML = "";
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-search", "No matching services", "We couldn't find services matching your search. Try browsing all services instead.", "Browse All Services", "services.html");
  } else {
    emptyBox.classList.add("d-none");
    grid.innerHTML = results.map(SS.serviceCardHTML).join("");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  document.getElementById("searchQuery").value = params.get("q") || "";
  document.getElementById("searchLocation").value = params.get("location") || "";

  const catSelect = document.getElementById("searchCategory");
  SS.categories.getAll().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name; opt.textContent = c.name;
    if (params.get("category") === c.name) opt.selected = true;
    catSelect.appendChild(opt);
  });

  runSearch();
  document.getElementById("searchGoBtn").addEventListener("click", runSearch);
  document.getElementById("searchQuery").addEventListener("keyup", e => { if (e.key === "Enter") runSearch(); });
});
