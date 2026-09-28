/* =========================================================
   Homiiiego — auth.js
   Frontend-only authentication simulation.
   No real passwords are stored — this exists purely to
   demonstrate the UX flow. A real build would swap these
   functions for API calls without touching the HTML/CSS.
   ========================================================= */

SS.auth = {
  /* Attempt a customer login against the seeded mock users list */
  login(email, password) {
    const users = SS.data.get("smartUsers", []);
    const match = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!match) {
      return { ok: false, message: "No account found with this email address." };
    }
    if (match.status === "blocked") {
      return { ok: false, message: "This account has been blocked. Please contact support." };
    }
    if (!SS.validate.minLen(password, 6)) {
      return { ok: false, message: "Incorrect password. Please try again." };
    }
    SS.data.set("smartUser", match);
    SS.data.set("smartRole", "customer");
    return { ok: true, user: match };
  },

  register(payload) {
    const users = SS.data.get("smartUsers", []);
    if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      city: "",
      pincode: "",
      address: "",
      role: "customer",
      status: "active",
      registered: new Date().toISOString().slice(0, 10)
    };
    users.push(newUser);
    SS.data.set("smartUsers", users);
    return { ok: true, user: newUser };
  },

  changePassword(currentPw, newPw) {
    // Simulated only — no real password is stored, so we just validate input shape.
    if (!SS.validate.minLen(currentPw, 6)) return { ok: false, message: "Current password looks incorrect." };
    if (!SS.validate.minLen(newPw, 8)) return { ok: false, message: "New password must be at least 8 characters." };
    return { ok: true };
  },

  requestPasswordReset(email) {
    const users = SS.data.get("smartUsers", []);
    const match = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!match) return { ok: false, message: "No account found with this email address." };
    return { ok: true };
  }
};
