// // ===================================================================
// // THIẾT LẬP FORM (ADD/EDIT)
// // ===================================================================
// function setupCourtForm(mode = 'add', data = null) { // data là Court object
//     const title = document.querySelector('#court-edit-card h3');
//     const saveButton = document.getElementById('save-court-details-btn');
//     const venueFieldset = document.getElementById('venue-details-fieldset');
//     const courtFieldset = document.getElementById('court-details-fieldset');
//     // 🛑 Thêm kiểm tra Null cho các phần tử chính của form Court
//     if (!title || !saveButton || !courtFieldset) {
//         // Nếu form Court không tồn tại (vì đang ở trang Venue), thoát
//         return; 
//     }

//     currentCourtId = (mode === 'edit' && data) ? data.id : null;

//     courtFieldset.style.display = 'block';
//     courtFieldset.disabled = false;

//     // Reset inputs Sân
//     document.getElementById('field-name').value = '';
//     document.getElementById('field-code').value = '';
//     document.getElementById('field-capacity').value = '2';
//     document.getElementById('field-status').value = 'active';
//     document.getElementById('default-price-input').value = 0;

//     // Reset ảnh Sân (Court) - Input type="file"
//     const courtImageInput = document.getElementById('court-image-upload');
//     if (courtImageInput) courtImageInput.value = '';
//     renderImagePreview(null, 'court-image-preview');


//     if (mode === 'add') {
//         currentCourtId = null;
//         title.textContent = " Thêm Sân Mới";
//         saveButton.textContent = " Tạo Sân";

//         // Reset Venue select box và kích hoạt listener change
//         document.getElementById('venue-select').value = ''; 
//         document.getElementById('venue-select').dispatchEvent(new Event('change')); // Kích hoạt listener

//         document.getElementById('court-edit-card').style.display = 'block';
//         loadVenueDetailsToForm(null); // Clear form Venue

//     } else if (mode === 'edit' && data) { // Edit Court
//         title.textContent = `Chỉnh Sửa Sân: ${data.name}`;
//         saveButton.textContent = "Lưu Cập Nhật Sân";
        
//         // Khi Edit, Venue Fieldset bị khóa (chỉ xem)
//         toggleVenueFields(true); 
//         document.getElementById('venue-select').disabled = false; // Select box luôn bật
//         venueFieldset.querySelector('legend').textContent = 'Chi tiết Khu Vực (Chỉ xem)';
        
//         document.getElementById('court-edit-card').style.display = 'block';
//     }
// }

// // ===================================================================
// // TẢI DỮ LIỆU SÂN VÀO FORM SỬA
// // ===================================================================
// async function loadCourtDetails(courtId) {
//     const { data: court, error: courtError } = await supabaseClient
//         .from('courts')
//         .select(`*, 
//                  venues (
//                     id, name, address, surface, is_indoor, images, contact_email, contact_phone, province, rating
//                  )
//                 `)
//         .eq('id', courtId)
//         .single();

//     if (courtError) {
//         console.error('Lỗi khi tải chi tiết sân:', courtError.message);
//         return;
//     }

//     setupCourtForm('edit', court);

//     // --- Đổ dữ liệu SÂN (COURT) ---
//     document.getElementById('field-name').value = court.name || '';
//     document.getElementById('field-code').value = court.code || '';
//     document.getElementById('field-capacity').value = court.capacity ? court.capacity.toString() : '2';
//     document.getElementById('field-status').value = court.is_active ? 'active' : 'maintenance';
//     document.getElementById('default-price-input').value = court.default_price_per_hour || 0;

//     // Ảnh Sân - Hiển thị ảnh
//     renderImagePreview(court.image_url, 'court-image-preview');


//     // Đổ dữ liệu Venue ID
//     document.getElementById('venue-select').value = court.venue_id || '';

//     // --- Đổ dữ liệu CHI TIẾT VENUE (JOINED) ---
//     if (court.venues) {
//         loadVenueDetailsToForm(court.venues); 
//         // Đảm bảo sau khi load xong, Venue Fieldset bị khóa (chỉ xem)
//         document.getElementById('venue-details-fieldset').querySelector('legend').textContent = 'Chi tiết Khu Vực (Chỉ xem)';
//     } else {
//         loadVenueDetailsToForm(null); 
//     }
// }

