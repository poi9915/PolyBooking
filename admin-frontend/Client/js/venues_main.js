
// /Client/js/venue_main.js
let modalMode = "viewCourts";
// Biến toàn cục để lưu ID khu vực đang được chỉnh sửa trên trang Venue.
let currentVenueId = null;/**
 * Xử lý xác nhận xóa Venue trước khi gọi logic xóa chính thức.
 * @param {string} venueId - ID của Venue cần xóa.
 * @param {string} venueName - Tên của Venue (để hiển thị trong thông báo).
 */
async function handleDeleteVenueWithConfirmation(venueId, venueName) {
    if (!venueId) return;

    const confirmMessage =
        `❓ BẠN CÓ CHẮC CHẮN MUỐN XÓA Khu Vực "${venueName}" không?\n\n` +
        `⚠️ Thao tác này sẽ xóa VĨNH VIỄN Khu Vực này và TẤT CẢ SÂN thuộc khu vực đó.`;

    // Sử dụng hộp thoại confirm mặc định của trình duyệt
    if (confirm(confirmMessage)) {
        // Thực hiện xóa nếu người dùng xác nhận
        await deleteVenueAndCourts(venueId);
    }
}
/**
 * Reset / sạch form Venue khi mở chế độ Thêm Khu Vực
 */
function resetVenueForm() {
    const title = document.getElementById('venue-modal-title');
    const fieldset = document.getElementById('venue-details-fieldset');
    const courts = document.getElementById('court-list-in-modal-card');

    currentVenueId = null;
    modalMode = "addVenue";

    title.textContent = "Thêm Khu Vực Mới";

    fieldset.style.display = "block";
    courts.style.display = "none";

    document.getElementById('save-venue-details-btn').style.display = "inline-block";
}



// ===================================================================
// KHỞI TẠO VÀ LẮNG NGHE SỰ KIỆN CHÍNH
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Tải danh sách Venues khi trang Venue load
    loadVenues(); // Hàm này nằm trong venues_logic.js

    // Khởi tạo các event listener cho VENUE
    const addVenueButton = document.getElementById('add-venue-button');
    const venuesListTBody = document.getElementById('venues-list-tbody');
    const saveVenueButton = document.getElementById('save-venue-details-btn'); // Sử dụng nút "Lưu chi tiết Venue" để lưu
    const venueSelect = document.getElementById('venue-select');

    // 1. NÚT THÊM KHU VỰC MỚI
    if (addVenueButton) {
        addVenueButton.addEventListener("click", function () {
            modalMode = "addVenue";
            resetVenueForm();
            openVenueModal();
        });
    }

    // 2. LẮNG NGHE SỰ KIỆN CLICK TRÊN BẢNG VENUE (Sửa/Xóa)
    // 2. LẮNG NGHE SỰ KIỆN CLICK TRÊN BẢNG VENUE (Mở Modal Sửa/Xóa)
    if (venuesListTBody) {
        venuesListTBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr[data-id]');
            if (!row) return;

            const venueId = row.dataset.id;

            // ==============================
            // 1. NÚT XÓA
            // ==============================
            if (target.classList.contains('delete-venue-btn')) {
                handleDeleteVenueWithConfirmation(venueId, "");
                return;
            }

            // ==============================
            // 2. NÚT SỬA VENUE
            // ==============================
            if (target.classList.contains('edit-venue-btn')) {
                e.stopPropagation();
                modalMode = "editVenue";
                openVenueModal();
                loadVenueForEdit(venueId);
                return;
            }


            // ==============================
            // 3. CLICK VÀO ROW = MỞ DS SÂN
            // ==============================
            if (!target.classList.contains('action-btn')) {
                currentVenueId = venueId;
                modalMode = "viewCourts";
                openVenueModal();
                loadVenueCourtsOnly(venueId);
                return;
            }
        });
    }


    // 3. XỬ LÝ SỰ KIỆN CHỌN KHU VỰC TRÊN SELECT (Nếu có)
    if (venueSelect) {
        // Trên trang Venue này, ta sẽ dùng select để chọn Venue cần xem chi tiết
        venueSelect.addEventListener('change', (e) => {
            const venueId = e.target.value;
            if (venueId && venueId !== 'new_venue' && !isNaN(venueId)) {
                loadVenueDetails(venueId);
                currentVenueId = venueId;
            } else {
                // Reset form khi chọn 'Thêm Khu Vực Mới' (Nếu có option này)
                setupVenueForm('add');
            }
        });
    }

    // 4. NÚT LƯU (SỬA/TẠO MỚI) - ĐỔI TÊN HÀM LƯU TỪ court_main.js SANG venue_main.js
    if (saveVenueButton) {
        saveVenueButton.addEventListener('click', handleSaveVenue);
    }

    // // 5. NÚT THÊM SÂN VÀ SỬA/XÓA SÂN TRONG MODAL VENUE
    const courtListTBodyInModal = document.getElementById('courts-by-venue-tbody');
    const addCourtToVenueBtn = document.getElementById('add-court-to-venue-btn');
    const saveCourtButton = document.getElementById('save-court-details-btn');
    const clearCourtImageBtn = document.getElementById('clear-court-image-btn'); // Nút xóa ảnh Sân

    // Nút THÊM SÂN
    if (addCourtToVenueBtn) {
        addCourtToVenueBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            modalMode = "addCourt";

            openCourtModalForAdd();
        });
    }

    // CLICK SỬA/XÓA SÂN trong danh sách
    if (courtListTBodyInModal) {
        courtListTBodyInModal.addEventListener('click', (e) => {
            const target = e.target;
            const courtId = target.dataset.id;
            const venueId = addCourtToVenueBtn.dataset.venueId; // Lấy ID Venue cha

            if (target.classList.contains('edit-court-btn')) {
                loadCourtDetails(courtId); // Gọi hàm loadCourtDetails để mở form Sửa
                return;
            }

            if (target.classList.contains('delete-court-btn')) {
                // Gọi hàm deleteCourt đã tạo ở trên
                deleteCourt(courtId, venueId);
                return;
            }
        });
    }

    // NÚT LƯU SÂN (TẠO/SỬA)
    if (saveCourtButton) {
        saveCourtButton.addEventListener('click', handleSaveCourt);
    }

    // NÚT XÓA ẢNH SÂN
    if (clearCourtImageBtn) {
        clearCourtImageBtn.addEventListener('click', () => {
            document.getElementById('court-images-preview').innerHTML = '';
            document.getElementById('court-images-preview').dataset.currentUrls = '';
            document.getElementById('court-image-upload').value = '';
            clearCourtImageBtn.style.display = 'none';
            alert("Đã xóa ảnh hiện tại. Nhấn Lưu để áp dụng thay đổi này.");
        });
    }

    // Tải sidebar (nếu cần)
    const loadSliderBar = window.loadSliderBar;
    if (loadSliderBar) {
        loadSliderBar();
    }
});


