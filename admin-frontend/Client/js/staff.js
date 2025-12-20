// =========================================
// TẢI DANH SÁCH NHÂN VIÊN
// =========================================

async function fetchStaffList() {
    const { data, error } = await supabaseClient
        .from("super_users")
        .select(`
            id,
            username,
            email,
            role,
            password,
            _venue_id,
            venues:_venue_id ( name, address )
        `)
        .eq("role", "employee")
        .order("id");

    if (error) {
        console.error("Lỗi tải staff:", error.message);
        return;
    }

    renderStaffList(data);
}

function renderStaffList(list) {
    const tbody = document.getElementById("staff-list-tbody");
    tbody.innerHTML = "";

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">Chưa có nhân viên</td></tr>`;
        return;
    }

    list.forEach((s, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${s.username}</td>
                <td>${s.email}</td>
                <td>${s.role ==='employee' ? "Nhân viên" : s.role  }</td>
                <td>${s.venues?.name || "Chưa gán"}</td>
                <td>${s.venues?.address || "---"}</td>
                <td>
                    <button class="edit-staff-btn" data-id="${s.id}">Sửa</button>
                    <button class="delete-staff-btn" data-id="${s.id}">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// =========================================
// MODAL & LOGIC
// =========================================

const modal = document.getElementById("staff-modal");
const saveBtn = document.getElementById("modal-save-btn");
const cancelBtn = document.getElementById("modal-cancel-btn");

let editingId = null;
let oldPassword = "";

// =========================================
// Tải danh sách khu vực
// =========================================

async function loadVenues() {
    const { data } = await supabaseClient
        .from("venues")
        .select("id, name, address");

    const select = document.getElementById("modal-staff-venue");
    select.innerHTML = `<option value="">-- Chọn khu vực --</option>`;

    data.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.id;
        opt.innerText = `${v.name} (${v.address})`;
        select.appendChild(opt);
    });
}

// =========================================
// MỞ MODAL - THÊM NHÂN VIÊN
// =========================================

document.getElementById("add-staff-button").addEventListener("click", async () => {
    editingId = null;

    document.getElementById("staff-modal-title").innerText = "Thêm Nhân viên";
    document.getElementById("modal-staff-name").value = "";
    document.getElementById("modal-staff-email").value = "";
    document.getElementById("modal-staff-password").value = "";
    document.getElementById("modal-staff-role").value = "employee";

    await loadVenues();

    modal.showModal();
});

// =========================================
// CLICK SỬA NHÂN VIÊN
// =========================================

document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("edit-staff-btn")) return;

    editingId = e.target.dataset.id;

    const { data, error } = await supabaseClient
        .from("super_users")
        .select("*")
        .eq("id", editingId)
        .single();

    if (error) return console.error(error);

    oldPassword = data.password || "";

    document.getElementById("staff-modal-title").innerText = "Sửa Nhân viên";
    document.getElementById("modal-staff-name").value = data.username;
    document.getElementById("modal-staff-email").value = data.email;
    document.getElementById("modal-staff-password").value = data.password;
    document.getElementById("modal-staff-role").value = data.role;

    await loadVenues();
    document.getElementById("modal-staff-venue").value = data._venue_id;

    modal.showModal();
});

// =========================================
// NÚT LƯU (THÊM HOẶC SỬA)
// =========================================

saveBtn.addEventListener("click", async () => {
    const name = document.getElementById("modal-staff-name").value;
    const email = document.getElementById("modal-staff-email").value;
    const pass = document.getElementById("modal-staff-password").value;
    const role = document.getElementById("modal-staff-role").value;
    const venue = document.getElementById("modal-staff-venue").value;

    if (!name || !email || !role || !venue) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // ---------------------------
    // THÊM NHÂN VIÊN
    // ---------------------------
    if (editingId === null) {
        if (!pass || pass.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        const { error } = await supabaseClient
            .from("super_users")
            .insert({
                id: crypto.randomUUID(),
                username: name,
                email: email,
                password: pass,
                role: role,
                _venue_id: venue
            });

        if (error) alert(error.message);
        else alert("Đã thêm nhân viên!");
    }
    // ---------------------------
    // SỬA NHÂN VIÊN
    // ---------------------------
    else {
        const payload = {
            username: name,
            email: email,
            role: role,
            _venue_id: venue
        };

        // nếu người dùng nhập mật khẩu mới
        if (pass.trim() !== "") {
            if (pass.trim().length < 6) {
                alert("Mật khẩu mới phải ít nhất 6 ký tự!");
                return;
            }
            payload.password = pass;
        } else {
            // giữ nguyên mật khẩu cũ
            payload.password = oldPassword;
        }

        const { error } = await supabaseClient
            .from("super_users")
            .update(payload)
            .eq("id", editingId);

        if (error) alert(error.message);
        else alert("Đã cập nhật nhân viên!");
    }

    modal.close();
    fetchStaffList();
});

// =========================================
// NÚT HỦY
// =========================================

cancelBtn.addEventListener("click", () => modal.close());

// =========================================
// XÓA NHÂN VIÊN
// =========================================

document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-staff-btn")) return;

    if (!confirm("Bạn có chắc muốn xoá nhân viên này?")) return;

    const id = e.target.dataset.id;

    await supabaseClient.from("super_users").delete().eq("id", id);

    fetchStaffList();
});

// =========================================
// KHỞI TẠO
// =========================================

document.addEventListener("DOMContentLoaded", fetchStaffList);
