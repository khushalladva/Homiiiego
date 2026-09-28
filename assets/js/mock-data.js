/* =========================================================
   Homiiiego — Mock Data
   Seeds localStorage on first load. Structured so a real
   backend/API can replace these arrays later without
   touching the rendering code (see main.js -> SS.data.*).
   ========================================================= */

const MOCK_CATEGORIES = [
  { id: 1, name: "AC Repair", icon: "bi-snow", description: "Cooling and AC maintenance", count: 18 },
  { id: 2, name: "Electrician", icon: "bi-lightning-charge", description: "Electrical installation and repair", count: 24 },
  { id: 3, name: "Plumber", icon: "bi-droplet", description: "Plumbing and pipe services", count: 21 },
  { id: 4, name: "Cleaning", icon: "bi-stars", description: "Home and office cleaning", count: 30 },
  { id: 5, name: "Computer Repair", icon: "bi-laptop", description: "Laptop and computer support", count: 15 },
  { id: 6, name: "Carpentry", icon: "bi-hammer", description: "Furniture and woodwork services", count: 12 }
];

const MOCK_PROVIDERS = [
  { id: 1, name: "CoolCare Services", email: "coolcare@homiiiego.test", phone: "+91 98200 11122", rating: 4.8, services: 6, status: "active", joined: "2024-03-12", business: "CoolCare Pvt Ltd" },
  { id: 2, name: "SparkFix Electricals", email: "sparkfix@homiiiego.test", phone: "+91 98200 33344", rating: 4.6, services: 9, status: "active", joined: "2023-11-02", business: "SparkFix Solutions" },
  { id: 3, name: "AquaFlow Plumbing", email: "aquaflow@homiiiego.test", phone: "+91 98200 55566", rating: 4.7, services: 7, status: "active", joined: "2024-01-20", business: "AquaFlow Services" },
  { id: 4, name: "ShineHome Cleaners", email: "shinehome@homiiiego.test", phone: "+91 98200 77788", rating: 4.9, services: 11, status: "active", joined: "2024-05-08", business: "ShineHome LLP" },
  { id: 5, name: "ByteFix Computers", email: "bytefix@homiiiego.test", phone: "+91 98200 99900", rating: 4.5, services: 5, status: "pending", joined: "2025-02-14", business: "ByteFix IT Services" }
];

