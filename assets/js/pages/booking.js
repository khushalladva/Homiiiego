// booking.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

let currentStep = 1;
const TOTAL_STEPS = 5;
let selectedSlot = null;

function getSelectedService() {
  const id = document.getElementById("serviceSelect").value;
  return SS.services.getById(id);
}

function updateSummary() {
  const svc = getSelectedService();
  document.getElementById("sumService").textContent = svc ? svc.name : "—";
  document.getElementById("sumProvider").textContent = svc ? svc.provider : "—";
  document.getElementById("sumDate").textContent = document.getElementById("bookingDate").value ? SS.formatDate(document.getElementById("bookingDate").value) : "—";
  document.getElementById("sumTime").textContent = selectedSlot || "—";
  document.getElementById("sumPrice").textContent = svc ? "₹" + svc.price : "—";
}

function renderServicePreview() {
  const svc = getSelectedService();
  if (!svc) return;
  document.getElementById("serviceStep1Preview").innerHTML =
    '<div class="d-flex gap-3 align-items-center card-surface p-3">' +
      '<img src="' + svc.image + '" alt="" style="width:80px;height:64px;object-fit:cover;border-radius:8px;">' +
      '<div><div class="fw-bold" style="color:var(--dark)">' + SS.escapeHTML(svc.name) + '</div><div class="text-muted-2 small">' + SS.escapeHTML(svc.provider) + ' · ₹' + svc.price + ' · ' + svc.duration + '</div></div>' +
    '</div>';
  updateSummary();
}

function renderTimeSlots() {
  const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
  const grid = document.getElementById("timeSlotsGrid");
  grid.innerHTML = slots.map(s =>
    '<div class="col-4 col-md-3"><div class="time-slot' + (s === selectedSlot ? " selected" : "") + '" data-slot="' + s + '">' + s + '</div></div>'
  ).join("");
  grid.querySelectorAll(".time-slot").forEach(el => el.addEventListener("click", () => {
    selectedSlot = el.dataset.slot;
    grid.querySelectorAll(".time-slot").forEach(x => x.classList.remove("selected"));
    el.classList.add("selected");
    document.getElementById("timeError").style.display = "none";
    updateSummary();
  }));
}

function renderConfirmReview() {
  const svc = getSelectedService();
  document.getElementById("confirmReview").innerHTML =
    '<div class="summary-row"><span class="lbl">Service</span><span class="val">' + SS.escapeHTML(svc.name) + '</span></div>' +
    '<div class="summary-row"><span class="lbl">Provider</span><span class="val">' + SS.escapeHTML(svc.provider) + '</span></div>' +
    '<div class="summary-row"><span class="lbl">Date</span><span class="val">' + SS.formatDate(document.getElementById("bookingDate").value) + '</span></div>' +
    '<div class="summary-row"><span class="lbl">Time</span><span class="val">' + selectedSlot + '</span></div>' +
    '<div class="summary-row"><span class="lbl">Address</span><span class="val">' + SS.escapeHTML(document.getElementById("fullAddress").value) + ', ' + SS.escapeHTML(document.getElementById("cityField").value) + ' - ' + SS.escapeHTML(document.getElementById("pincodeField").value) + '</span></div>' +
    '<div class="summary-total"><span>Total</span><span>₹' + svc.price + '</span></div>';
}

function goToStep(step) {
  document.querySelectorAll(".booking-step").forEach(el => el.classList.add("d-none"));
  document.getElementById("step" + step).classList.remove("d-none");

  document.querySelectorAll(".bp-step").forEach(el => {
    const n = Number(el.dataset.step);
    el.classList.remove("active", "done");
    if (n < step) el.classList.add("done");
    else if (n === step) el.classList.add("active");
    if (n <= step - 1) el.querySelector(".bp-circle").innerHTML = n < step ? '<i class="bi bi-check-lg"></i>' : n;
    else el.querySelector(".bp-circle").textContent = n;
  });

  document.getElementById("prevBtn").disabled = step === 1;
  const nextBtn = document.getElementById("nextBtn");
  if (step === TOTAL_STEPS) {
    nextBtn.textContent = "Confirm Booking";
    renderConfirmReview();
  } else {
    nextBtn.textContent = "Continue";
  }
  currentStep = step;
}

