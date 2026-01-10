// supabase-booking.js — FULL: BẢNG THEO TÊN KHU (unique name)

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 JS START LOADING...");
  const SUPABASE_URL = "https://hsepwjxuiclhtkfroanq.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZXB3anh1aWNsaHRrZnJvYW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODQyODUsImV4cCI6MjA3OTE2MDI4NX0.rPQ0BP0xJr0IgesIykXclwFUnJ151kBjWgE4rL4F4ro";
  const TZ_SUFFIX = "+07:00";
  function calcDuration(startISO, endISO) {
    const diffMs = new Date(endISO) - new Date(startISO);
    if (diffMs <= 0) return { hours: 0, minutes: 0, totalHours: 0 };

    const totalMinutes = Math.round(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      hours,
      minutes,
      totalHours: totalMinutes / 60   // số giờ chính xác (vd: 1.42)
    };
  }
  let supabase;
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log(" Supabase initialized");
  } catch (err) {
    console.error(" Cannot initialize Supabase:", err);
    return;
  }

  // ------------ DOM ELEMENTS --------------
  const dateSelect = document.getElementById("date-select");
  const fieldFilter = document.getElementById("field-filter");
  const createBtn = document.querySelector(".create-btn");

  // NEW BOOKING
  const newModal = document.getElementById("newBookingModal");
  const newCustomer = document.getElementById("new-customer-name");
  const newPhone = document.getElementById("new-phone");
  const newDate = document.getElementById("new-date");
  const newKhu = document.getElementById("new-Khu");
  const newField = document.getElementById("new-field");
  const newStart = document.getElementById("new-start-time");
  const newEnd = document.getElementById("new-end-time");
  const newNotes = document.getElementById("new-notes");
  const closeNewModalBtn = document.getElementById("closeNewModalBtn");
  const submitNewBookingBtn = document.getElementById("submitNewBookingBtn");

  // EDIT MODAL
  const editModal = document.getElementById("editBookingModal");
  const editBookingId = document.getElementById("edit-booking-id");
  const editCustomer = document.getElementById("edit-customer-name");

  // ❗ FIX 1 — SAI ID → SỬA LẠI ĐÚNG
  const editPhone = document.getElementById("edit-phone");  // <-- fixed
  const editDate = document.getElementById("edit-date");
  const editKhu = document.getElementById("edit-Khu");
  const editField = document.getElementById("edit-field");
  const editStart = document.getElementById("edit-start-time");
  const editEnd = document.getElementById("edit-end-time");
  const editPriceInput = document.getElementById("edit-price");
  const editServicePriceInput = document.getElementById("edit-price-DV");
  const deleteBookingBtn = document.getElementById("deleteBookingBtn");
  const saveBookingBtn = document.getElementById("saveBookingBtn");
  const closeEditModalBtn = document.getElementById("closeEditModalBtn");

  // Multi-venue grid container
  let allVenuesContainer = document.getElementById("allVenuesContainer");
  const bookingGridContainer = document.getElementById("bookingGrid");
  if (!allVenuesContainer && bookingGridContainer) {
    allVenuesContainer = document.createElement("div");
    allVenuesContainer.id = "allVenuesContainer";
    bookingGridContainer.parentNode.replaceChild(allVenuesContainer, bookingGridContainer);
  }

  // ------------ STATE --------------
  let venues = [];
  let courts = [];
  let bookings = [];
  let editingBooking = null;
  let isLoadingBookings = false;
  let selectedServices = [];
  // ------------ HELPERS --------------
  const toISOWithTZ = (d, t) => `${d}T${t}:00${TZ_SUFFIX}`;
  const toRange = (s, e) => `[${s},${e})`;
  function getCurrentStaff() {
    const raw = localStorage.getItem("super_users");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function getCustomerInfo(booking) {
    // ✅ Booking từ app
    if (booking.user_id && booking.profiles) {
      return {
        name: booking.profiles.username || "Khách app",
        phone: booking.profiles.phone || "",
        email: booking.profiles.email || "",
        source: "app"
      };
    }

    // ✅ Booking do nhân viên tạo
    return {
      name: booking.metadata?.customer_name || "Khách lẻ",
      phone: booking.metadata?.phone || "",
      email: "",
      source: "staff"
    };
  }

  const CURRENT_STAFF = getCurrentStaff();
  if (!CURRENT_STAFF) {
    window.location.href = "login.html";
    throw new Error("Not logged in");
  }

  const STAFF_ROLE = CURRENT_STAFF?.role || "employee";
  const STAFF_VENUE_ID = CURRENT_STAFF?._venue_id || null;
  console.log("👤 STAFF:", CURRENT_STAFF);

  function parseDuring(val) {
    if (!val) return null;
    const m = val.match(/^\[(.*?),(.*?)\)$/);
    if (!m) return null;
    return { start: m[1] || null, end: m[2] || null };
  }

  function hhmmFromISO(iso) {
    if (!iso || typeof iso !== "string") return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function yyyyMMddFromISO(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));

  // ------------ TIME OPTIONS --------------
  const HOURS = [
    "06:00", "07:00", "08:00", "09:00", "10:00",
    "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00",
    "21:00", "22:00"
  ];

  newStart.addEventListener("change", () => {
    if (newEnd.value && newEnd.value <= newStart.value) {
      newEnd.value = "";
    }
  });

  editStart.addEventListener("change", () => {
    if (editEnd.value && editEnd.value <= editStart.value) {
      editEnd.value = "";
    }
  });

  // ------------ GRID HELPERS --------------
  function buildCourtColumns(ids) {
    const map = {};
    ids.forEach((id, idx) => (map[id] = idx + 2));
    return map;
  }

  function computeGridRows(startISO, endISO) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const gridStartHour = 6;
    const baseRow = 2;
    const startHour = start.getHours();
    const endHour = end.getHours();
    const startRow = baseRow + (startHour - gridStartHour);
    let span = (endHour - startHour) + 1;
    if (end.getMinutes() === 0) {
      span = (endHour - startHour) + 1;
    }
    const endRow = startRow + span;
    return { startRow, endRow };
  }

  function buildDynamicGrid(courtsToShow, targetGrid) {
    if (!targetGrid) return;
    targetGrid.innerHTML = "";
    targetGrid.style.display = "grid";
    targetGrid.style.gridTemplateColumns = `120px repeat(${courtsToShow.length}, 1fr)`;
    targetGrid.style.gridTemplateRows = `50px repeat(${HOURS.length}, 50px)`;
    targetGrid.style.gap = "6px";
    const head = document.createElement("div");
    head.className = "header-cell";
    head.innerText = "Giờ";
    head.style.gridColumn = "1";
    head.style.gridRow = "1";
    targetGrid.appendChild(head);
    courtsToShow.forEach((c, idx) => {
      const col = document.createElement("div");
      col.className = "header-cell";
      col.innerText = c.name;
      col.style.gridColumn = String(idx + 2);
      col.style.gridRow = "1";
      targetGrid.appendChild(col);
    });
    HOURS.forEach((h, idx) => {
      const t = document.createElement("div");
      t.className = "time-slot";
      t.innerText = h;
      t.style.gridColumn = "1";
      t.style.gridRow = String(idx + 2);
      targetGrid.appendChild(t);
      courtsToShow.forEach((c, colIdx) => {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.dataset.courtId = c.id;
        cell.style.gridColumn = String(colIdx + 2);
        cell.style.gridRow = String(idx + 2);
        targetGrid.appendChild(cell);
      });
    });
  }
  function isTimeWithinOpeningHours(timeStr) {
    if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return false;

    const [h, m] = timeStr.split(":").map(Number);
    const totalMinutes = h * 60 + m;

    const OPEN = 6 * 60;    // 06:00
    const CLOSE = 22 * 60; // 22:00

    return totalMinutes >= OPEN && totalMinutes <= CLOSE;
  }
  function instantOpeningHourCheck(input) {
    if (!input.value || !/^\d{2}:\d{2}$/.test(input.value)) return;

    if (!isTimeWithinOpeningHours(input.value)) {
      alert("⛔ Giờ hoạt động của sân: 06:00 – 22:00");
      input.value = "";
    }
  }

  [newStart, newEnd, editStart, editEnd].forEach(el => {
    if (!el) return;
    el.addEventListener("blur", () => instantOpeningHourCheck(el));
  });

  // ------------ LOAD VENUES --------------
  async function loadVenues() {
    let query = supabase
      .from("venues")
      .select("id,name")
      .eq("is_active", true);
    // ❗ Nhân viên → chỉ xem khu của mình
    if (STAFF_ROLE === "employee" && STAFF_VENUE_ID) {
      query = query.eq("id", STAFF_VENUE_ID);
    }
    const { data, error } = await query.order("id");
    if (error) {
      console.error("❌ LOAD VENUES ERROR:", error);
      venues = [];
      return;
    }
    venues = data || [];
    console.log("🏟️ VENUES LOADED:", venues);
    // Dropdown khu (tạo / sửa)
    [newKhu, editKhu].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = `<option value="">-- Chọn khu --</option>`;
      venues.forEach(v => {
        const o = document.createElement("option");
        o.value = v.id;
        o.textContent = v.name;
        sel.appendChild(o);
      });
    });
  }

  function populateCourtFilter() {
    if (!fieldFilter) return;
    fieldFilter.innerHTML = `<option value="all">Tất cả sân</option>`;
    courts.forEach(c => {
      const venue = venues.find(v => v.id === c.venue_id);
      const o = document.createElement("option");
      o.value = c.id; // 👈 lọc theo court_id
      o.textContent = c.name;
      fieldFilter.appendChild(o);
    });
  }

  // ------------ LOAD COURTS --------------
  async function loadCourts() {
    let query = supabase
      .from("courts")
      .select("id,name,venue_id,default_price_per_hour,is_active")
      .eq("is_active", true);
    // ❗ Nhân viên → chỉ load sân trong khu của mình
    if (STAFF_ROLE === "employee" && STAFF_VENUE_ID) {
      query = query.eq("venue_id", STAFF_VENUE_ID);
    }
    const { data, error } = await query.order("name");
    if (error) {
      console.error("❌ LOAD COURTS ERROR:", error);
      courts = [];
      return;
    }
    courts = data || [];
    console.log("⚽ COURTS LOADED:", courts);
    populateCourtFilter();
    renderBookingGrid();
  }

  // ------------ LOAD BOOKINGS --------------
  async function loadBookingsForDate(dateStr) {
    if (isLoadingBookings) return;
    isLoadingBookings = true;
    const dayStart = `${dateStr}T00:00:00+07:00`;
    const dayEnd = `${dateStr}T23:59:59+07:00`;
    const dayRange = `[${dayStart},${dayEnd})`;
    let q = supabase
      .from("bookings")
      .select(`
    id,
    user_id,
    court_id,
    during,
    status,
    price,
    metadata,
    created_at,
    profiles (
      id,
      username,
      phone,
      email,
      avatar_url
    )
  `)
      .overlaps("during", dayRange);
    // 🔐 PHÂN QUYỀN EMPLOYEE
    if (STAFF_ROLE === "employee") {
      const courtIds = courts
        .filter(c => c.venue_id === STAFF_VENUE_ID)
        .map(c => c.id);
      // ❗ KHÔNG CÓ SÂN → KHÔNG QUERY
      if (courtIds.length === 0) {
        bookings = [];
        isLoadingBookings = false;
        renderBookingGrid();
        return;
      }
      q = q.in("court_id", courtIds);
    }
    const { data, error } = await q.order("created_at", { ascending: true });
    isLoadingBookings = false;
    if (error) {
      console.error("❌ LOAD BOOKINGS ERROR:", error);
      bookings = [];
      return;
    }
    bookings = data || [];
    renderBookingGrid();
  }

  // ------------ RENDER BOOKINGS --------------
  function renderBookingGrid() {
    if (!allVenuesContainer) return;
    allVenuesContainer.innerHTML = "";
    const selectedCourtId =
      fieldFilter && fieldFilter.value !== "all"
        ? Number(fieldFilter.value)
        : null;
    const nameToVenues = {};
    venues.forEach(v => {
      if (!nameToVenues[v.name]) nameToVenues[v.name] = [];
      nameToVenues[v.name].push(v);
    });
    const names = Object.keys(nameToVenues);
    names.forEach(name => {

      const venueRows = nameToVenues[name];
      const venueIds = venueRows.map(r => r.id);
      let courtsInName = courts.filter(c =>
        venueIds.includes(c.venue_id)
      );
      if (selectedCourtId) {
        courtsInName = courtsInName.filter(c => c.id === selectedCourtId);
      }
      if (courtsInName.length === 0) return;
      const section = document.createElement("section");
      section.className = "booking-grid-container card";
      section.style.marginBottom = "24px";
      section.style.padding = "12px";
      const title = document.createElement("h3");
      title.innerText = `Khu: ${name}`;
      section.appendChild(title);
      const grid = document.createElement("div");
      grid.className = "booking-grid";
      grid.id = `grid-${name.replace(/\s+/g, "-")}`;
      section.appendChild(grid);
      allVenuesContainer.appendChild(section);
      buildDynamicGrid(courtsInName, grid);
      const colMap = buildCourtColumns(courtsInName.map(c => c.id));
      bookings.forEach(b => {
        if (!b || !b.court_id) return;
        const belongs = courtsInName.find(c => c.id === b.court_id);
        if (!belongs) return;
        const parsed = parseDuring(b.during);
        if (!parsed || !parsed.start || !parsed.end) return;
        const { startRow, endRow } = computeGridRows(parsed.start, parsed.end);
        const col = colMap[b.court_id];
        if (!col) return;
        const block = document.createElement("div");
        block.className = "booking-block";
        block.style.gridColumn = col;
        block.style.gridRow = `${startRow} / ${endRow}`;
        let bg = "#4CAF50";          // default (pending)
        if (b.status === "confirmed") bg = "#2196F3";
        if (b.status === "paid") bg = "#9C27B0";
        if (b.status === "checked_in_completed") bg = "#FF9800"; // cam: đã check-in
        if (b.status === "cancelled") bg = "#9E9E9E";
        block.style.background = bg;
        block.style.color = "#fff";
        block.style.padding = "6px";
        block.style.borderRadius = "6px";
        block.style.cursor = "pointer";
        block.title = `ID: ${b.id}`;
        const customer = getCustomerInfo(b);
        const nameLabel = customer.name;
        const label = `${hhmmFromISO(parsed.start)} - ${hhmmFromISO(parsed.end)}`;
        block.innerHTML = `<strong>${escapeHtml(nameLabel)}</strong><br><small>${label}</small>`;
        block.addEventListener("click", () => openEditModal(b));
        grid.appendChild(block);
      });
    });
    if (!allVenuesContainer.children.length) {
      const hint = document.createElement("div");
      hint.className = "card";
      hint.style.padding = "12px";
      hint.innerText = "Không có khu để hiển thị theo lựa chọn hiện tại.";
      allVenuesContainer.appendChild(hint);
    }
  }

  // ------------ CHECK CONFLICT --------------
  async function checkConflict(courtId, startISO, endISO, excludeId = null) {
    let q = supabase
      .from("bookings")
      .select("id,status")
      .eq("court_id", courtId)
      .overlaps("during", `[${startISO},${endISO})`);

    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q;
    return (data || []).some(b => b.status !== "cancelled");
  }

  // ------------ POPULATE FIELDS BY KHU --------------
  async function populateFieldsForKhu(khuSel, fieldSel) {
    if (!fieldSel) return;
    fieldSel.innerHTML = "";
    if (!khuSel || !khuSel.value) {
      fieldSel.innerHTML = `<option value="">-- Chọn sân --</option>`;
      updateNewBookingPrice(); // 🔥 reset tiền
      return;
    }
    const list = courts.filter(c => String(c.venue_id) === String(khuSel.value));
    if (list.length === 0) {
      fieldSel.innerHTML = `<option>-- Không có sân --</option>`;
      updateNewBookingPrice();
      return;
    }
    list.forEach(c => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.name;
      o.dataset.price = c.default_price_per_hour;
      fieldSel.appendChild(o);
    });
    // ✅ AUTO CHỌN SÂN ĐẦU TIÊN
    fieldSel.value = list[0].id;
    // ✅ TÍNH TIỀN NGAY
    updateNewBookingPrice();
  }

  // =====================================================
  // AUTO CALC PAYMENT
  // =====================================================
  function updateNewBookingPrice() {
    const durLabel = document.getElementById("calculated-duration");
    const pricePerHourLabel = document.getElementById("price-per-hour");
    const serviceLabel = document.getElementById("price-dichvu");
    const totalLabel = document.getElementById("calculated-total");

    const start = newStart?.value;
    const end = newEnd?.value;
    const courtId = Number(newField?.value);
    const date = newDate?.value;

    if (!start || !end || end <= start || !courtId || !date) {
      durLabel.innerText = "--- giờ";
      pricePerHourLabel.innerText = "--- VND";
      serviceLabel.innerText = "--- VND";
      totalLabel.innerText = "--- VND";
      return;
    }
    const court = courts.find(c => c.id === courtId);
    if (!court) return;
    const startISO = toISOWithTZ(date, start);
    const endISO = toISOWithTZ(date, end);
    const duration = calcDuration(startISO, endISO);
    const courtPrice = court.default_price_per_hour || 0;
    const courtTotal = Math.round(duration.totalHours * courtPrice);
    // 🔹 TÍNH DỊCH VỤ
    const serviceTotal = selectedServices.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0
    );
    const grandTotal = courtTotal + serviceTotal;
    // hiển thị đúng giờ + phút
    durLabel.innerText =
      duration.minutes > 0
        ? `${duration.hours} giờ ${duration.minutes} phút`
        : `${duration.hours} giờ`;
    pricePerHourLabel.innerText = courtTotal.toLocaleString("vi-VN") + " VND";
    serviceLabel.innerText = serviceTotal.toLocaleString("vi-VN") + " VND";
    totalLabel.innerText = grandTotal.toLocaleString("vi-VN") + " VND";
  }

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================
  function openEditModal(b) {
    editingBooking = b;
    const parsed = parseDuring(b.during);
    if (!parsed) return;

    editBookingId.value = b.id;

    // =========================
    // 👤 XÁC ĐỊNH NGƯỜI ĐẶT
    // =========================
    let customerName = "";
    let customerPhone = "";
    let isAppCustomer = false;

    // ✅ KHÁCH ĐẶT QUA APP
    if (b.user_id && b.profiles) {
      customerName = b.profiles.username || "";
      customerPhone = b.profiles.phone || "";
      isAppCustomer = true;
    }
    // ✅ KHÁCH DO NHÂN VIÊN TẠO
    else {
      customerName = b.metadata?.customer_name || "";
      customerPhone = b.metadata?.phone || "";
    }

    editCustomer.value = customerName;
    editPhone.value = customerPhone;
    // 🔒 KHÓA EDIT nếu là khách app
    editCustomer.readOnly = isAppCustomer;
    editPhone.readOnly = isAppCustomer;
    // =========================
    // ⏱ THỜI GIAN & SÂN
    // =========================
    editDate.value = yyyyMMddFromISO(parsed.start);
    const startTime = hhmmFromISO(parsed.start); // vd: 08:17
    const endTime = hhmmFromISO(parsed.end);   // vd: 09:42

    editStart.value = startTime;
    editEnd.value = endTime;

    const court = courts.find(c => c.id === b.court_id);
    if (court) {
      editKhu.value = court.venue_id;
      populateFieldsForKhu(editKhu, editField).then(() => {
        editField.value = court.id;
      });
    }

    // =========================
    // 💰 GIÁ & DỊCH VỤ
    // =========================
    editPriceInput.value = Number(b.price || 0);
    editModal.style.display = "flex";
    loadBookingServices(b.id);
    const checkInBtn = document.getElementById("checkInBtn");
    if (checkInBtn) {
      checkInBtn.innerText = "✔️ Check-in";
      checkInBtn.style.background = "#4CAF50";
      checkInBtn.style.color = "#fff";
    }
  }

  // =====================================================
  // SAVE EDIT
  // =====================================================
  [editStart, editEnd, editField].forEach(el => {
    if (!el) return;
    el.addEventListener("change", () => {
      const date = editDate.value;
      const start = editStart.value;
      const end = editEnd.value;
      const courtId = Number(editField.value);
      if (!date || !start || !end || end <= start || !courtId) return;
      const court = courts.find(c => c.id === courtId);
      const pricePerHour = court?.default_price_per_hour || 0;
      const startISO = toISOWithTZ(date, start);
      const endISO = toISOWithTZ(date, end);
      const duration = calcDuration(startISO, endISO);
      const totalHours = duration.totalHours;
      const courtTotal = Math.round(totalHours * pricePerHour);
      const serviceTotal = selectedServices.reduce(
        (sum, s) => sum + s.price * s.quantity,
        0
      );
      editPriceInput.value = courtTotal;           // 💰 sân
      editServicePriceInput.value = serviceTotal; // 🧾 dịch vụ
    });
  });

  async function saveEditedBooking() {
    if (!editingBooking) return;

    const id = editingBooking.id;
    const date = editDate.value;
    const start = editStart.value;
    const end = editEnd.value;
    const courtId = Number(editField.value);

    if (!date || !start || !end || end <= start)
      return alert("Thời gian không hợp lệ");

    if (
      !isTimeWithinOpeningHours(start) ||
      !isTimeWithinOpeningHours(end)
    ) {
      return alert("⛔ Sân mở cửa từ 06:00 đến 22:00");
    }

    const startISO = toISOWithTZ(date, start);
    const endISO = toISOWithTZ(date, end);

    if (await checkConflict(courtId, startISO, endISO, id))
      return alert("Khung giờ đã có người đặt!");

    const court = courts.find(c => c.id === courtId);
    const pricePerHour = court?.default_price_per_hour || 0;
    const duration = calcDuration(startISO, endISO);
    const hours = duration.totalHours;
    const courtTotal = Math.round(hours * pricePerHour);
    const serviceTotal = selectedServices.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0
    );
    const grandTotal = courtTotal + serviceTotal;

    // 1️⃣ UPDATE BOOKING
    const { error } = await supabase
      .from("bookings")
      .update({
        during: `[${startISO},${endISO})`,
        court_id: courtId,
        price: grandTotal,
        metadata: {
          customer_name: editCustomer.value,
          phone: editPhone.value.trim(),
          notes: editingBooking.metadata?.notes ?? "",
          has_services: selectedServices.length > 0
        }
      })
      .eq("id", id);

    if (error) return alert("Lỗi lưu booking: " + error.message);

    // 2️⃣ XOÁ TOÀN BỘ DỊCH VỤ CŨ
    await supabase
      .from("booking_services")
      .delete()
      .eq("booking_id", id);

    // 3️⃣ INSERT LẠI DỊCH VỤ MỚI
    if (selectedServices.length > 0) {
      const rows = selectedServices.map(s => ({
        booking_id: id,
        service_id: s.service_id,
        quantity: s.quantity,
        price_snapshot: s.price
      }));

      const { error: serviceErr } = await supabase
        .from("booking_services")
        .insert(rows);

      if (serviceErr)
        return alert("Lỗi lưu dịch vụ: " + serviceErr.message);
    }

    alert("🎉 Cập nhật đơn & dịch vụ thành công!");
    editModal.style.display = "none";

    // 🔥 FIX FULL
    editingBooking = null;
    selectedServices = [];

    dateSelect.value = date;
    await loadBookingsForDate(date);
    renderBookingGrid();

  }

  async function loadBookingServices(bookingId) {
    const { data, error } = await supabase
      .from("booking_services")
      .select("service_id, quantity, price_snapshot, services(name)")
      .eq("booking_id", bookingId);

    if (error) {
      console.error(error);
      selectedServices = [];
      return;
    }

    selectedServices = (data || []).map(d => ({
      service_id: d.service_id,
      name: d.services.name,
      quantity: d.quantity,
      price: d.price_snapshot
    }));
    renderServiceTable();
  }


  // =====================================================
  // DELETE BOOKING
  // =====================================================
  async function deleteBooking() {
    if (!editingBooking) return;
    if (!confirm("Xóa lịch đặt này?")) return;

    await supabase
      .from("booking_services")
      .delete()
      .eq("booking_id", editingBooking.id);

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", editingBooking.id);

    if (error) return alert("Lỗi khi xóa: " + error.message);

    // 🔥 FIX QUAN TRỌNG
    editingBooking = null;
    selectedServices = [];
    renderServiceTable();

    alert("🗑️ Đã xóa đơn đặt sân");
    editModal.style.display = "none";
    await loadBookingsForDate(dateSelect.value);
  }

  // =====================================================
  // CHECK-IN
  // =====================================================
  async function checkInBookingStaff() {
    if (!editingBooking) return;
    if (editingBooking.status === "checked_in_completed") {
      return alert("⛔ Đơn này đã check-in rồi");
    }
    if (!confirm("Xác nhận check-in thủ công?")) return;
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "checked_in_completed"
      })
      .eq("id", editingBooking.id);

    if (error) {
      alert("❌ Lỗi check-in: " + error.message);
      return;
    }

    alert("🎉 Đã check-in sân!");
    editModal.style.display = "none";
    await loadBookingsForDate(dateSelect.value);
  }

  // =====================================================
  // QR CHECK-IN FLOW (APP / KHÁCH)
  // =====================================================
  const btnQrCheckin = document.getElementById("btnQrCheckin");
  const qrModal = document.getElementById("qrModal");
  const closeQrBtn = document.getElementById("closeQrBtn");

  btnQrCheckin.addEventListener("click", () => {
    openQrCheckInModal(); // ✅ dùng flow QR đã có
  });

  async function handleCheckinByQr(bookingId) {
    const { error } = await supabase
      .from("bookings")
      .update({
        checked_in: true,
        checkin_time: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (error) {
      alert("❌ Check-in thất bại");
      console.error(error);
      return;
    }

    alert("✅ Check-in thành công");

    await loadBookings(); // reload bảng
  }

  const qrModalEl = document.getElementById("qrModal");
  const closeQrModalBtn = document.getElementById("closeQrBtn");
  const qrReaderElId = "qr-reader";
  let html5QrCode = null;
  if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener("click", closeQrCheckInModal);
  }

  async function openQrCheckInModal() {
    qrModalEl.style.display = "flex";
    // ⏱️ đợi DOM render
    await new Promise(r => setTimeout(r, 300));
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("qr-reader");
    }

    try {
      // Xin quyền camera trước
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        alert("❌ Không tìm thấy camera");
        closeQrCheckInModal();
        return;
      }

      await html5QrCode.start(
        cameras[0].id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onQrScanSuccess
      );

    } catch (err) {
      console.error("❌ CAMERA ERROR:", err);
      alert(
        "❌ Không thể mở camera.\n" +
        "👉 Hãy dùng điện thoại hoặc máy có webcam."
      );
      closeQrCheckInModal();
    }
  }

  async function closeQrCheckInModal() {
    try {
      if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
        await html5QrCode.clear();
      }
    } catch (e) {
      console.warn("QR stop ignored:", e.message);
    }
    qrModalEl.style.display = "none";
  }


  // =====================================================
  // QR SCAN SUCCESS
  // =====================================================
  let lastQrText = null;
  async function onQrScanSuccess(decodedText) {
    try {
      // chống quét lặp
      if (!decodedText || decodedText === lastQrText) return;
      lastQrText = decodedText;
      console.log("📷 QR DATA:", decodedText);

      let bookingId = null;

      // 1️⃣ QR là JSON
      try {
        const parsed = JSON.parse(decodedText);
        bookingId = parsed.booking_id;
      } catch { }

      // 2️⃣ QR là số (ID)
      if (!bookingId && /^\d+$/.test(decodedText)) {
        bookingId = Number(decodedText);
      }

      // 3️⃣ QR dạng BOOKING:123
      if (!bookingId && decodedText.startsWith("BOOKING:")) {
        bookingId = Number(decodedText.replace("BOOKING:", ""));
      }

      // 4️⃣ QR là URL có booking_id
      if (!bookingId && decodedText.includes("booking_id=")) {
        const url = new URL(decodedText);
        bookingId = Number(url.searchParams.get("booking_id"));
      }

      // ❌ không parse ra được ID
      if (!bookingId || isNaN(bookingId)) {
        alert("❌ QR không hợp lệ");
        return;
      }

      const res = await fetch(
        "https://hsepwjxuiclhtkfroanq.supabase.co/functions/v1/qr-checkin-booking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: bookingId })
        }
      );

      const result = await res.json();
      console.log("✅ QR CHECK-IN RESULT:", result);

      if (!res.ok || !result.success) {
        alert(result.message || "❌ Check-in thất bại");
        return;
      }

      alert("🎉 Check-in QR thành công!");
      // ❌ KHÔNG stop camera ở đây
      // ✅ CHỈ GỌI ĐÓNG MODAL
      await closeQrCheckInModal();
      // ❌ đóng bảng tạo / sửa sân
      editModal.style.display = "none";
      // 🧹 reset state
      editingBooking = null;
      selectedServices = [];
      lastQrText = null;
      // 🔄 load lại dữ liệu booking
      await loadBookingsForDate(dateSelect.value);
      // ⚡ render lại grid (phòng trường hợp async)
      renderBookingGrid();

    } catch (err) {
      console.error("❌ QR CHECK-IN ERROR:", err);
      alert("Lỗi check-in QR");
    }
  }

  // =====================================================
  // CREATE NEW BOOKING
  // =====================================================
  async function createNewBooking() {
    const customer = newCustomer.value.trim();
    const phone = newPhone.value;
    const date = newDate.value;
    const start = newStart.value;
    const end = newEnd.value;
    const courtId = Number(newField.value);

    if (!customer) return alert("Vui lòng nhập tên khách");
    if (!date || !phone || !start || !end || end <= start)
      return alert("Thời gian không hợp lệ");

    if (
      !isTimeWithinOpeningHours(start) ||
      !isTimeWithinOpeningHours(end)
    ) {
      return alert("⛔ Sân mở cửa từ 06:00 đến 22:00");
    }
    if (!courtId) return alert("Chưa chọn sân");

    const startISO = toISOWithTZ(date, start);
    const endISO = toISOWithTZ(date, end);

    if (await checkConflict(courtId, startISO, endISO))
      return alert("Khung giờ đã có người khác đặt!");

    const court = courts.find(c => c.id === courtId);
    const pricePerHour = court.default_price_per_hour || 0;
    const duration = calcDuration(startISO, endISO);
    const courtTotal = Math.round(duration.totalHours * pricePerHour);

    // ✅ TÍNH TIỀN DỊCH VỤ
    const serviceTotal = selectedServices.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0
    );

    const grandTotal = courtTotal + serviceTotal;

    // 1️⃣ TẠO BOOKING
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        court_id: courtId,
        during: `[${startISO},${endISO})`,
        price: grandTotal,
        status: "pending",
        metadata: {
          customer_name: customer,
          phone: phone.trim(),
          notes: newNotes.value.trim() || "",
          has_services: selectedServices.length > 0
        }
      })
      .select()
      .single();

    if (error) return alert("❌ Lỗi tạo đơn: " + error.message);

    // 2️⃣ LƯU DỊCH VỤ
    if (selectedServices.length > 0) {
      const rows = selectedServices.map(s => ({
        booking_id: booking.id,
        service_id: s.service_id,
        quantity: s.quantity,
        price_snapshot: s.price
      }));

      const { error: serviceErr } = await supabase
        .from("booking_services")
        .insert(rows);

      if (serviceErr) {
        console.error(serviceErr);
        alert("⚠️ Đơn tạo thành công nhưng lỗi lưu dịch vụ");
      }
    }

    alert("🎉 Đặt đơn thành công!");
    selectedServices = [];
    renderServiceTable();
    resetNewBookingForm();
    newModal.style.display = "none";
    // 🔥 LOAD LẠI ĐƠN NGAY
    dateSelect.value = date;          // sync ngày đang xem
    await loadBookingsForDate(date);  // reload DB
    renderBookingGrid();              // render lại grid
  }

  // =====================================================
  // Dịch vụ
  // =====================================================
  async function loadServicesByVenue(venueId) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("venue_id", venueId)
      .eq("is_active", true);
    if (error) {
      console.error(error);
      return [];
    }
    return data;
  }
  const serviceModal = document.getElementById("serviceModal");
  const serviceModalBody = document.getElementById("serviceModalBody");
  const closeServiceModalBtn = document.getElementById("closeServiceModalBtn");
  document.getElementById("submitNewdichvuBooking").onclick = async () => {
    const venueId = newKhu.value;
    if (!venueId) return alert("Vui lòng chọn khu trước");
    const services = await loadServicesByVenue(venueId);
    if (!services.length) {
      serviceModalBody.innerHTML =
        `<tr><td colspan="3">Không có dịch vụ</td></tr>`;
    } else {
      serviceModalBody.innerHTML = "";
      services.forEach(service => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${service.name}</td>
        <td>${service.price.toLocaleString()} đ</td>
        <td>
          <button class="btn btn-sm btn-primary">
            Thêm
          </button>
        </td>
      `;
        tr.querySelector("button").onclick = () => {
          addServiceToBooking(service);
        };
        serviceModalBody.appendChild(tr);
      });
    }
    serviceModal.style.display = "flex";
  };
  function addServiceToBooking(service) {
    const existed = selectedServices.find(
      s => s.service_id === service.id
    );
    if (existed) {
      existed.quantity += 1;
    } else {
      selectedServices.push({
        service_id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1
      });
    }
    renderServiceTable();
    serviceModal.style.display = "none";
  }
  function renderServiceTable() {
    const isEdit = !!editingBooking;

    const tbody = isEdit
      ? document.getElementById("serviceTableBodyEdit")
      : document.getElementById("serviceTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    selectedServices.forEach((s, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${s.name}</td>
      <td>
        <input type="number" min="1" value="${s.quantity}"
          onchange="updateServiceQty(${index}, this.value)">
      </td>
      <td>${(s.price * s.quantity).toLocaleString()} đ</td>
      <td>
        <button class="btn btn-sm btn-danger"
          onclick="removeService(${index})">✕</button>
      </td>
    `;
      tbody.appendChild(tr);
    });

    // 🔥 FIX QUAN TRỌNG
    if (isEdit) {
      updateEditBookingPrice();
    } else {
      updateNewBookingPrice();
    }
  }
  window.updateServiceQty = (index, qty) => {
    selectedServices[index].quantity = parseInt(qty);
    renderServiceTable();
  };
  window.removeService = (index) => {
    selectedServices.splice(index, 1);
    renderServiceTable();
  };
  if (closeServiceModalBtn) {
    closeServiceModalBtn.onclick = () => {
      serviceModal.style.display = "none";
    };
  }
  const addServiceEditBtn = document.getElementById("addServiceEditBtn");
  if (addServiceEditBtn) {
    addServiceEditBtn.onclick = async () => {
      const venueId = editKhu.value;
      if (!venueId) return alert("Vui lòng chọn khu trước");
      const services = await loadServicesByVenue(venueId);
      serviceModalBody.innerHTML = "";
      services.forEach(service => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${service.name}</td>
        <td>${service.price.toLocaleString()} đ</td>
        <td>
          <button class="btn btn-sm btn-primary">Thêm</button>
        </td>
      `;
        tr.querySelector("button").onclick = () => {
          addServiceToBooking(service);
        };
        serviceModalBody.appendChild(tr);
      });

      serviceModal.style.display = "flex";
    };
  }

  // =======================================
  // updateEditBookingPrice
  // =======================================
  function updateEditBookingPrice() {
    if (!editingBooking) return;

    const date = editDate.value;
    const start = editStart.value;
    const end = editEnd.value;
    const courtId = Number(editField.value);

    if (!date || !start || !end || end <= start || !courtId) return;

    const court = courts.find(c => c.id === courtId);
    if (!court) return;

    const startISO = toISOWithTZ(date, start);
    const endISO = toISOWithTZ(date, end);

    const hours =
      (new Date(endISO) - new Date(startISO)) / 3600000;
    // =====================
    // 💰 TIỀN SÂN
    // =====================
    const courtTotal = Math.round(
      hours * (court.default_price_per_hour || 0)
    );
    // =====================
    // 🧾 TIỀN DỊCH VỤ
    // =====================
    const serviceTotal = selectedServices.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0
    );
    // =====================
    // ✅ HIỂN THỊ RIÊNG
    // =====================
    editPriceInput.value = courtTotal;           // Giá sân
    editServicePriceInput.value = serviceTotal; // Giá dịch vụ
  }

  // =====================================================
  // EVENTS
  // =====================================================
  if (createBtn) createBtn.addEventListener("click", () => {
    resetNewBookingForm();
    // 🔥 FIX
    editingBooking = null;
    selectedServices = [];
    renderServiceTable();
    const today = new Date().toISOString().slice(0, 10);
    newDate.value = today;
    // 🔥 GIỜ MẶC ĐỊNH
    newStart.value = "06:00";
    newEnd.value = "06:00";
    newModal.style.display = "flex";
    updateNewBookingPrice();
  });
  if (closeNewModalBtn) closeNewModalBtn.addEventListener("click", () => newModal.style.display = "none");
  if (closeEditModalBtn)
    closeEditModalBtn.addEventListener("click", () => {
      editingBooking = null;
      selectedServices = [];
      renderServiceTable();
      editModal.style.display = "none";
    });
  if (newKhu) newKhu.addEventListener("change", () => populateFieldsForKhu(newKhu, newField));
  if (editKhu) editKhu.addEventListener("change", () => populateFieldsForKhu(editKhu, editField));
  if (submitNewBookingBtn) submitNewBookingBtn.addEventListener("click", createNewBooking);
  if (saveBookingBtn) saveBookingBtn.addEventListener("click", saveEditedBooking);
  if (deleteBookingBtn) deleteBookingBtn.addEventListener("click", deleteBooking);
  if (newStart) newStart.addEventListener("change", updateNewBookingPrice);
  if (newEnd) newEnd.addEventListener("change", updateNewBookingPrice);
  if (newField) newField.addEventListener("change", updateNewBookingPrice);
  if (newDate) newDate.addEventListener("change", updateNewBookingPrice); // ✅ FIX

  if (fieldFilter) {
    fieldFilter.addEventListener("change", () => {
      renderBookingGrid();
    });
  }

  if (dateSelect) {
    dateSelect.addEventListener("change", () => {
      loadBookingsForDate(dateSelect.value);
    });
  }

  const checkInBtn = document.getElementById("checkInBtn");
  if (checkInBtn) {
    checkInBtn.onclick = async () => {
      if (!editingBooking) return;

      if (editingBooking.status === "checked_in_completed") {
        return alert("⛔ Đơn này đã check-in rồi");
      }

      // ✅ GIỐNG HỆT CHECK-IN NHÂN VIÊN
      await checkInBookingStaff();
    };
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  // populateTimeSelects();
  await loadVenues();
  await loadCourts();
  const today = new Date().toISOString().slice(0, 10);
  if (dateSelect) dateSelect.value = today;
  if (newDate) newDate.value = today;
  await loadBookingsForDate(today);
  console.log("✅ FULL INITIAL LOAD COMPLETE");
  function displayLoggedUser() {
    const el = document.getElementById("userName");
    if (!el) return;

    if (!CURRENT_STAFF) {
      el.innerText = "Nhân viên";
      return;
    }
    el.innerText =
      CURRENT_STAFF.full_name ||
      CURRENT_STAFF.username ||
      CURRENT_STAFF.email;
  }
  displayLoggedUser();

  function resetNewBookingForm() {
    newCustomer.value = "";
    newPhone.value = "";
    newNotes.value = "";

    // reset thời gian
    newStart.value = "06:00";
    newEnd.value = "06:00";

    // reset khu & sân
    newKhu.value = "";
    newField.innerHTML = `<option value="">-- Chọn sân --</option>`;
    // reset dịch vụ
    selectedServices = [];
    renderServiceTable();
  }

  /* ============================
     ĐĂNG XUẤT
     ============================ */
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("super_users");
      console.log("✅ Logged out");
      window.location.href = "login.html";
    });
  }
});
