// categories.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.getElementById("categoriesGrid").innerHTML = SS.categories.getAll().map(SS.categoryCardHTML).join("");
