/* =========================================================
   Homiiiego — booking.js
   Multi-step booking flow, entirely client-side.
   ========================================================= */

SS.booking = {
  generateId() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return "SS-" + y + m + d + "-" + rand;
  },

  create(payload) {
    const bookings = SS.data.get("smartBookings", []);
    const booking = {
      id: this.generateId(),
      userId: payload.userId,
      userName: payload.userName,
      serviceId: payload.serviceId,
      serviceName: payload.serviceName,
      providerId: payload.providerId,
      provider: payload.provider,
      date: payload.date,
      time: payload.time,
      address: payload.address,
      city: payload.city,
      pincode: payload.pincode,
      notes: payload.notes || "",
      price: payload.price,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    bookings.unshift(booking);
    SS.data.set("smartBookings", bookings);

    // Notify the customer their request went in
    const notifs = SS.data.get("smartNotifications", []);
    notifs.unshift({
      id: notifs.length ? Math.max(...notifs.map(n => n.id)) + 1 : 1,
      userId: payload.userId,
      text: "Your " + payload.serviceName + " booking request has been submitted.",
      time: new Date().toISOString(),
      read: false,
      type: "info"
    });
    SS.data.set("smartNotifications", notifs);

    // Notify the provider a new request is waiting on them
    const providerNotifs = SS.data.get("smartProviderNotifications", []);
    providerNotifs.unshift({
      id: providerNotifs.length ? Math.max(...providerNotifs.map(n => n.id)) + 1 : 1,
      providerId: payload.providerId,
      text: "New booking request from " + (payload.userName || "a customer") + " for " + payload.serviceName + ".",
      time: new Date().toISOString(),
      read: false,
      type: "info"
    });
    SS.data.set("smartProviderNotifications", providerNotifs);

    return booking;
  },

  getAllForUser(userId) {
    return SS.data.get("smartBookings", []).filter(b => b.userId === userId);
  },

  getAllForProvider(providerId) {
    return SS.data.get("smartBookings", []).filter(b => b.providerId === providerId);
  },

  updateStatus(bookingId, newStatus) {
    const bookings = SS.data.get("smartBookings", []);
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return null;
    bookings[idx].status = newStatus;
    SS.data.set("smartBookings", bookings);

    const statusText = { approved: "approved", rejected: "rejected", inprogress: "marked as in progress", completed: "marked as completed", cancelled: "cancelled" };
    const notifs = SS.data.get("smartNotifications", []);
    notifs.unshift({
      id: notifs.length ? Math.max(...notifs.map(n => n.id)) + 1 : 1,
      userId: bookings[idx].userId,
      text: "Your " + bookings[idx].serviceName + " booking has been " + (statusText[newStatus] || newStatus) + ".",
      time: new Date().toISOString(),
      read: false,
      type: (newStatus === "cancelled" || newStatus === "rejected") ? "warning" : "success"
    });
    SS.data.set("smartNotifications", notifs);

    return bookings[idx];
  },

  getById(id) {
    return SS.data.get("smartBookings", []).find(b => b.id === id);
  },

  statusBadgeHTML(status) {
    const labels = { pending: "Pending", approved: "Approved", inprogress: "In Progress", completed: "Completed", cancelled: "Cancelled", rejected: "Rejected" };
    return '<span class="status-badge status-' + status + '">' + (labels[status] || status) + '</span>';
  },

  timelineSteps(status) {
    const order = ["pending", "approved", "inprogress", "completed"];
    if (status === "cancelled" || status === "rejected") {
      return [
        { key: "created", label: "Booking Created", sub: "Your request was submitted", state: "done" },
        { key: "cancelled", label: status === "cancelled" ? "Cancelled" : "Rejected", sub: "This booking will not proceed", state: "current" }
      ];
    }
    const idx = order.indexOf(status);
    const steps = [
      { key: "pending", label: "Booking Created", sub: "Your request was submitted" },
      { key: "approved", label: "Approved", sub: "Provider confirmed your booking" },
      { key: "inprogress", label: "In Progress", sub: "Service is underway" },
      { key: "completed", label: "Completed", sub: "Service finished successfully" }
    ];
    return steps.map((s, i) => ({
      ...s,
      state: i < idx ? "done" : i === idx ? "current" : "upcoming"
    }));
  }
};