const MOCK_SERVICES = [
  { id: 1, name: "AC Repair & Maintenance", category: "AC Repair", categoryId: 1, providerId: 1, provider: "CoolCare Services", price: 499, rating: 4.8, reviews: 124, duration: "1–2 Hours", status: "active",
    image: "https://picsum.photos/seed/ac-repair-1/640/480",
    description: "Complete diagnostic, gas top-up and filter cleaning for split and window ACs, carried out by certified technicians using calibrated tools.",
    includes: ["Full unit inspection", "Gas pressure check", "Filter & coil cleaning", "Cooling performance test"],
    process: ["Book a convenient slot", "Technician arrives with tools", "Diagnosis & repair", "Final testing & handover"] },
  { id: 2, name: "AC Deep Gas Refill", category: "AC Repair", categoryId: 1, providerId: 1, provider: "CoolCare Services", price: 1299, rating: 4.7, reviews: 68, duration: "2–3 Hours", status: "active",
    image: "https://picsum.photos/seed/ac-repair-2/640/480",
    description: "Full refrigerant recharge for units with reduced cooling, including leak check and pressure testing.",
    includes: ["Leak detection", "Refrigerant refill", "Pressure testing", "30-day service warranty"],
    process: ["Book a convenient slot", "Leak test performed", "Gas refilled to spec", "Cooling verified"] },
  { id: 3, name: "Home Wiring Inspection", category: "Electrician", categoryId: 2, providerId: 2, provider: "SparkFix Electricals", price: 349, rating: 4.6, reviews: 91, duration: "1 Hour", status: "active",
    image: "https://picsum.photos/seed/electrician-1/640/480",
    description: "Complete household wiring safety check to identify faults, loose connections and overload risks.",
    includes: ["Panel inspection", "Socket & switch testing", "Earthing check", "Safety report"],
    process: ["Book a slot", "Electrician inspects panel", "Faults identified", "Report shared"] },
  { id: 4, name: "Switchboard & Socket Repair", category: "Electrician", categoryId: 2, providerId: 2, provider: "SparkFix Electricals", price: 299, rating: 4.5, reviews: 57, duration: "45 Mins – 1 Hour", status: "active",
    image: "https://picsum.photos/seed/electrician-2/640/480",
    description: "Repair or replacement of faulty switchboards, sockets and MCBs for safe household power supply.",
    includes: ["Fault diagnosis", "Component replacement", "Load testing", "Safety check"],
    process: ["Book a slot", "Technician diagnoses fault", "Parts replaced", "Final testing"] },
  { id: 5, name: "Bathroom Pipe Leak Fix", category: "Plumber", categoryId: 3, providerId: 3, provider: "AquaFlow Plumbing", price: 399, rating: 4.7, reviews: 103, duration: "1–2 Hours", status: "active",
    image: "https://picsum.photos/seed/plumber-1/640/480",
    description: "Identify and fix leaking pipes, joints and fittings in bathrooms and kitchens.",
    includes: ["Leak detection", "Pipe/joint replacement", "Pressure test", "Cleanup after work"],
    process: ["Book a slot", "Plumber inspects leak", "Repair carried out", "Pressure tested"] },
  { id: 6, name: "Water Tank Cleaning", category: "Plumber", categoryId: 3, providerId: 3, provider: "AquaFlow Plumbing", price: 599, rating: 4.6, reviews: 44, duration: "2 Hours", status: "active",
    image: "https://picsum.photos/seed/plumber-2/640/480",
    description: "Full drain, scrub and sanitisation of overhead or underground water tanks.",
    includes: ["Tank draining", "Scrubbing & sanitising", "Refill", "Water quality check"],
    process: ["Book a slot", "Tank drained", "Cleaned & sanitised", "Refilled & tested"] },
  { id: 7, name: "Full Home Deep Cleaning", category: "Cleaning", categoryId: 4, providerId: 4, provider: "ShineHome Cleaners", price: 1499, rating: 4.9, reviews: 210, duration: "4–5 Hours", status: "active",
    image: "https://picsum.photos/seed/cleaning-1/640/480",
    description: "Detailed deep cleaning covering kitchen, bathrooms, floors and living spaces with eco-friendly products.",
    includes: ["Kitchen deep clean", "Bathroom sanitisation", "Floor scrubbing", "Dusting & cobweb removal"],
    process: ["Book a slot", "Team arrives with supplies", "Room-by-room cleaning", "Final walkthrough"] },
  { id: 8, name: "Sofa & Carpet Shampooing", category: "Cleaning", categoryId: 4, providerId: 4, provider: "ShineHome Cleaners", price: 899, rating: 4.8, reviews: 76, duration: "2 Hours", status: "active",
    image: "https://picsum.photos/seed/cleaning-2/640/480",
    description: "Deep shampoo cleaning for sofas, carpets and upholstery to remove stains and odours.",
    includes: ["Stain treatment", "Shampoo wash", "Vacuum extraction", "Deodorising"],
    process: ["Book a slot", "Pre-treatment applied", "Deep shampoo wash", "Dried & finished"] },
  { id: 9, name: "Laptop Screen Replacement", category: "Computer Repair", categoryId: 5, providerId: 5, provider: "ByteFix Computers", price: 2499, rating: 4.5, reviews: 39, duration: "1–2 Hours", status: "active",
    image: "https://picsum.photos/seed/computer-1/640/480",
    description: "Genuine-quality screen replacement for laptops with cracked or malfunctioning displays.",
    includes: ["Diagnosis", "Screen replacement", "Display calibration", "90-day warranty"],
    process: ["Book a slot", "Technician diagnoses", "Screen replaced", "Tested & handed over"] },
  { id: 10, name: "PC Virus Removal & Tune-up", category: "Computer Repair", categoryId: 5, providerId: 5, provider: "ByteFix Computers", price: 599, rating: 4.6, reviews: 82, duration: "1 Hour", status: "active",
    image: "https://picsum.photos/seed/computer-2/640/480",
    description: "Full malware removal, software cleanup and performance tune-up for slow computers.",
    includes: ["Virus & malware scan", "Startup optimisation", "Software cleanup", "Performance report"],
    process: ["Book a slot", "Full system scan", "Cleanup & optimisation", "Performance verified"] },
  { id: 11, name: "Custom Bookshelf Installation", category: "Carpentry", categoryId: 6, providerId: 2, provider: "SparkFix Electricals", price: 1899, rating: 4.4, reviews: 22, duration: "3–4 Hours", status: "active",
    image: "https://picsum.photos/seed/carpentry-1/640/480",
    description: "Measured, cut and installed bookshelves tailored to your space and storage needs.",
    includes: ["Measurement & planning", "Material cutting", "Assembly & fitting", "Finishing touches"],
    process: ["Book a slot", "Site measurement", "Fabrication", "Installation & finishing"] },
  { id: 12, name: "Window AC Installation", category: "AC Repair", categoryId: 1, providerId: 1, provider: "CoolCare Services", price: 799, rating: 4.7, reviews: 55, duration: "1–2 Hours", status: "active",
    image: "https://picsum.photos/seed/ac-repair-3/640/480",
    description: "Professional installation of window AC units with secure mounting and leak-proof sealing.",
    includes: ["Unit mounting", "Electrical connection", "Sealing & insulation", "Cooling test"],
    process: ["Book a slot", "Unit positioned", "Installed & sealed", "Cooling tested"] }
];

