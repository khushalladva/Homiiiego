// admin/users.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let userIdPendingDelete = null;

function renderUsers(filterText) {
  let users = SS.adminUsers.getAll();
  if (filterText) {
    const q = filterText.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  const tbody = document.getElementById("usersBody");
  const emptyBox = document.getElementById("usersEmpty");
  if (!users.length) {
    document.querySelector(".table-wrap-2").classList.add("d-none");
    emptyBox.classList.remove("d-none");
    emptyBox.innerHTML = SS.emptyStateHTML("bi-people", "No users found", "Try a different search term.");
    return;
  }
  document.querySelector(".table-wrap-2").classList.remove("d-none");
  emptyBox.classList.add("d-none");

  tbody.innerHTML = users.map(u =>
    '<tr>' +
      '<td data-label="ID">#' + u.id + '</td>' +
      '<td data-label="Name">' + SS.escapeHTML(u.name) + '</td>' +
      '<td data-label="Email">' + SS.escapeHTML(u.email) + '</td>' +
      '<td data-label="Phone">' + SS.escapeHTML(u.phone || "—") + '</td>' +
      '<td data-label="Registered">' + SS.formatDate(u.registered) + '</td>' +
      '<td data-label="Status"><span class="status-badge status-' + (u.status === "blocked" ? "blocked" : "active") + '">' + (u.status === "blocked" ? "Blocked" : "Active") + '</span></td>' +
      '<td data-label="Actions">' +
        '<div class="d-flex gap-1">' +
          '<button class="btn btn-sm-2 btn-light-2 view-btn" data-id="' + u.id + '" title="View"><i class="bi bi-eye"></i></button>' +
          '<button class="btn btn-sm-2 btn-light-2 edit-btn" data-id="' + u.id + '" title="Edit"><i class="bi bi-pencil"></i></button>' +
          '<button class="btn btn-sm-2 btn-light-2 block-btn" data-id="' + u.id + '" title="' + (u.status === "blocked" ? "Unblock" : "Block") + '"><i class="bi bi-' + (u.status === "blocked" ? "unlock" : "slash-circle") + '"></i></button>' +
          '<button class="btn btn-sm-2 btn-outline-danger delete-btn" data-id="' + u.id + '" title="Delete"><i class="bi bi-trash"></i></button>' +
        '</div>' +
      '</td>' +
    '</tr>'
  ).join("");

  document.querySelectorAll(".view-btn").forEach(btn => btn.addEventListener("click", () => {
    const u = SS.adminUsers.getAll().find(x => x.id === Number(btn.dataset.id));
    document.getElementById("viewUserBody").innerHTML =
      '<div class="summary-row"><span class="lbl">Name</span><span class="val">' + SS.escapeHTML(u.name) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Email</span><span class="val">' + SS.escapeHTML(u.email) + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Phone</span><span class="val">' + SS.escapeHTML(u.phone || "—") + '</span></div>' +
      '<div class="summary-row"><span class="lbl">City</span><span class="val">' + SS.escapeHTML(u.city || "—") + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Address</span><span class="val">' + SS.escapeHTML(u.address || "—") + '</span></div>' +
      '<div class="summary-row"><span class="lbl">Registered</span><span class="val">' + SS.formatDate(u.registered) + '</span></div>';
    new bootstrap.Modal(document.getElementById("viewUserModal")).show();
  }));

  document.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", () => {
    const u = SS.adminUsers.getAll().find(x => x.id === Number(btn.dataset.id));
    document.getElementById("euId").value = u.id;
    document.getElementById("euName").value = u.name;
    document.getElementById("euPhone").value = u.phone || "";
    document.getElementById("euCity").value = u.city || "";
    new bootstrap.Modal(document.getElementById("editUserModal")).show();
  }));

  document.querySelectorAll(".block-btn").forEach(btn => btn.addEventListener("click", () => {
    const updated = SS.adminUsers.toggleBlock(Number(btn.dataset.id));
    SS.toast(updated.status === "blocked" ? "User blocked." : "User unblocked.", "info");
    renderUsers(document.getElementById("userSearch").value);
  }));

  document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", () => {
    userIdPendingDelete = Number(btn.dataset.id);
    new bootstrap.Modal(document.getElementById("deleteUserModal")).show();
  }));
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderAdminDashboardChrome("users", "Users", "");
  if (!SS.currentAdmin()) return;

  renderUsers("");
  document.getElementById("userSearch").addEventListener("input", e => renderUsers(e.target.value));

  document.getElementById("saveUserBtn").addEventListener("click", function () {
    const id = Number(document.getElementById("euId").value);
    SS.adminUsers.update(id, {
      name: document.getElementById("euName").value.trim(),
      phone: document.getElementById("euPhone").value.trim(),
      city: document.getElementById("euCity").value.trim()
    });
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
    SS.toast("User updated successfully.", "success");
    renderUsers(document.getElementById("userSearch").value);
  });

  document.getElementById("confirmDeleteUserBtn").addEventListener("click", function () {
    if (userIdPendingDelete !== null) {
      SS.adminUsers.remove(userIdPendingDelete);
      bootstrap.Modal.getInstance(document.getElementById("deleteUserModal")).hide();
      SS.toast("User deleted.", "info");
      renderUsers(document.getElementById("userSearch").value);
      userIdPendingDelete = null;
    }
  });
});