// ===================================================================
// HÀM LƯU VENUE (TẠO/UPDATE) - CHUYỂN TỪ court_main.js SANG ĐÂY
// ===================================================================
async function handleSaveVenue(e) {
    e.preventDefault();

    const saveButton = document.getElementById('save-venue-details-btn');

    // 🛑 BƯỚC FIX LỖI: Kiểm tra xem nút có tồn tại không
    if (!saveButton) {
        console.error("Lỗi: Nút Lưu Khu Vực (ID: save-venue-details-btn) không tìm thấy.");
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = currentVenueId ? 'Đang Cập Nhật...' : 'Đang Tạo...';

    const venueName = document.getElementById('venue-name').value.trim();

    try {
        // 1. CHUẨN BỊ DỮ LIỆU
        const venueData = {
            name: venueName,
            address: document.getElementById('venue-address').value.trim(),
            province: document.getElementById('venue-country').value.trim(),
            surface: document.getElementById('venue-surface').value.trim(),
            // is_indoor: document.getElementById('venue-is-indoor').value === 'true',
            contact_email: document.getElementById('venue-contact-email').value.trim(),
            contact_phone: document.getElementById('venue-contact-phone').value.trim(),
        };

        if (!venueData.name || !venueData.address) {
            alert("Vui lòng nhập đầy đủ Tên và Địa chỉ Khu Vực.");
            return;
        }

        // 2. XỬ LÝ ẢNH (Giữ nguyên logic upload ảnh)
        const imageInput = document.getElementById('venue-image-upload');
        const currentUrls = document.getElementById('venue-images-preview').dataset.currentUrls;

        let newImageUrls = [];

        if (imageInput.files && imageInput.files.length > 0) {
            // Giả định hàm uploadFilesToSupabase có sẵn trong court_utils.js
            const uploadedUrls = await uploadFilesToSupabase(imageInput.files, 'venue_images/');
            if (uploadedUrls) {
                newImageUrls = uploadedUrls;
            }
        }

        let finalImageUrls = [];
        if (currentUrls) {
            let existingUrls = Array.isArray(currentUrls)
                ? currentUrls
                : currentUrls.split(',').map(u => u.trim()).filter(u => u.length > 0);
            finalImageUrls.push(...existingUrls);
        }
        finalImageUrls.push(...newImageUrls);

        venueData.images = finalImageUrls.length > 0 ? finalImageUrls : null;


        // 3. THỰC HIỆN LƯU VÀO SUPABASE
        if (currentVenueId) {
            // CHẾ ĐỘ CẬP NHẬT (UPDATE)
            const { error } = await supabaseClient
                .from('venues')
                .update(venueData)
                .eq('id', currentVenueId);

            if (error) throw error;

        } else {
            // CHẾ ĐỘ TẠO MỚI (INSERT)
            const { error } = await supabaseClient
                .from('venues')
                .insert([venueData]);

            if (error) throw error;
        }

        // 4. THÀNH CÔNG VÀ RESET
        alert(`✅ Khu Vực "${venueName}" đã được ${currentVenueId ? 'cập nhật' : 'tạo mới'} thành công!`);

        closeVenueModal();

        currentVenueId = null;
        loadVenues();

    } catch (error) {
        console.error("Lỗi khi Lưu/Cập nhật Khu Vực:", error.message);
        alert(`❌ Lỗi khi Lưu Khu Vực: ${error.message}`);
    } finally {
        // 🛑 BƯỚC FIX LỖI: Kiểm tra lại trong finally
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = currentVenueId ? 'Lưu Thay Đổi' : 'Tạo Khu Vực';
        }
    }

}
// /Client/js/venue_main.js (Bổ sung vào cuối file)

