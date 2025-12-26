

// lay phan tu DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageElement = document.getElementById('message');

// hien thi thong bao
function displayMessage(text) {
    messageElement.textContent = text;
}
// Tạo hàm chuyển hướng mới
function handleManualRedirect(userRole) {
    if (userRole === 'admin') {
        window.location.href = 'court.html';
    } else if (userRole === 'employee') {
        window.location.href = 'staff_booking.html';
    } 
}

// -------------------------------------------------------------------
// 🔥 HÀM MỚI: Lấy vai trò (ROLE) của người dùng từ bảng super_users
// -------------------------------------------------------------------
// async function fetchUserRole(userId) {
//     // Truy vấn bảng 'super_users' (tên bảng bạn dùng để lưu vai trò)
//     const { data, error } = await supabaseClient
//         .from('super_users')
//         .select('role')
//         .eq('id', userId)
//         .single();

//     if (error || !data || !data.role) {
//         // Xử lý lỗi: Không tìm thấy vai trò (Chưa được gán thủ công)
//         displayMessage('Lỗi: Tài khoản chưa được gán vai trò. Vui lòng liên hệ Admin.');
//         // Bắt đăng xuất nếu không có vai trò
//         await supabaseClient.auth.signOut();
//         return;
//     }

//     const userRole = data.role;
//     // Lưu vai trò vào Local Storage để sử dụng trên các trang dashboard
//     localStorage.setItem('user_role', userRole);

//     // CHUYỂN HƯỚNG CÓ ĐIỀU KIỆN
//     if (userRole === 'admin') {
//         window.location.href = 'admin.html';
//     } else if (userRole === 'employee') {
//         // Chuyển hướng nhân viên đến trang dashboard riêng
//         window.location.href = 'staff_booking.html';
//     } 
// }

// -------------------------------------------------------------------
// 🔥 HÀM SIGN IN : Bắt đầu quá trình lấy vai trò
// -------------------------------------------------------------------
// Thay đổi hàm signIn
async function signIn(email, password) {
  displayMessage('Đang kiểm tra thông tin người dùng...');

  const { data: user, error } = await supabaseClient
    .from('super_users')
    .select('id, email, username, full_name, role, _venue_id')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !user) {
    displayMessage('Sai Email hoặc Mật khẩu');
    return;
  }

  // 🔥 LƯU DUY NHẤT 1 KEY
  localStorage.setItem("super_users", JSON.stringify(user));

  displayMessage("Đăng nhập thành công!");

  // 🔁 CHUYỂN HƯỚNG
  if (user.role === "admin") {
    window.location.href = "venues.html";   // hoặc admin.html
  } else {
    window.location.href = "staff_booking.html";
  }
}


// su kien lang nghe form (Giữ nguyên)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    displayMessage('Đang xử lý...');
    await signIn(email, password);
});

