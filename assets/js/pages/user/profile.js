// user/profile.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("profile", "My Profile", "");
  const user = SS.currentUser();
  if (!user) return;

  const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  document.getElementById("profileAvatar").textContent = initials;
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;

  document.getElementById("pFullName").textContent = user.name;
  document.getElementById("pEmail").textContent = user.email;
  document.getElementById("pPhone").textContent = user.phone || "Not provided";
  document.getElementById("pCity").textContent = user.city || "Not provided";
  document.getElementById("pPincode").textContent = user.pincode || "Not provided";
  document.getElementById("pAddress").textContent = user.address || "Not provided";
  document.getElementById("pJoined").textContent = user.registered ? SS.formatDate(user.registered) : "—";
});
