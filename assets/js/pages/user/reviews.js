// user/reviews.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let selectedRating = 0;

function renderReviews(userId) {
  const reviews = SS.data.get("smartReviews", []).filter(r => r.userId === userId);
  const listEl = document.getElementById("reviewsList");
  const emptyEl = document.getElementById("reviewsEmpty");

  if (!reviews.length) {
    listEl.innerHTML = "";
    emptyEl.classList.remove("d-none");
    emptyEl.innerHTML = SS.emptyStateHTML("bi-star", "You haven't reviewed any services yet", "Once your booking is completed, you can share your experience here.", "Browse Services", "browse-services.html");
    return;
  }
  emptyEl.classList.add("d-none");
  listEl.innerHTML = reviews.map(r =>
    '<div class="review-card">' +
      '<div class="d-flex justify-content-between align-items-start mb-1">' +
        '<strong style="color:var(--dark)">' + SS.escapeHTML(r.serviceName) + '</strong>' +
        '<span class="stars" style="color:var(--warning)">' + SS.renderStars(r.rating) + '</span>' +
      '</div>' +
      '<p class="text-muted-2 small mb-1">' + SS.escapeHTML(r.text) + '</p>' +
      '<span class="text-muted-2" style="font-size:0.78rem;">' + SS.formatDate(r.date) + '</span>' +
    '</div>'
  ).join("");
}

document.addEventListener("DOMContentLoaded", function () {
  SS.renderUserDashboardChrome("reviews", "My Reviews", "");
  const user = SS.currentUser();
  if (!user) return;

  renderReviews(user.id);

  // Populate service select with completed bookings only
  const completed = SS.booking.getAllForUser(user.id).filter(b => b.status === "completed");
  const select = document.getElementById("reviewService");
  if (completed.length) {
    select.innerHTML = completed.map(b => '<option value="' + b.serviceId + '" data-name="' + SS.escapeHTML(b.serviceName) + '">' + SS.escapeHTML(b.serviceName) + '</option>').join("");
  } else {
    select.innerHTML = '<option value="">No completed bookings to review</option>';
  }

  const stars = document.querySelectorAll("#starInput i");
  stars.forEach(star => star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.val);
    stars.forEach(s => s.classList.toggle("active", Number(s.dataset.val) <= selectedRating));
    document.getElementById("ratingError").style.display = "none";
  }));

  document.getElementById("submitReviewBtn").addEventListener("click", function () {
    const textEl = document.getElementById("reviewText");
    let valid = true;
    if (!selectedRating) { document.getElementById("ratingError").style.display = "block"; valid = false; }
    if (!SS.validate.notEmpty(textEl.value)) { SS.setFieldError(textEl, "Please write a short review."); valid = false; } else SS.clearFieldError(textEl);
    if (!select.value) { valid = false; SS.toast("You need a completed booking to leave a review.", "warning"); }
    if (!valid) return;

    const reviews = SS.data.get("smartReviews", []);
    const selectedOpt = select.options[select.selectedIndex];
    reviews.unshift({
      id: reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
      userId: user.id,
      userName: user.name,
      serviceId: Number(select.value),
      serviceName: selectedOpt.dataset.name,
      rating: selectedRating,
      text: textEl.value.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: "approved"
    });
    SS.data.set("smartReviews", reviews);

    bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
    SS.toast("Review submitted.", "success");
    document.getElementById("reviewForm").reset();
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("active"));
    renderReviews(user.id);
  });
});