function validateStep(step) {
  if (step === 2) {
    const dateVal = document.getElementById("bookingDate").value;
    const today = new Date(); today.setHours(0,0,0,0);
    const chosen = new Date(dateVal);
    const errEl = document.getElementById("dateError");
    if (!dateVal || chosen < today) { errEl.style.display = "block"; document.getElementById("bookingDate").classList.add("is-invalid"); return false; }
    errEl.style.display = "none"; document.getElementById("bookingDate").classList.remove("is-invalid");
    return true;
  }
  if (step === 3) {
    if (!selectedSlot) { document.getElementById("timeError").style.display = "block"; return false; }
    return true;
  }
  if (step === 4) {
    let ok = true;
    const addr = document.getElementById("fullAddress");
    const city = document.getElementById("cityField");
    const pin = document.getElementById("pincodeField");
    if (!SS.validate.notEmpty(addr.value)) { SS.setFieldError(addr, "Please enter your full address."); ok = false; } else SS.clearFieldError(addr);
    if (!SS.validate.notEmpty(city.value)) { SS.setFieldError(city, "Please enter your city."); ok = false; } else SS.clearFieldError(city);
    if (!SS.validate.isPincode(pin.value)) { SS.setFieldError(pin, "Please enter a valid 5-6 digit pincode."); ok = false; } else SS.clearFieldError(pin);
    return ok;
  }
  return true;
}

function submitBooking() {
  const user = SS.currentUser();
  if (!user) {
    SS.toast("Please login to confirm your booking.", "warning");
    setTimeout(() => window.location.href = "login.html", 900);
    return;
  }
  const svc = getSelectedService();
  const btn = document.getElementById("nextBtn");
  SS.setButtonLoading(btn, "Processing...");

  setTimeout(() => {
    const booking = SS.booking.create({
      userId: user.id,
      userName: user.name,
      serviceId: svc.id,
      serviceName: svc.name,
      providerId: svc.providerId,
      provider: svc.provider,
      date: document.getElementById("bookingDate").value,
      time: selectedSlot,
      address: document.getElementById("fullAddress").value.trim(),
      city: document.getElementById("cityField").value.trim(),
      pincode: document.getElementById("pincodeField").value.trim(),
      notes: document.getElementById("notesField").value.trim(),
      price: svc.price
    });
    sessionStorage.setItem("lastBookingId", booking.id);
    window.location.href = "booking-success.html";
  }, 900);
}

document.addEventListener("DOMContentLoaded", function () {
  const services = SS.services.getAll();
  const select = document.getElementById("serviceSelect");
  select.innerHTML = services.map(s => '<option value="' + s.id + '">' + SS.escapeHTML(s.name) + ' — ₹' + s.price + '</option>').join("");

  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("serviceId");
  if (preselect && services.some(s => String(s.id) === preselect)) select.value = preselect;

  select.addEventListener("change", renderServicePreview);
  renderServicePreview();
  renderTimeSlots();

  const dateInput = document.getElementById("bookingDate");
  const todayStr = new Date().toISOString().slice(0, 10);
  dateInput.min = todayStr;
  dateInput.value = todayStr;
  dateInput.addEventListener("change", updateSummary);

  document.getElementById("nextBtn").addEventListener("click", function () {
    if (currentStep < TOTAL_STEPS) {
      if (!validateStep(currentStep)) return;
      goToStep(currentStep + 1);
    } else {
      submitBooking();
    }
  });
  document.getElementById("prevBtn").addEventListener("click", function () {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  goToStep(1);
});
