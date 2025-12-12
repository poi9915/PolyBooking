// Biến toàn cục để lưu trữ tất cả Venue, cần thiết cho logic Court
let allVenues = []; 
// Biến toàn cục để lưu ID sân đang được chỉnh sửa
let currentCourtId = null; 


// ===================================================================
// HÀM UPLOAD FILE LÊN SUPABASE STORAGE (ĐÃ FIX LỖI BUCKET VÀ THÊM LOG)
// ===================================================================
/**
 * Tải file lên Supabase Storage và trả về MẢNG public URL.
 * @param {FileList} files - Đối tượng FileList từ input type="file".
 * @param {string} folderPath - Đường dẫn thư mục con (ví dụ: 'venues/').
 * @returns {Promise<string[]|null>} - Mảng các public URL thành công hoặc null.
 */
async function uploadFilesToSupabase(files, folderPath) {
    const uploadedUrls = [];
    if (!files || files.length === 0) return null;

    // KHAI BÁO CỨNG TÊN BUCKET 'Data'
    const bucketName = 'Data'; 

    for (const file of files) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
        const filePath = `${folderPath}${fileName}`;

        // Bắt đầu upload
        const { error } = await supabaseClient.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error(`❌ Lỗi khi upload file ${file.name} lên Supabase:`, error.message);
            // Bạn có thể chọn hiển thị alert ở đây nếu muốn dừng toàn bộ quá trình lưu
            continue; 
        }

        // Lấy public URL
        const { data: publicUrlData } = supabaseClient.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl);
        }
    }
    return uploadedUrls.length > 0 ? uploadedUrls : null;
}

// ===================================================================
// HÀM HIỂN THỊ ẢNH PREVIEW (SỬ DỤNG URL)
// ===================================================================
function renderImagePreview(urlText, previewElementId) {
    const previewDiv = document.getElementById(previewElementId);
    if (!previewDiv) return;
    
    previewDiv.innerHTML = ''; // Xóa ảnh cũ

    if (!urlText || typeof urlText !== 'string') {
        return;
    }

    // Tách URL (Giả định URL cách nhau bằng dấu phẩy)
    const urls = urlText.split(',').map(url => url.trim()).filter(url => url.length > 0);

    urls.forEach(url => {
        if (url.startsWith('http')) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = "Ảnh Khu Vực/Sân";
            img.loading = "lazy";
            previewDiv.appendChild(img);
        }
    });
}
// /Client/js/court_utils.js (Bổ sung vào cuối file)


function closeVenueModal() {
    document.getElementById("venue-modal-overlay").classList.remove("active");
    modalMode = null;
}
// /Client/js/court_utils.js (Bổ sung vào cuối file)
// ... (Hàm openVenueModal và closeVenueModal đã có)

function openVenueModal() {
    const modal = document.getElementById('venue-modal-overlay');
    if (!modal) return;

    modal.classList.add("active");

    const venueFieldset = document.getElementById("venue-details-fieldset");
    const courtList = document.getElementById("court-list-in-modal-card");

    if (modalMode === "addVenue") {
        venueFieldset.style.display = "block";
        courtList.style.display = "none";
    } 
    else if (modalMode === "editVenue") {
        venueFieldset.style.display = "block";
        courtList.style.display = "none";
    } 
    else if (modalMode === "viewCourts") {
        venueFieldset.style.display = "none";
        courtList.style.display = "block";
    }
}



function closeCourtModal() {
    const modal = document.getElementById('court-modal-overlay');
    if (modal) modal.classList.remove('active');
    
    // 🛑 BỔ SUNG: ẨN form sửa Sân khi đóng modal Sân
    const courtEditCard = document.getElementById('court-edit-card');
    if (courtEditCard) {
        courtEditCard.style.display = 'none';
    }

    // Sau khi đóng modal Sân, ta quay lại màn hình quản lý Venue.
    // Nếu ta đang ở chế độ Sửa Venue, ta cần hiện lại danh sách Sân:
    const courtListCard = document.getElementById('court-list-in-modal-card');
    if (courtListCard) {
        courtListCard.style.display = 'block';
    }
}
function openCourtModal() {
    const modal = document.getElementById("court-modal-overlay");
    if (!modal) return;

    modal.classList.add("active");

    // Hiện form chi tiết sân
    document.getElementById("court-detail-form").style.display = "block";
}
