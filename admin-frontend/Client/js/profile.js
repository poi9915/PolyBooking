function fetchAdminAccount() {
    const role = localStorage.getItem("user_role");
    const userId = localStorage.getItem("user_id");

    if (!role || !userId) {
        alert("Chưa đăng nhập");
        window.location.href = "login.html";
        return;
    }

    if (role !== "admin") {
        alert("Bạn không có quyền admin");
        window.location.href = "login.html";
        return;
    }

    loadAdminFromDB(userId);
}

async function loadAdminFromDB(userId) {
    const { data, error } = await supabaseClient
        .from("super_users")
        .select("email, username, role")
        .eq("id", userId)
        .single();

    if (error) {
        alert("Không tải được thông tin admin");
        return;
    }

    document.getElementById("admin-email").value = data.email;
    document.getElementById("admin-username").value = data.username;
    // document.querySelector(".profile-avatar").innerText =
    //     data.email.substring(0, 2).toUpperCase();
}

document.addEventListener("DOMContentLoaded", fetchAdminAccount);

async function changePassword() {
    const userId = localStorage.getItem("user_id");
    const oldPass = document.getElementById("old-password").value;
    const newPass = document.getElementById("new-password").value;

    if (!oldPass || !newPass) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if (newPass.length < 6) {
        alert("Mật khẩu mới phải ít nhất 6 ký tự");
        return;
    }

    // 1. Lấy mật khẩu cũ trong DB
    const { data: user, error } = await supabaseClient
        .from("super_users")
        .select("password")
        .eq("id", userId)
        .single();

    if (error || !user) {
        alert("Không xác thực được tài khoản");
        return;
    }

    // 2. Check mật khẩu cũ
    if (user.password !== oldPass) {
        alert("Mật khẩu cũ không đúng");
        return;
    }

    // 3. Update mật khẩu mới
    const { error: updateError } = await supabaseClient
        .from("super_users")
        .update({ password: newPass })
        .eq("id", userId);

    if (updateError) {
        alert("Đổi mật khẩu thất bại");
        return;
    }

    alert("Đổi mật khẩu thành công");
    logout();
}
async function resetPassword() {
    const email = document.getElementById("reset-email").value;
    const newPass = document.getElementById("reset-password").value;

    if (!email || !newPass) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if (newPass.length < 6) {
        alert("Mật khẩu phải ít nhất 6 ký tự");
        return;
    }

    const { data: user, error } = await supabaseClient
        .from("super_users")
        .select("id")
        .eq("email", email)
        .single();

    if (error || !user) {
        alert("Email không tồn tại");
        return;
    }

    await supabaseClient
        .from("super_users")
        .update({ password: newPass })
        .eq("id", user.id);

    alert("Đã đặt lại mật khẩu");
}
function logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");

    window.location.href = "login.html";
}
// =========================================
// BẮT SỰ KIỆN SAU KHI DOM LOAD
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    fetchAdminAccount();

    const changeDialog = document.getElementById("change-password-dialog");
    const resetDialog = document.getElementById("reset-password-dialog");

    // MỞ dialog đổi mật khẩu
    document.getElementById("change-password-btn")
        .addEventListener("click", () => {
            changeDialog.showModal();
        });

    // MỞ dialog quên mật khẩu
    // document.getElementById("reset-password-btn")
    //     .addEventListener("click", () => {
    //         resetDialog.showModal();
    //     });

    // SUBMIT
    document.getElementById("submit-change-password")
        .addEventListener("click", changePassword);

    // document.getElementById("submit-reset-password")
    //     .addEventListener("click", resetPassword);

    // LOGOUT
    document.getElementById("logout-btn")
        .addEventListener("click", logout);
});