// // ===================================================================
// // TẢI VÀ RENDER DANH SÁCH SÂN
// // ===================================================================
// // /Client/js/courts_logic.js

// // ===================================================================
// // TẢI VÀ RENDER DANH SÁCH SÂN (CÓ THÊM BỘ LỌC)
// // ===================================================================
// async function fetchCourtsList(venueId = null) { // 🚨 THÊM THAM SỐ venueId
//     // 1. Khởi tạo truy vấn
//     let query = supabaseClient
//         .from('courts')
//         .select(`
//             id, name, code, capacity, default_price_per_hour, is_active, image_url, 
//             venues (id, name, address, surface, is_indoor, province) 
//         `);

//     // 2. Áp dụng bộ lọc Venue ID
//     if (venueId) {
//         query = query.eq('venue_id', venueId);
//     }
    
//     // 3. Thực thi truy vấn
//     const { data: courts, error } = await query;

//     if (error) {
//         console.error("Lỗi khi tải danh sách sân:", error.message);
//         return [];
//     }

//     renderCourtsList(courts);
// }

// // ===================================================================
// // RENDER DANH SÁCH (HIỂN THỊ)
// // ===================================================================
// function renderCourtsList(courts) {
//     const tbody = document.getElementById('courts-list-tbody');
//     tbody.innerHTML = '';
//     if (!tbody) {
//         // Nếu không có bảng sân trên trang (ví dụ: đang ở trang Venue), thoát
//         return; 
//     }

//     if (!courts || courts.length === 0) {
//         tbody.innerHTML = '<tr><td colspan="8">Chưa có sân nào được tạo.</td></tr>';
//         return;
//     }

//     courts.forEach(court => {
//         const isActive = court.is_active || false;
//         const statusDisplay = isActive ? 'Hoạt động' : 'Tạm dừng/Bảo trì';
//         const statusClass = isActive ? 'status-active' : 'status-maintenance';

//         const price = new Intl.NumberFormat('vi-VN').format(court.default_price_per_hour || 0);

//         const venueId = court.venues ? court.venues.id : null;
//         const venueName = (court.venues && court.venues.name) ? court.venues.name : 'N/A';
//         const venueProvinceOrCity = (court.venues && court.venues.province) ? court.venues.province : 'N/A';
//         const venueSurface = (court.venues && court.venues.surface) ? court.venues.surface : 'N/A';
//         const isIndoor = (court.venues && court.venues.is_indoor) ? court.venues.is_indoor : false;
//         const indoorDisplay = isIndoor ? 'Trong Nhà' : 'Ngoài Trời';


//         const row = `
//             <tr data-id="${court.id}" data-venue-id="${venueId}" class="${isActive ? 'field-active' : 'field-inactive'}">
//                 <td>${court.code || 'N/A'}</td> 
//                 <td>${court.name}</td>
//                 <td>${venueName} (${venueProvinceOrCity})</td> 
//                 <td>${court.capacity || 'N/A'} người</td> 
//                 <td>${venueSurface} / ${indoorDisplay}</td>
//                 <td class="${statusClass}">${statusDisplay}</td>
//                 <td>${price}</td> 
//                 <td>
//                     <button class="action-btn edit-court-btn" data-id="${court.id}">Sửa Sân</button>
//                     <button class="action-btn delete-court-btn" data-id="${court.id}">Xóa Sân</button>
//                 </td>
//             </tr>
//         `;
//         tbody.insertAdjacentHTML('beforeend', row);
//     });
// }

// // ===================================================================
// // HÀM XỬ LÝ XÓA SÂN
// // ===================================================================
// async function handleDeleteCourt(courtId) {
//     if (!confirm(`Bạn có chắc chắn muốn XÓA SÂN ID: ${courtId} không? Thao tác này không thể hoàn tác.`)) {
//         return;
//     }

//     const { error: deleteError } = await supabaseClient
//         .from('courts')
//         .delete()
//         .eq('id', courtId);

//     if (deleteError) {
//         alert(` Lỗi xóa Sân: ${deleteError.message}`);
//         return;
//     }

//     alert(` Xóa Sân ID: ${courtId} thành công!`);
//     fetchCourtsList();
//     document.getElementById('court-edit-card').style.display = 'none';
// }