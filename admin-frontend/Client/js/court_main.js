// // /Client/js/court_main.js - Đã được dọn dẹp logic Venue

// // Biến toàn cục để lưu ID sân đang được chỉnh sửa
// let currentCourtId = null; 
// // Biến toàn cục để lưu ID Khu Vực đang được chọn
// let selectedVenueId = null; // 🚨 THÊM BIẾN NÀY (hoặc đảm bảo nó có trong court_utils.js)

// // ===================================================================
// // HÀM XỬ LÝ CHỌN KHU VỰC (MASTER-DETAIL LOGIC)
// // ===================================================================
// /**
//  * Xử lý việc chọn một Khu Vực, cập nhật UI và tải danh sách Sân.
//  * @param {string} venueId - ID của Khu Vực được chọn.
//  * @param {HTMLElement} selectedRow - Hàng (<tr>) của Khu Vực được chọn.
//  */
// function selectVenue(venueId, selectedRow) {
//     // 1. Cập nhật biến global
//     selectedVenueId = venueId;

//     // 2. Cập nhật UI (Highlight hàng được chọn)
//     const venueTableBody = document.getElementById('venues-list-tbody');
//     if (venueTableBody) {
//         // Xóa highlight cũ
//         // Sử dụng '.active-venue-row' để tránh xung đột với các class 'active' khác
//         venueTableBody.querySelectorAll('.venue-row').forEach(row => {
//             row.classList.remove('active-venue-row'); 
//         });
//         // Thêm highlight mới
//         if (selectedRow) {
//             selectedRow.classList.add('active-venue-row');
//         }
//     }
    
//     // 3. Ẩn form sửa Court khi chuyển Venue
//     const courtEditCard = document.getElementById('court-edit-card');
//     if (courtEditCard) {
//         courtEditCard.style.display = 'none'; 
//     }

//     // 4. Tải danh sách Sân dựa trên ID Khu Vực
//     // 🚨 SỬ DỤNG HÀM TẢI CỦA BẠN: loadCourts(venueId)
//     // Tôi giả định loadCourts(venueId) trong courts_logic.js gọi fetchCourtsList(venueId)
//     loadCourts(venueId);
    
//     // 5. Cập nhật dropdown nếu nó tồn tại (để đồng bộ)
//     const venueSelect = document.getElementById('venue-select');
//     if(venueSelect) {
//         venueSelect.value = venueId;
//     }
// }


// // ===================================================================
// // XỬ LÝ LƯU SÂN (CREATE/UPDATE) - SỬ DỤNG UPLOAD FILE
// // ===================================================================
// async function handleSaveCourt(e) {
//     e.preventDefault();
//     // ... (Giữ nguyên logic handleSaveCourt của bạn) ...
//     // Đảm bảo lệnh cuối cùng là:
//     // loadCourts(venueId);
//     // setupCourtForm('add'); 
// }


// // ===================================================================
// // ENTRY POINT & LISTENERS CHÍNH
// // ===================================================================
// // /Client/js/court_main.js

// document.addEventListener('DOMContentLoaded', () => {
//     // 1. TẢI DỮ LIỆU BAN ĐẦU
//     loadVenuesForSelect();         // Tải danh sách Venues cho dropdown (đã có)
//     fetchVenuesAndRenderTable();   // 🚨 THÊM: Tải danh sách Venues cho BẢNG Master List
//     fetchCourtsList();             // 🚨 SỬA: Tải danh sách Sân (thay loadCourts())

//     const venueSelect = document.getElementById('venue-select');
//     const courtsListTable = document.getElementById('courts-list-table');
//     const addCourtButton = document.getElementById('add-court-button');
//     const saveButton = document.getElementById('save-court-details-btn');
    
//     // -----------------------------------------------------------
//     // LẮNG NGHE CLICK TRÊN BẢNG VENUE (CHO TÍNH NĂNG MASTER-DETAIL)
//     // -----------------------------------------------------------
//     const venuesListTBody = document.getElementById('venues-list-tbody');
//     if (venuesListTBody) {
//         venuesListTBody.addEventListener('click', (e) => {
//             const target = e.target;
            
//             // Tìm hàng <tr> có thuộc tính data-id và thuộc class="venue-row"
//             // Lắng nghe trên <tr> có data-id trong tbody
//             const row = target.closest('tr[data-id].venue-row'); 

//             if (row) { 
//                 const venueId = row.dataset.id;
                
//                 // Bỏ qua nếu click vào các nút hành động (Sửa/Xóa)
//                 if (target.closest('.action-btn')) {
//                     return; 
//                 }
                
//                 // Gọi hàm chọn Venue
//                 selectVenue(venueId, row);
//             }
//         });
//     }

//     // -----------------------------------------------------------
//     // LẮNG NGHE SỰ KIỆN CHỌN VENUE TRÊN DROPDOWN 
//     if (venueSelect) {
//         venueSelect.addEventListener('change', (e) => {
//             const selectedVenueId = e.target.value;

//             if (selectedVenueId === 'new_venue' || !selectedVenueId) {
//                 document.getElementById('court-edit-card').style.display = 'none';
//                 return;
//             }

//             // Tải lại danh sách Sân theo Venue mới
//             fetchCourtsList(selectedVenueId); // 🚨 SỬA: Dùng fetchCourtsList
//             setupCourtForm('add'); // Reset form
//         });
//     }

//     // ... (Giữ nguyên các logic còn lại) ...
// });