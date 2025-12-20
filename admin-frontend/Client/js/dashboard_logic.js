

function checkAdminAccess() {
    const role = localStorage.getItem('user_role');

    // Nếu không có role hoặc role KHÔNG phải là 'admin', chặn truy cập
    if (role !== 'admin') {
        // Xóa thông tin cũ và chuyển hướng về trang đăng nhập
        localStorage.removeItem('user_role');
        window.location.href = 'staff_booking.html';
    }
}

// ===================================================================
// 1. HÀM LẤY DỮ LIỆU TỪ SUPABASE
// ===================================================================
async function fetchStaffList() {
    // Chỉ chọn những cột cần hiển thị và lọc
    const { data: staffs, error } = await supabaseClient
        .from('super_users')
        .select('id, full_name, role, email, username');

    if (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error.message);
        document.getElementById('admin-message').textContent = ` Lỗi tải dữ liệu: ${error.message}`;
        document.getElementById('admin-message').style.color = 'red';
        return;
    }

    renderStaffList(staffs);
}

// ===================================================================
// 2. HÀM RENDER (HIỂN THỊ) DANH SÁCH
// ===================================================================
function renderStaffList(staffs) {
    const tbody = document.getElementById('staff-list-tbody');
    tbody.innerHTML = ''; // Xóa các hàng mẫu (placeholder)

    if (!staffs || staffs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Chưa có nhân viên nào được thêm.</td></tr>';
        return;
    }

    staffs.forEach(staff => {
        // Ánh xạ Role thành Vị trí hiển thị
        const positionDisplay = staff.role === 'admin' ? 'Quản trị viên' :
            staff.role === 'employee' ? 'Nhân viên (Staff)' :
                staff.role;

        // Giả định trạng thái dựa trên việc tài khoản tồn tại
        const statusDisplay = staff.role ? 'Đang làm việc' : 'Không hoạt động';
        const statusClass = staff.role ? 'status-active' : 'status-inactive';

        // Placeholder cho Lương (Cần sửa nếu có cột lương thực tế)
        const salaryPlaceholder = staff.role === 'admin' ? '...' : '7,000,000₫';

        const row = `
            <tr data-id="${staff.id}">
                <td>${staff.id.substring(0, 8)}...</td> 
                <td>${staff.full_name || staff.email}</td>
                <td>${positionDisplay}</td>
                <td>${salaryPlaceholder}</td>
                <td class="${statusClass}">${statusDisplay}</td>
                <button class="action-btn edit-btn" data-id="${staff.id}">Sửa</button>
                <button class="action-btn delete-btn" data-id="${staff.id}">Xóa</button>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}


// Lấy phần tử DOM cho các form
const staffDetailCard = document.getElementById('staff-detail-card'); // Form Sửa/Chi tiết
const addStaffCard = document.getElementById('add-staff-card');       // Form Thêm mới
const addStaffButton = document.getElementById('add-staff-button');   // Nút Thêm Nhân Viên Mới

// Lấy phần tử DOM cho Form Thêm Tài khoản
const staffNameInput = document.getElementById('staff-namenew');     //  BỔ SUNG: Lấy Input Tên
const staffEmailInput = document.getElementById('staff-email');
const staffPasswordInput = document.getElementById('staff-password');
const staffRoleSelect = document.getElementById('staff-role-new');
const adminMessageElement = document.getElementById('admin-message');
const addStaffForm = document.getElementById('add-staff-form');


// -------------------------------------------------------------------
// 3. PHẦN XỬ LÝ TẠO TÀI KHOẢN (SIGN UP & GÁN ROLE)
// -------------------------------------------------------------------
// async function handleAddStaff(e) {
//     e.preventDefault();

//     // Lấy dữ liệu từ form
//     const fullName = staffNameInput.value.trim(); 
//     const email = staffEmailInput.value.trim().toLowerCase();
//     const password = staffPasswordInput.value;
//     const role = staffRoleSelect.value;

//     // Tạo username (Giả định: tên không dấu, không khoảng trắng)
//     const username = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, ''); 

//     adminMessageElement.textContent = 'Đang tạo tài khoản... Vui lòng chờ.';
//     adminMessageElement.style.color = 'orange';

//     // 1. TẠO TÀI KHOẢN AUTH (Supabase Auth)
//     const { data: authData, error: authError } = await supabaseClient.auth.signUp({
//         email: email,
//         password: password,
//         options: {
//             data: { full_name: fullName }, 
//             emailRedirectTo: null // Không dùng email verify
//         }
//     });

//     if (authError) {
//         adminMessageElement.textContent = ` Lỗi tạo tài khoản: ${authError.message}`;
//         adminMessageElement.style.color = 'red';
//         return;
//     }

//     const newUserId = authData.user.id;

//     // 2. CHÈN VAI TRÒ VÀO BẢNG super_users (Sử dụng RLS INSERT Admin)
//     //  SỬA: Bổ sung 3 trường NOT NULL (full_name, email, username)
//     const { error: profileError } = await supabaseClient
//         .from('super_users') 
//         .insert([{ 
//             id: newUserId, 
//             role: role,
//             full_name: fullName, 
//             email: email, 
//             username: username 
//         }]);

//     if (profileError) {
//         adminMessageElement.textContent = ` Lỗi gán Role: ${profileError.message}. Kiểm tra RLS INSERT cho Admin.`;
//         adminMessageElement.style.color = 'red';
//         // (Trong môi trường thực tế, nên xóa tài khoản Auth nếu gán role thất bại)
//         return;
//     }

//     // THÀNH CÔNG
//     adminMessageElement.textContent = ` Tạo tài khoản ${email} (${role}) thành công!`;
//     adminMessageElement.style.color = 'green';

//     addStaffForm.reset();

//     //  GỌI HÀM LÀM MỚI DANH SÁCH
//     fetchStaffList(); 
// }

/**
* Lấy chi tiết nhân viên từ ID và điền vào form sửa.
* @param {string} employeeId - ID (UUID) của nhân viên.
*/
async function loadEmployeeDetails(employeeId) {
    // Ẩn thông báo cũ
    adminMessageElement.textContent = 'Đang tải chi tiết...';
    adminMessageElement.style.color = 'orange';

    const { data, error } = await supabaseClient
        .from('super_users')
        .select('id, full_name, role, email, username')
        .eq('id', employeeId)
        .single();

    if (error) {
        adminMessageElement.textContent = ` Lỗi tải chi tiết: ${error.message}`;
        adminMessageElement.style.color = 'red';
        console.error('Lỗi khi tải chi tiết nhân viên:', error);
        return;
    }

    // Đổ dữ liệu vào các trường trong Form Sửa (Giả sử Form Sửa có các ID tương ứng)

    //  LƯU ID VÀO FORM (Dùng để biết bản ghi nào cần cập nhật khi submit)
    document.getElementById('edit-form').dataset.employeeId = data.id;

    // Đổ dữ liệu vào các input
    document.getElementById('staff-id-detail').value = data.id.substring(0, 8) + '...'; // Chỉ hiển thị ID rút gọn
    document.getElementById('staff-name-detail').value = data.full_name || '';
    document.getElementById('staff-email-detail').value = data.email || '';
    document.getElementById('staff-username-detail').value = data.username || '';
    document.getElementById('staff-role-detail').value = data.role || '';

    adminMessageElement.textContent = 'Chi tiết đã được tải. Sẵn sàng chỉnh sửa.';
    adminMessageElement.style.color = 'blue';
}


// Hàm Xử lý Xóa nhân viên
async function handleDeleteEmployee(employeeId) {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân viên ID ${employeeId.substring(0, 8)}...? Thao tác này không thể hoàn tác.`)) {
        return;
    }

    adminMessageElement.textContent = 'Đang xóa nhân viên...';
    adminMessageElement.style.color = 'orange';

    try {
        // GỌI HÀM XÓA ĐÃ ĐỊNH NGHĨA
        await deleteEmployee(employeeId);

        adminMessageElement.textContent = ` Xóa nhân viên ID ${employeeId.substring(0, 8)}... thành công!`;
        adminMessageElement.style.color = 'green';

        // Làm mới danh sách
        fetchStaffList();

    } catch (e) {
        adminMessageElement.textContent = ` Lỗi xóa: ${e.message}`;
        adminMessageElement.style.color = 'red';
    }
}
// Hàm Xử lý Form Sửa
async function handleUpdateStaff(e) {
    e.preventDefault();

    const editForm = document.getElementById('edit-form');
    const employeeId = editForm.dataset.employeeId;

    if (!employeeId) {
        adminMessageElement.textContent = ' Lỗi: Không tìm thấy ID nhân viên để cập nhật.';
        adminMessageElement.style.color = 'red';
        return;
    }

    // Lấy dữ liệu mới từ form
    const updates = {
        full_name: document.getElementById('staff-name-detail').value.trim(),
        email: document.getElementById('staff-email-detail').value.trim().toLowerCase(),
        username: document.getElementById('staff-username-detail').value.trim(),
        role: document.getElementById('staff-role-detail').value,
        // Không cập nhật password ở đây! Cập nhật password cần API riêng
    };

    adminMessageElement.textContent = 'Đang cập nhật nhân viên...';
    adminMessageElement.style.color = 'orange';

    try {
        // GỌI HÀM CẬP NHẬT ĐÃ ĐỊNH NGHĨA Ở DƯỚI DOMContentLoaded
        await updateEmployee(employeeId, updates);

        adminMessageElement.textContent = ` Cập nhật nhân viên ID ${employeeId.substring(0, 8)}... thành công!`;
        adminMessageElement.style.color = 'green';

        // Làm mới danh sách
        fetchStaffList();

    } catch (e) {
        adminMessageElement.textContent = ` Lỗi cập nhật: ${e.message}`;
        adminMessageElement.style.color = 'red';
    }
}
/**
 * Cập nhật thông tin nhân viên trong bảng 'super_users'.
 * @param {string} employeeId - ID của nhân viên cần cập nhật.
 * @param {object} updates - Object chứa các trường cần thay đổi.
 */
