// HÀM TIỆN ÍCH ĐỂ BẬT/TẮT CÁC TRƯỜNG VENUE
const venueFieldsToToggle = [
    'venue-name', 'venue-address', 'venue-surface',
    'venue-country', 'venue-contact-email', 'venue-contact-phone',
    'venue-image-upload'
];

/**
 * Bật hoặc Tắt (disabled) các trường input/select/button trong fieldset Venue
 * @param {boolean} isDisabled - true để tắt (disabled), false để bật (enabled)
 */
function toggleVenueFields(isDisabled) {
    const clearVenueImageBtn = document.getElementById('clear-venue-image-btn');

    //  SỬA LỖI: ĐẢM BẢO LỆNH ENABLE/DISABLE NÀY CHẠY
    venueFieldsToToggle.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Lệnh này buộc phải mở khóa khi isDisabled = false
            element.disabled = isDisabled;
        } else {

        }
    });

    // Cập nhật trạng thái hiển thị của nút xóa ảnh Venue
    if (clearVenueImageBtn) {
        clearVenueImageBtn.style.display = isDisabled ? 'none' : 'inline-block';
    }
}

async function deleteVenueAndCourts(venueId) {
    try {
        // 1. XÓA COURTS trước (tránh lỗi ràng buộc FK)
        const { error: courtDeleteError } = await supabaseClient
            .from('courts')
            .delete()
            .eq('venue_id', venueId);

        if (courtDeleteError) {
            alert("Lỗi khi xóa Sân thuộc Khu Vực: " + courtDeleteError.message);
            return;
        }

        // 2. XÓA VENUE
        const { error: venueDeleteError } = await supabaseClient
            .from('venues')
            .delete()
            .eq('id', venueId);

        if (venueDeleteError) {
            alert("Lỗi khi xóa Khu Vực: " + venueDeleteError.message);
            return;
        }

        alert("Đã xóa Khu Vực và toàn bộ Sân thuộc khu vực!");

        // ----------------------------
        // REFRESH UI: table + select
        // ----------------------------
        // Tải lại bảng Venues nếu hàm đó tồn tại trong code của bạn
        if (typeof fetchVenuesAndRenderTable === 'function') {
            await fetchVenuesAndRenderTable();
        } else if (typeof loadVenues === 'function') {
            await loadVenues();
        }

        // Tải lại options của select nếu có
        if (typeof loadVenuesForSelect === 'function') {
            await loadVenuesForSelect();
        }

        // Reset các trạng thái UI liên quan
        currentVenueId = null;
        // Ẩn modal nếu còn mở
        const venueModal = document.getElementById('venue-modal-overlay');
        if (venueModal) venueModal.classList.remove('active');

    } catch (err) {
        // Hiển thị message lỗi rõ ràng hơn cho debug
        console.error("Lỗi khi xóa Venue:", err);
        alert("Lỗi không xác định khi xóa: " + (err && err.message ? err.message : String(err)));
    }
}




// ===================================================================
// TẢI VÀ RENDER DANH SÁCH VENUES
// ... (GIỮ NGUYÊN HÀM fetchAndRenderVenues)
// ===================================================================
// /Client/js/venues_logic.js

// Đổi tên hàm để chỉ rõ mục đích: tải danh sách cho dropdown
async function loadVenuesForSelect() { 
    const { data: venues, error } = await supabaseClient
        .from('venues')
        .select('id, name, address, surface, images, contact_email, contact_phone, country, rating, province');

    if (error) {
        console.error("Lỗi khi tải danh sách Khu vực (Venues):", error.message);
        return;
    }

    allVenues = venues;
    
    // 🚨 BƯỚC KHẮC PHỤC: Thêm kiểm tra Null cho dropdown
    const select = document.getElementById('venue-select');
    if (!select) {
        console.warn("Không tìm thấy dropdown 'venue-select'. Bỏ qua load Venue.");
        return;
    }
    
    // Xóa tất cả option trừ option trống đầu tiên (nếu có)
    select.innerHTML = '<option value="">--- Chọn Khu Vực ---</option>';

    venues.forEach(venue => {
        const option = document.createElement('option');
        option.value = venue.id;
        option.textContent = venue.name;
        select.appendChild(option);
    });

    const newOption = document.createElement('option');
    newOption.value = 'new_venue';
    newOption.textContent = ' Tạo Khu Vực Mới';
    select.appendChild(newOption);
}