const MOCK_USERS = [
  { id: 1, name: "Khushal Mehta", email: "khushal@example.com", phone: "+91 90000 12345", city: "Rajkot", pincode: "360001", address: "204, Sunrise Apartments, Kalawad Road", role: "customer", status: "active", registered: "2025-06-14" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", phone: "+91 90000 22345", city: "Ahmedabad", pincode: "380015", address: "12, Green Park Society", role: "customer", status: "active", registered: "2025-07-02" },
  { id: 3, name: "Rahul Verma", email: "rahul@example.com", phone: "+91 90000 32345", city: "Surat", pincode: "395007", address: "45, Vesu Heights", role: "customer", status: "blocked", registered: "2025-04-19" }
];

function seedIfMissing(key, value) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function seedMockData() {
  seedIfMissing("smartCategories", MOCK_CATEGORIES);
  seedIfMissing("smartServices", MOCK_SERVICES);
  seedIfMissing("smartProviders", MOCK_PROVIDERS);
  seedIfMissing("smartUsers", MOCK_USERS);

  seedIfMissing("smartBookings", [
    { id: "SS-20260918-1001", userId: 1, userName: "Khushal Mehta", serviceId: 1, serviceName: "AC Repair & Maintenance", providerId: 1, provider: "CoolCare Services", date: "2026-09-25", time: "10:00 AM", address: "204, Sunrise Apartments, Kalawad Road", city: "Rajkot", pincode: "360001", notes: "Please call before arriving.", price: 499, status: "approved", createdAt: "2026-09-18T09:12:00" },
    { id: "SS-20260910-1002", userId: 1, userName: "Khushal Mehta", serviceId: 7, serviceName: "Full Home Deep Cleaning", providerId: 4, provider: "ShineHome Cleaners", date: "2026-09-12", time: "09:00 AM", address: "204, Sunrise Apartments, Kalawad Road", city: "Rajkot", pincode: "360001", notes: "", price: 1499, status: "completed", createdAt: "2026-09-10T14:30:00" },
    { id: "SS-20260905-1003", userId: 1, userName: "Khushal Mehta", serviceId: 3, serviceName: "Home Wiring Inspection", providerId: 2, provider: "SparkFix Electricals", date: "2026-09-07", time: "02:00 PM", address: "204, Sunrise Apartments, Kalawad Road", city: "Rajkot", pincode: "360001", notes: "", price: 349, status: "cancelled", createdAt: "2026-09-05T11:00:00" },
    { id: "SS-20260830-1004", userId: 1, userName: "Khushal Mehta", serviceId: 9, serviceName: "Laptop Screen Replacement", providerId: 5, provider: "ByteFix Computers", date: "2026-09-02", time: "11:00 AM", address: "204, Sunrise Apartments, Kalawad Road", city: "Rajkot", pincode: "360001", notes: "", price: 2499, status: "completed", createdAt: "2026-08-30T08:45:00" },
    { id: "SS-20260920-1005", userId: 1, userName: "Khushal Mehta", serviceId: 5, serviceName: "Bathroom Pipe Leak Fix", providerId: 3, provider: "AquaFlow Plumbing", date: "2026-09-27", time: "04:00 PM", address: "204, Sunrise Apartments, Kalawad Road", city: "Rajkot", pincode: "360001", notes: "Leak is under the sink.", price: 399, status: "pending", createdAt: "2026-09-20T16:20:00" },
    { id: "SS-20260915-1006", userId: 2, userName: "Priya Sharma", serviceId: 1, serviceName: "AC Repair & Maintenance", providerId: 1, provider: "CoolCare Services", date: "2026-09-29", time: "01:00 PM", address: "12, Green Park Society", city: "Ahmedabad", pincode: "380015", notes: "", price: 499, status: "pending", createdAt: "2026-09-15T10:05:00" },
    { id: "SS-20260908-1007", userId: 2, userName: "Priya Sharma", serviceId: 7, serviceName: "Full Home Deep Cleaning", providerId: 4, provider: "ShineHome Cleaners", date: "2026-09-08", time: "09:00 AM", address: "12, Green Park Society", city: "Ahmedabad", pincode: "380015", notes: "", price: 1499, status: "completed", createdAt: "2026-09-08T07:40:00" }
  ]);

  seedIfMissing("smartReviews", [
    { id: 1, userId: 1, userName: "Khushal Mehta", serviceId: 1, serviceName: "AC Repair & Maintenance", rating: 5, text: "Booking my AC repair was incredibly simple. I found a professional, selected a convenient time and received confirmation within minutes.", date: "2026-09-13", status: "approved" },
    { id: 2, userId: 2, userName: "Priya Sharma", serviceId: 7, serviceName: "Full Home Deep Cleaning", rating: 5, text: "The cleaning team was thorough and punctual. My apartment has never looked better.", date: "2026-09-08", status: "approved" },
    { id: 3, userId: 3, userName: "Rahul Verma", serviceId: 3, serviceName: "Home Wiring Inspection", rating: 4, text: "Good service overall, the electrician explained every issue clearly before fixing it.", date: "2026-08-29", status: "approved" }
  ]);

  seedIfMissing("smartNotifications", [
    { id: 1, userId: 1, text: "Your AC Repair booking has been approved.", time: "2026-09-25T08:00:00", read: false, type: "success" },
    { id: 2, userId: 1, text: "Your Bathroom Pipe Leak Fix is scheduled for 27 September.", time: "2026-09-24T18:20:00", read: false, type: "info" },
    { id: 3, userId: 1, text: "Your Laptop Screen Replacement service has been completed.", time: "2026-09-02T15:40:00", read: true, type: "success" },
    { id: 4, userId: 1, text: "Your Home Wiring Inspection booking was cancelled.", time: "2026-09-05T12:10:00", read: true, type: "warning" }
  ]);

  seedIfMissing("smartProviderNotifications", [
    { id: 1, providerId: 1, text: "New booking request from Khushal Mehta for AC Repair & Maintenance.", time: "2026-09-18T09:12:00", read: true, type: "info" },
    { id: 2, providerId: 1, text: "New booking request from Priya Sharma for AC Repair & Maintenance.", time: "2026-09-15T10:05:00", read: false, type: "info" },
    { id: 3, providerId: 3, text: "New booking request from Khushal Mehta for Bathroom Pipe Leak Fix.", time: "2026-09-20T16:20:00", read: false, type: "info" },
    { id: 4, providerId: 4, text: "Your Full Home Deep Cleaning booking with Khushal Mehta was marked completed.", time: "2026-09-12T13:00:00", read: true, type: "success" }
  ]);

  seedIfMissing("smartWishlist", [
    { userId: 1, serviceId: 11 }
  ]);

  seedIfMissing("smartTheme", "light");
}

if (typeof window !== "undefined") {
  seedMockData();
}