const updateEmployee = async (employeeId, updates) => {
    const { data, error } = await supabase
        .from('super_users')
        .update(updates)
        .eq('id', employeeId)
        .select();

    if (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error.message);
        throw error;
    }

    console.log('Cập nhật nhân viên thành công:', data);
    return data;
};

// Hàm Xóa (nên định nghĩa luôn ở đây)
const deleteEmployee = async (employeeId) => {
    const { error } = await supabase
        .from('super_users')
        .delete()
        .eq('id', employeeId);

    if (error) {
        console.error('Lỗi khi xóa nhân viên:', error.message);
        throw error;
    }
    return true;
};



// -------------------------------------------------------------------
// 4. XỬ LÝ CÁC SỰ KIỆN TRÊN DOM
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Bắt buộc kiểm tra quyền truy cập và tải danh sách
    checkAdminAccess();
    fetchStaffList();

    // 2. Thiết lập sự kiện cho nút Thêm Nhân viên
    // addStaffButton.addEventListener('click', () => {
    //     // Ẩn Form Sửa/Chi tiết
    //     if (staffDetailCard) {
    //         staffDetailCard.style.display = 'none';
    //     }
    //     // Hiện Form Thêm mới
    //     if (addStaffCard) {
    //         addStaffCard.style.display = 'block';
    //     }
    // });
    // ------------------------------------------------------------------
    const editForm = document.getElementById('edit-form'); //  Giả sử Form Sửa có ID là 'edit-form'
    // 3. Thiết lập sự kiện cho các nút 'Sửa' và 'xóa'
    const staffListTable = document.getElementById('staff-list-table');
    if (staffListTable) {
        staffListTable.addEventListener('click', (e) => {
            const target = e.target;
            const employeeId = target.dataset.id;

            if (!employeeId) return;

            if (target.classList.contains('edit-btn')) {
                // Ẩn Form Thêm mới và Hiện Form Sửa
                if (addStaffCard) { addStaffCard.style.display = 'none'; }
                if (staffDetailCard) { staffDetailCard.style.display = 'block'; }

                //  GỌI HÀM TẢI DỮ LIỆU
                loadEmployeeDetails(employeeId);
            } else if (target.classList.contains('delete-btn')) {
                //  GỌI HÀM XỬ LÝ XÓA
                handleDeleteEmployee(employeeId);
            }
        });
    }

    // 4. Thiết lập sự kiện cho Form Sửa
    if (editForm) {
        editForm.addEventListener('submit', handleUpdateStaff); //  GỌI HÀM XỬ LÝ CẬP NHẬT
    }

    // 4. Xử lý Form Thêm Tài khoản
    if (addStaffForm) {
        addStaffForm.addEventListener('submit', handleAddStaff);
    }
});