//  Nếu bạn có một hàm khác tên là fetchAndRenderVenues để render bảng Venue,
// hãy đảm bảo hàm đó có kiểm tra null cho tbody như tôi đã hướng dẫn ở bước trước. 

// ===================================================================
// ĐỔ DỮ LIỆU CHI TIẾT VENUE VÀO FORM
// ===================================================================
function loadVenueDetailsToForm(venue) {
    const editVenueBtn = document.getElementById('edit-venue-details-btn');
    const deleteVenueBtn = document.getElementById('delete-venue-btn');




    // Reset chi tiết Venue
    document.getElementById('venue-name').value = '';
    document.getElementById('venue-address').value = '';
    document.getElementById('venue-country').value = '';
    document.getElementById('venue-surface').value = '';
    document.getElementById('venue-contact-email').value = '';
    document.getElementById('venue-contact-phone').value = '';

    // Reset preview
    document.getElementById('venue-images-preview').innerHTML = '';

    if (venue) {
        // Đổ dữ liệu Venue cũ
        document.getElementById('venue-name').value = venue.name || '';
        document.getElementById('venue-address').value = venue.address || '';
        document.getElementById('venue-country').value = venue.province || ''; // Dùng province cho hiển thị
        document.getElementById('venue-surface').value = venue.surface || '';
        document.getElementById('venue-contact-email').value = venue.contact_email || '';
        document.getElementById('venue-contact-phone').value = venue.contact_phone || '';

        // Hiển thị ảnh (nếu có)
        renderImagePreview(venue.images, 'venue-images-preview');

        // Chế độ xem: Tắt các input Venue 
        toggleVenueFields(true); // Khóa các input
        if (editVenueBtn) {
            editVenueBtn.style.display = 'inline-block';
        }

    } else {
        // Chế độ tạo mới Venue (sau khi chọn 'new_venue')
        if (editVenueBtn) {
            editVenueBtn.style.display = 'none';
        }
        // Mặc định tắt (chỉ bật khi chọn 'new_venue')
        toggleVenueFields(false);
    }
    if (venue) {
        deleteVenueBtn.style.display = 'inline-block';
    } else {
        deleteVenueBtn.style.display = 'none';
    }
}
// /Client/js/venues_logic.js (Bổ sung)

/**
 * Tải danh sách Venues và đổ dữ liệu vào bảng venues-list-tbody
 */
async function loadVenues() {
    const { data: venues, error } = await supabaseClient
        .from('venues')
        .select('id, name, code_venues, address, province, surface, contact_email, contact_phone, images, rating'); // Bổ sung các trường cần thiết

    if (error) {
        console.error("Lỗi khi tải danh sách Khu vực (Bảng):", error.message);
        const tbody = document.getElementById('venues-list-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="12" style="color: red;">Lỗi tải dữ liệu Khu vực. Vui lòng kiểm tra console.</td></tr>';
        }
        return;
    }

    renderVenuesList(venues);
   
    
}

/**
 * Render dữ liệu Khu vực vào bảng HTML
 * @param {Array} venues - Danh sách đối tượng Venue
 */