// ===================================================================
// HÀM LƯU SÂN (TẠO/UPDATE)
// ===================================================================
async function handleSaveCourt(e) {
    e.preventDefault();

    const saveButton = document.getElementById('save-court-details-btn');
    saveButton.disabled = true;

    const courtId = document.getElementById('current-court-id').value;
    const venueId = document.getElementById('court-venue-id').value;
    const isUpdate = !!courtId;

    saveButton.textContent = isUpdate ? 'Đang Cập Nhật...' : 'Đang Tạo...';

    try {
        // 1. CHUẨN BỊ DỮ LIỆU
        const courtName = document.getElementById('court-name').value.trim();

        if (!venueId || !courtName) {
            alert("Lỗi: Không tìm thấy ID Khu Vực hoặc Tên Sân bị trống.");
            return;
        }

        const courtData = {
            venue_id: venueId,
            name: courtName,
            code: document.getElementById('court-code').value.trim(),
            capacity: parseInt(document.getElementById('court-capacity').value),
            default_price_per_hour: parseInt(document.getElementById('court-price').value),
            is_active: document.getElementById('court-is-active').value === 'true',
        };

        // 2. XỬ LÝ ẢNH
        const imageInput = document.getElementById('court-image-upload');
        const currentUrls = document.getElementById('court-images-preview').dataset.currentUrls;

        let finalImageUrl = currentUrls; // Giữ nguyên URL cũ nếu không upload mới

        if (imageInput.files && imageInput.files.length > 0) {
            // Giả định hàm uploadFilesToSupabase có sẵn (trong court_utils.js)
            const uploadedUrls = await uploadFilesToSupabase(imageInput.files, 'court_images/');
            if (uploadedUrls && uploadedUrls.length > 0) {
                // Giả định Sân chỉ có 1 ảnh
                finalImageUrl = uploadedUrls[0];
            }
        }

        courtData.image_url = finalImageUrl;

        // 3. THỰC HIỆN LƯU VÀO SUPABASE
        if (isUpdate) {
            // CHẾ ĐỘ CẬP NHẬT (UPDATE)
            const { error } = await supabaseClient
                .from('courts')
                .update(courtData)
                .eq('id', courtId);

            if (error) throw error;

        } else {
            // CHẾ ĐỘ TẠO MỚI (INSERT)
            const { error } = await supabaseClient
                .from('courts')
                .insert([courtData]);

            if (error) throw error;
        }

        // 4. THÀNH CÔNG VÀ RESET
        alert(`✅ Sân "${courtName}" đã được ${isUpdate ? 'cập nhật' : 'tạo mới'} thành công!`);

        closeCourtModal();

        // Tải lại danh sách Sân trong Modal Venue
        await loadCourtsByVenue(venueId);

    } catch (error) {
        console.error("Lỗi khi Lưu/Cập nhật Sân:", error.message);
        alert(`❌ Lỗi khi Lưu Sân: ${error.message}`);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = isUpdate ? 'Lưu Thay Đổi' : 'Tạo Sân';
    }
}
