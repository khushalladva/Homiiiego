// admin/categories.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let categoryIdPendingDelete = null;

function renderCategories() {
  const categories = SS.adminCategories.getAll();
  const services = SS.services.getAll();

  document.getElementById("categoriesBody").innerHTML = categories.map(c => {
    const serviceCount = services.filter(s => s.category === c.name).length;
    return '<tr>' +
      '<td data-label="Category"><i class="bi ' + c.icon + ' me-2" style="color:var(--primary)"></i>' + SS.escapeHTML(c.name) + '</td>' +
      '<td data-label="Description">' + SS.escapeHTML(c.description) + '</td>' +
      '<td data-label="Services">' + serviceCount + '</td>' +
      '<td data-label="Actions">' +
        '<div class="d-flex gap-1">' +
          '<button class="btn btn-sm-2 btn-light-2 edit-cat-btn" data-id="' + c.id + '"><i class="bi bi-pencil"></i></button>' +
          '<button class="btn btn-sm-2 btn-outline-danger delete-cat-btn" data-id="' + c.id + '"><i class="bi bi-trash"></i></button>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }).join("");

  document.querySelectorAll(".edit-cat-btn").forEach(btn => btn.addEventListener("click", () => {
    const c = SS.adminCategories.getAll().find(x => x.id === Number(btn.dataset.id));
    document.getElementById("categoryModalTitle").textContent = "Edit Category";
    document.getElementById("catId").value = c.id;
    document.getElementById("catName").value = c.name;
    document.getElementById("catIcon").value = c.icon;
    document.getElementById("catDescription").value = c.description;
    new bootstrap.Modal(document.getElementById("categoryModal")).show();
  }));

  document.querySelectorAll(".delete-cat-btn").forEach(btn => btn.addEventListener("click", () => {
    categoryIdPendingDelete = Number(btn.dataset.id);
    new bootstrap.Modal(document.getElementById("deleteCategoryModal")).show();
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("categories", "Categories", "");
  if (!SS.currentAdmin()) return;

  renderCategories();

  document.getElementById("addCategoryBtn").addEventListener("click", () => {
    document.getElementById("categoryModalTitle").textContent = "Add Category";
    document.getElementById("categoryForm").reset();
    document.getElementById("catId").value = "";
    new bootstrap.Modal(document.getElementById("categoryModal")).show();
  });

  document.getElementById("saveCategoryBtn").addEventListener("click", function () {
    const nameEl = document.getElementById("catName");
    const descEl = document.getElementById("catDescription");
    if (!SS.validate.notEmpty(nameEl.value) || !SS.validate.notEmpty(descEl.value)) {
      SS.toast("Please fill in the category name and description.", "warning");
      return;
    }
    const id = document.getElementById("catId").value;
    const payload = {
      name: nameEl.value.trim(),
      icon: document.getElementById("catIcon").value.trim() || "bi-grid",
      description: descEl.value.trim()
    };

    if (id) {
      SS.adminCategories.update(Number(id), payload);
      SS.toast("Category updated successfully.", "success");
    } else {
      SS.adminCategories.add(payload);
      SS.toast("Category added successfully.", "success");
    }
    bootstrap.Modal.getInstance(document.getElementById("categoryModal")).hide();
    renderCategories();
  });

  document.getElementById("confirmDeleteCategoryBtn").addEventListener("click", function () {
    if (categoryIdPendingDelete !== null) {
      SS.adminCategories.remove(categoryIdPendingDelete);
      bootstrap.Modal.getInstance(document.getElementById("deleteCategoryModal")).hide();
      SS.toast("Category deleted.", "info");
      renderCategories();
      categoryIdPendingDelete = null;
    }
  });
});