// Thay thế hàm renderVenuesList hiện tại trong venues_logic.js bằng hàm này:
function renderVenuesList(venues) {
    const tbody = document.getElementById('venues-list-tbody');
    if (!tbody) return;

    tbody.innerHTML = ''; // Xóa nội dung cũ

    if (!venues || venues.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12">Chưa có Khu vực nào được tạo.</td></tr>';
        return;
    }

    venues.forEach(venue => {
        const isIndoorDisplay = venue.is_indoor ? 'Ngoài trời' : 'Trong nhà';
        const ratingDisplay = venue.rating ? venue.rating.toFixed(1) : 'N/A';
        
        // --- SỬ DỤNG HÀM MỚI ĐỂ HIỂN THỊ ẢNH THAY VÌ ĐẾM ---
        const imageHtmlSnippet = createImagePreviewSnippet(venue.images);
        // --- END ---
        
        
        // const tempPrice = venue.price; 

        const row = `
            <tr data-id="${venue.id}">
                <td>${venue.name || 'N/A'}</td>
                <td>${venue.code_venues || 'N/A'}</td>
                <td>${venue.address || 'N/A'}</td>
                <td>${venue.province || 'N/A'}</td>
                <td>${venue.surface || 'N/A'}</td>
                <td>${venue.contact_phone || 'N/A'}</td>
                <td>${venue.contact_email || 'N/A'}</td>
                <td>${isIndoorDisplay}</td>
                <td>${ratingDisplay}</td>
                <td style="max-width: 70px;">${imageHtmlSnippet}</td> 
                <td>
                    <button class="action-btn edit-venue-btn" data-id="${venue.id}">Sửa</button>
                    <button class="action-btn delete-venue-btn" data-id="${venue.id}">Xóa</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Cần sửa lại hàm fetchAndRenderVenues để nó nhận danh sách Venue (để tránh gọi API 2 lần)
// Đổi tên hàm cũ thành renderVenueSelect
function renderVenueSelect(venues) {
    const select = document.getElementById('venue-select');
    if (!select) return; //  FIX CHÍNH XÁC

    select.innerHTML = '';

    venues.forEach(v => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = v.name;
        select.appendChild(option);
    });
}


// Hàm fetchAndRenderVenues cũ đổi tên thành loadVenuesForSelect nếu chỉ muốn tải riêng select
async function loadVenuesForSelect() {
    const { data: venues, error } = await supabaseClient
        .from('venues')
        .select('id, name'); // Chỉ cần ID và Tên cho select

    if (error) {
        console.error("Lỗi khi tải danh sách Khu vực (Select):", error.message);
        return;
    }
    // Gán biến toàn cục 'allVenues' nếu cần
    allVenues = venues;
    renderVenueSelect(venues);
}
/**
 * Tạo snippet HTML hiển thị ảnh thu nhỏ (tối đa 3 ảnh) cho ô bảng.
 * @param {string|string[]|null} imagesData - Chuỗi URL (cách nhau bằng ',') hoặc Mảng URL.
 * @returns {string} HTML string chứa các thẻ <img>.
 */
function createImagePreviewSnippet(imagesData) {
    if (!imagesData) return '<span style="color: #6c757d;">Không có ảnh</span>';

    let urls = [];
    // 1. Chuyển đổi dữ liệu về Mảng URL
    if (Array.isArray(imagesData)) {
        urls = imagesData;
    } else if (typeof imagesData === 'string') {
        // Xử lý trường hợp lưu dưới dạng chuỗi ngăn cách bằng dấu phẩy
        urls = imagesData.split(',').map(url => url.trim()).filter(url => url.length > 0);
    }

    if (urls.length === 0) return '<span style="color: #6c757d;">Không có ảnh</span>';

    // 2. Chỉ lấy tối đa 3 ảnh để hiển thị trong bảng
    const displayUrls = urls.slice(0, 3); 

    // 3. Tạo thẻ <img>
    const imageHtml = displayUrls.map(url => {
        // Sử dụng style nhỏ gọn cho bảng (kích thước 50px)
        return `<img src="${url}" alt="Ảnh Khu vực" style="width: 70px; height: 70px; object-fit: cover; border-radius: 4px; margin-right: 5px;">`;
    }).join('');

    // 4. Trả về HTML chứa tất cả ảnh
    return `<div style="display: flex; flex-wrap: wrap; align-items: center;">${imageHtml}</div>`;
}

/**
 * Thiết lập form Venue (Modal) cho chế độ Thêm hoặc Sửa
 * @param {string} mode - 'add' hoặc 'edit'
 * @param {Object} data - Dữ liệu Venue (chỉ cần khi mode='edit')
 */
function setupVenueForm(mode = 'add', data = null) {
    const modalTitle = document.getElementById('venue-modal-title');
    const saveButton = document.getElementById('save-venue-details-btn');
    const deleteButton = document.getElementById('delete-venue-btn');
    
    // THÊM: Lấy tham chiếu đến form và danh sách Sân
    const venueDetailsFieldset = document.getElementById('venue-details-fieldset');
    const courtListCard = document.getElementById('court-list-in-modal-card');
    
    // Reset inputs
    document.getElementById('venue-name').value = '';
    document.getElementById('venue-address').value = '';
    document.getElementById('venue-country').value = ''; 
    document.getElementById('venue-surface').value = '';
    document.getElementById('venue-is-indoor').value = 'false';
    document.getElementById('venue-contact-email').value = '';
    document.getElementById('venue-contact-phone').value = '';

    // Reset ảnh
    const venueImageInput = document.getElementById('venue-image-upload');
    if (venueImageInput) venueImageInput.value = '';
    document.getElementById('venue-images-preview').innerHTML = '';
    document.getElementById('venue-images-preview').dataset.currentUrls = ''; // Xóa URL cũ

    if (mode === 'add') {
        currentVenueId = null; // Biến global trong venue_main.js
        modalTitle.textContent = "Thêm Khu Vực Mới";
        saveButton.textContent = "Tạo Khu Vực";
        
        toggleVenueFields(false); // Bật tất cả input
        
        // HIỆN form Venue, ẨN danh sách Sân
        if (venueDetailsFieldset) venueDetailsFieldset.style.display = 'block';
        if (courtListCard) courtListCard.style.display = 'none'; // Ẩn danh sách Sân khi Tạo mới

    } else if (mode === 'edit' && data) {
        currentVenueId = data.id; // Biến global trong venue_main.js
        modalTitle.textContent = `Quản lý Sân tại Khu Vực: ${data.name}`; // Đổi tiêu đề cho phù hợp
        saveButton.textContent = "Lưu Thay Đổi";
       

        // Đổ dữ liệu (vẫn cần đổ dữ liệu để logic lưu hoạt động đúng)
        document.getElementById('venue-name').value = data.name || '';
        document.getElementById('venue-address').value = data.address || '';
        document.getElementById('venue-country').value = data.province || ''; 
        document.getElementById('venue-surface').value = data.surface || '';
        document.getElementById('venue-is-indoor').value = data.is_indoor ? 'true' : 'false';
        document.getElementById('venue-contact-email').value = data.contact_email || '';
        document.getElementById('venue-contact-phone').value = data.contact_phone || '';
        
        // Hiển thị ảnh
        renderImagePreview(data.images, 'venue-images-preview'); 
        document.getElementById('venue-images-preview').dataset.currentUrls = data.images || '';

        toggleVenueFields(false); // Vẫn bật các input để logic lưu hoạt động (nếu người dùng bấm Lưu)
        
        // ẨN form Venue, HIỆN danh sách Sân (theo yêu cầu của bạn)
        if (venueDetailsFieldset) venueDetailsFieldset.style.display = 'none'; 
        if (courtListCard) courtListCard.style.display = 'block'; 
    }
    
    openVenueModal(); // Mở Modal
}

// Cần chỉnh sửa hàm loadVenueDetails để gọi setupVenueForm('edit', data)
// /Client/js/venues_logic.js

async function loadVenueDetails(venueId) {
    if (!venueId) {
        alert("ID Khu Vực không hợp lệ.");
        return;
    }
    
    // Tải dữ liệu chi tiết của Venue
    const { data, error } = await supabaseClient
        .from('venues')
        .select('*') // Lấy tất cả các trường
        .eq('id', venueId)
        .single(); // Chỉ mong đợi một kết quả

    if (error) {
        console.error("Lỗi khi tải chi tiết Khu vực:", error.message);
        alert(`Lỗi tải dữ liệu Khu Vực: ${error.message}`);
        return;
    }

    if (data) {
        //  QUAN TRỌNG: Gọi setupVenueForm ở chế độ 'edit'
        setupVenueForm('edit', data);
        
        //  BƯỚC MỚI: Tải danh sách Sân thuộc Venue này
        await loadCourtsByVenue(venueId);
    } else {
        alert("Không tìm thấy dữ liệu Khu Vực này.");
    }
}
function renderVenuesForMasterList(venues) {
    const tbody = document.getElementById('venues-list-tbody');
    if (!tbody) {
        // Thoát nếu không phải trang Court (hoặc HTML bị thiếu)
        console.warn("Không tìm thấy phần tử 'venues-list-tbody'. Bỏ qua render bảng Venue.");
        return;
    }

    tbody.innerHTML = ''; // Xóa nội dung cũ

    if (venues && venues.length > 0) {
        venues.forEach(venue => {
            //  ĐIỂM CỰC KỲ QUAN TRỌNG: Phải có data-id VÀ class="venue-row"
            const row = `
                <tr data-id="${venue.id}" class="venue-row selectable-row">
                    <td>${venue.name}</td>
                    <td>${venue.code_venues || 'N/A'}</td>
                    <td>${venue.address || 'N/A'}</td>
                    <td>${venue.surface || 'N/A'}</td>
                    
                    <td>
                        <button class="action-btn edit-venue-btn" data-id="${venue.id}">Sửa</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4">Không có Khu Vực nào.</td></tr>';
    }
}

// ===================================================================
// TẢI DỮ LIỆU VENUE VÀ GỌI HÀM RENDER BẢNG
// ===================================================================
async function fetchVenuesAndRenderTable() {
    const { data: venues, error } = await supabaseClient
        .from('venues')
        .select('id, name, code_venues, address, province, surface, contact_email, contact_phone, images, rating'); 

    if (error) {
        console.error("Lỗi khi tải danh sách Khu vực:", error.message);
        return;
    }

    renderVenuesList(venues);
}
// ===================================================================
// TẢI DANH SÁCH SÂN THEO VENUE
// ===================================================================
// /Client/js/venues_logic.js

// ===================================================================
// TẢI DANH SÁCH SÂN THEO VENUE (ĐÃ CHỈNH SỬA)
// ===================================================================
async function loadCourtsByVenue(venueId) {
    const tbody = document.getElementById("courts-by-venue-tbody");
    const addCourtBtn = document.getElementById("add-court-to-venue-btn");
    const courtListCard = document.getElementById("court-list-in-modal-card");
    
    if (!tbody || !addCourtBtn || !courtListCard) return;

    // Hiển thị phần Danh sách Sân và nút Thêm Sân
    courtListCard.style.display = 'block'; 
    addCourtBtn.style.display = 'inline-block';
    addCourtBtn.dataset.venueId = venueId; // Lưu ID Venue để dùng khi thêm mới sân

    tbody.innerHTML = "<tr><td colspan='5'>Đang tải danh sách sân...</td></tr>"; // Đổi colspan thành 5

    const { data: courts, error } = await supabaseClient
        .from("courts")
        .select("id, name, capacity, is_active, default_price_per_hour, image_url, venue_id"); // Bổ sung venue_id nếu cần

    // 🚨 LỖI: CẦN LỌC DỮ LIỆU BẰNG venue_id
    // Sửa lại lệnh select để lọc đúng theo venueId
    const { data: filteredCourts, error: filteredError } = await supabaseClient
        .from("courts")
        .select("id, name, capacity, is_active, default_price_per_hour")
        .eq("venue_id", venueId);
    
    if (filteredError) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:red;">Lỗi tải dữ liệu sân!</td></tr>`;
        console.error(filteredError.message);
        return;
    }

    if (!filteredCourts || filteredCourts.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>Không có sân nào trong khu vực này.</td></tr>";
        return;
    }

    tbody.innerHTML = "";

    filteredCourts.forEach(court => {
        const statusDisplay = court.is_active 
            ? '<span class="status-active">Hoạt động</span>' 
            : '<span class="status-maintenance">Bảo trì</span>';
            
        const priceDisplay = court.default_price_per_hour
            ? court.default_price_per_hour.toLocaleString('vi-VN') + ' VND'
            : 'N/A';

        const row = `
            <tr data-court-id="${court.id}">
                <td>${court.name}</td>
                <td>${court.capacity} người</td>
                <td>${priceDisplay}</td>
                <td>${statusDisplay}</td>
                <td>
                    <button class="action-btn edit-court-btn" data-id="${court.id}">Sửa</button>
                    <button class="action-btn delete-court-btn" style="background-color: #d32f2f;data-id="${court.id}">Xóa</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}
// /Client/js/venues_logic.js (Bổ sung)

/**
 * Xóa một Sân và cập nhật lại danh sách Sân trong Modal.
 * @param {string} courtId - ID của Sân cần xóa.
 * @param {string} venueId - ID của Venue chứa Sân.
 */
async function deleteCourt(courtId, venueId) {
    if (!confirm(`Bạn có chắc chắn muốn XÓA Sân ID: ${courtId} không?`)) {
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('courts')
            .delete()
            .eq('id', courtId);

        if (error) throw error;

        alert(" Đã xóa Sân thành công!");
        
        // Tải lại danh sách Sân trong Modal Venue
        await loadCourtsByVenue(venueId);

    } catch (err) {
        console.error("Lỗi khi xóa Sân:", err.message);
        alert(` Lỗi khi xóa Sân: ${err.message}`);
    }
}
// /Client/js/venues_logic.js (Bổ sung)


/**
 * Thiết lập form Sân (Modal) cho chế độ Thêm
 * @param {string} venueId - ID của Venue cha
 */
function setupCourtFormForAdd(venueId) {
    const modalTitle = document.getElementById('court-modal-title');
    const saveButton = document.getElementById('save-court-details-btn');
    
    // ... (logic cũ) ...
    
    // Reset ảnh
    const imageInput = document.getElementById('court-image-upload');
    if (imageInput) imageInput.value = '';
    document.getElementById('court-images-preview').innerHTML = '';
    document.getElementById('court-images-preview').dataset.currentUrls = ''; 

    // 2. Cập nhật tiêu đề & nút
    modalTitle.textContent = "Thêm Sân Mới";
    saveButton.textContent = "Tạo Sân";

    //  FIX: Ẩn danh sách Sân trong Venue Modal khi mở Court Modal
    const courtListCard = document.getElementById('court-list-in-modal-card');
    if (courtListCard) courtListCard.style.display = 'none';

    openCourtModal();
    document.getElementById("court-modal-title").innerText = "Chỉnh sửa Sân"; // Mở Modal Sân
}
// /Client/js/venues_logic.js (Bổ sung)

/**
 * Tải chi tiết Sân và hiển thị vào form để Sửa.
 * @param {string} courtId - ID của Sân cần Sửa.
 */
async function loadCourtDetails(courtId) {
    if (!courtId) return;

    const modalTitle = document.getElementById('court-modal-title');
    const saveButton = document.getElementById('save-court-details-btn');

    // 1. Tải dữ liệu Sân
    const { data: court, error } = await supabaseClient
        .from('courts')
        .select('*')
        .eq('id', courtId)
        .single();

    if (error) {
        console.error("Lỗi khi tải chi tiết Sân:", error.message);
        alert("Lỗi tải chi tiết Sân.");
        return;
    }

    // 2. Đổ dữ liệu vào form
    document.getElementById('current-court-id').value = court.id; // Chế độ Sửa
    document.getElementById('court-venue-id').value = court.venue_id; // ID Venue cha
    document.getElementById('court-name').value = court.name || '';
    document.getElementById('court-code').value = court.code || '';
    document.getElementById('court-capacity').value = court.capacity || 2;
    document.getElementById('court-price').value = court.default_price_per_hour || '';
    document.getElementById('court-is-active').value = court.is_active ? 'true' : 'false';
    
    // Hiển thị ảnh
    renderImagePreview(court.image_url, 'court-images-preview'); 
    document.getElementById('court-images-preview').dataset.currentUrls = court.image_url || '';

    // Ẩn/hiện nút Xóa ảnh
    const clearImageBtn = document.getElementById('clear-court-image-btn');
    if (clearImageBtn) clearImageBtn.style.display = 'inline-block';

    // 3. Cập nhật tiêu đề & nút
    modalTitle.textContent = `Sửa Sân: ${court.name}`;
    saveButton.textContent = "Lưu Thay Đổi";

    openCourtModal();
    document.getElementById("court-modal-title").innerText = "Chỉnh sửa Sân"; // Mở Modal Sân
}

// --- CLICK SỬA VENUE ---
async function loadVenueForEdit(venueId) {

    const { data, error } = await supabaseClient
        .from("venues")
        .select("*")
        .eq("id", venueId)
        .single();

    modalMode = "editVenue";

    document.getElementById('venue-name').value = data.name || '';
    document.getElementById('venue-code').value = data.code_venues || '';
    document.getElementById('venue-address').value = data.address || '';
    document.getElementById('venue-country').value = data.province || '';
    document.getElementById('venue-surface').value = data.surface || '';
    document.getElementById('venue-contact-email').value = data.contact_email || '';
    document.getElementById('venue-contact-phone').value = data.contact_phone || '';
    

    // title đúng
    title.textContent = "Chỉnh Sửa Khu Vực";

    // HIỆN form venue
    fieldset.style.display = "block";

    // ẨN danh sách sân khi sửa Infp
    courts.style.display = "none";

    // HIỆN nút lưu
    document.getElementById("save-venue-details-btn").style.display = "inline-block";

    // Populate form
    document.getElementById('venue-name').value = data.name;
    document.getElementById('venue-code').value = venue.code_venues || '';
    document.getElementById('venue-address').value = data.address;
    document.getElementById('venue-country').value = data.province;
    document.getElementById('venue-surface').value = data.surface;
    document.getElementById('venue-contact-email').value = data.contact_email;
    document.getElementById('venue-contact-phone').value = data.contact_phone;

    renderImagePreview(data.images, "venue-images-preview");
}


// --- CLICK ROW VENUE = CHỈ HIỆN DANH SÁCH SÂN ---
async function loadVenueCourtsOnly(venueId) {
    modalMode = "viewCourts";

    // Title đúng chế độ
    document.getElementById("venue-modal-title").textContent = "Danh Sách Sân";

    // Ẩn form Venue
    document.getElementById("venue-details-fieldset").style.display = "none";

    // Hiện danh sách sân
    document.getElementById("court-list-in-modal-card").style.display = "block";

    // Ẩn nút lưu
    document.getElementById("save-venue-details-btn").style.display = "none";

    await loadCourtsByVenue(venueId);
}

function openCourtModalForAdd() {

    // Mở dialog đúng cách
    document.getElementById("court-modal").showModal();

    // Đổi title
    document.getElementById("court-modal-title").innerText = "Thêm Sân Mới";

    // Reset form
    document.getElementById("current-court-id").value = "";
    document.getElementById("court-name").value = "";
    document.getElementById("court-code").value = "";
    document.getElementById("court-capacity").value = "2";
    document.getElementById("court-price").value = "";
    document.getElementById("court-is-active").value = "true";

    // Lấy venueId của sân đang được thêm
    document.getElementById("court-venue-id").value = currentVenueId;

    const imgPreview = document.getElementById("court-images-preview");
    imgPreview.innerHTML = "";
    imgPreview.dataset.currentUrls = "";
}

function openVenueModal() {
    document.getElementById("venue-modal").showModal();
}
function closeVenueModal() {
    document.getElementById("venue-modal").close();
}


function openCourtModal() {
    document.getElementById("court-modal").showModal();
}

function closeCourtModal() {
    document.getElementById("court-modal").close();
}

function openCourtListModal() { 
    document.getElementById("court-list-modal-overlay").classList.add('active');
}

