// provider/add-service.html
// The JavaScript that used to sit inline at the bottom of this
// page's HTML file now lives here instead, so the HTML file only
// has markup in it and this file only has logic in it.

document.addEventListener("DOMContentLoaded", function () {
  SS.renderProviderDashboardChrome("services", "Add Service", "");
  const provider = SS.currentProvider();
  if (!provider) return;

  const catSelect = document.getElementById("svcCategory");
  SS.categories.getAll().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name; opt.textContent = c.name;
    catSelect.appendChild(opt);
  });

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");
  let editingService = null;

  if (editId) {
    editingService = SS.services.getById(editId);
    if (editingService && editingService.providerId === provider.id) {
      document.getElementById("formTitle").textContent = "Edit Service";
      document.getElementById("formCrumb").textContent = "Edit Service";
      document.getElementById("svcName").value = editingService.name;
      document.getElementById("svcCategory").value = editingService.category;
      document.getElementById("svcDescription").value = editingService.description;
      document.getElementById("svcPrice").value = editingService.price;
      document.getElementById("svcDuration").value = editingService.duration;
      document.getElementById("svcStatus").value = editingService.status;
      document.getElementById("svcImage").value = editingService.image;
    }
  }

  document.getElementById("serviceForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    const nameEl = document.getElementById("svcName");
    const descEl = document.getElementById("svcDescription");
    const priceEl = document.getElementById("svcPrice");
    const durationEl = document.getElementById("svcDuration");

    if (!SS.validate.notEmpty(nameEl.value)) { SS.setFieldError(nameEl, "Please enter a service name."); valid = false; } else SS.clearFieldError(nameEl);
    if (!SS.validate.notEmpty(descEl.value)) { SS.setFieldError(descEl, "Please enter a description."); valid = false; } else SS.clearFieldError(descEl);
    if (!priceEl.value || Number(priceEl.value) <= 0) { SS.setFieldError(priceEl, "Please enter a valid price."); valid = false; } else SS.clearFieldError(priceEl);
    if (!SS.validate.notEmpty(durationEl.value)) { SS.setFieldError(durationEl, "Please enter an estimated duration."); valid = false; } else SS.clearFieldError(durationEl);
    if (!valid) return;

    const btn = document.getElementById("saveServiceBtn");
    SS.setButtonLoading(btn, "Saving...");

    const payload = {
      name: nameEl.value.trim(),
      category: document.getElementById("svcCategory").value,
      providerName: provider.name,
      description: descEl.value.trim(),
      price: priceEl.value,
      duration: durationEl.value.trim(),
      status: document.getElementById("svcStatus").value,
      image: document.getElementById("svcImage").value.trim()
    };

    setTimeout(() => {
      if (editingService) {
        SS.providerServices.update(editingService.id, payload);
        SS.toast("Service updated successfully.", "success");
      } else {
        SS.providerServices.add(provider.id, payload);
        SS.toast("Service added successfully.", "success");
      }
      SS.resetButtonLoading(btn);
      setTimeout(() => window.location.href = "services.html", 700);
    }, 600);
  });
});
