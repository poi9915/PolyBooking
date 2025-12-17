/* =============================
   SERVICES CRUD – SUPABASE
   Hiển thị + Thêm + Sửa + Xóa dịch vụ
   Bảng: services
   ============================= */

// ⚠️ YÊU CẦU: client_config.js đã export supabaseClient
// const supabaseClient = supabase.createClient(URL, KEY)

const tableBody = document.getElementById('service-table-body');
const filterArea = document.getElementById('filter-area');

/* =============================
   LOAD SERVICES + JOIN VENUES
   ============================= */
async function loadServices(venueId = 'all') {
    tableBody.innerHTML = `<tr><td colspan="7">Đang tải dữ liệu...</td></tr>`;

    let query = supabaseClient
        .from('services')
        .select(`
            id,
            name,
            price,
            quantity,
            is_active,
            venue_id,
            venues( name )
        `)
        .order('created_at', { ascending: false });

    if (venueId !== 'all') {
        query = query.eq('venue_id', venueId);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="7">Lỗi tải dữ liệu</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">Không có dịch vụ</td></tr>`;
        return;
    }

    renderServiceTable(data);
}

/* =============================
   RENDER TABLE
   ============================= */
function renderServiceTable(services) {
    tableBody.innerHTML = '';

    services.forEach((s, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.venues?.name || '-'}</td>
            <td>${s.quantity ?? 0}</td>
            <td>${formatPrice(s.price)}</td>
            <td class="${s.is_active ? 'status-active' : 'status-inactive'}">
                ${s.is_active ? 'Đang bán' : 'Ngừng bán'}
            </td>
            <td class="action-icons">
                <button class="action-btn" onclick="openEditService(${s.id})">Sửa</button>
                <button class="delete-button" onclick="deleteService(${s.id})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

/* =============================
   ADD SERVICE
   ============================= */
async function addService(payload) {
    const { error } = await supabaseClient
        .from('services')
        .insert([payload]);

    if (error) {
        alert('Thêm dịch vụ thất bại');
        console.error(error);
        return;
    }

    loadServices(filterArea.value);
}

/* =============================
   UPDATE SERVICE
   ============================= */
async function updateService(id, payload) {
    const { error } = await supabaseClient
        .from('services')
        .update(payload)
        .eq('id', id);

    if (error) {
        alert('Cập nhật dịch vụ thất bại');
        console.error(error);
        return;
    }

    loadServices(filterArea.value);
}

/* =============================
   DELETE SERVICE
   ============================= */
async function deleteService(id) {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;

    const { error } = await supabaseClient
        .from('services')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Xóa thất bại');
        console.error(error);
        return;
    }

    loadServices(filterArea.value);
}

/* =============================
   FILTER BY VENUE
   ============================= */
filterArea?.addEventListener('change', () => {
    loadServices(filterArea.value);
});

/* =============================
   UTILITIES
   ============================= */
function formatPrice(value) {
    if (!value) return '0 đ';
    return Number(value).toLocaleString('vi-VN') + ' đ';
}


/* =============================
   INIT
   ============================= */
loadVenueFilter();
loadServices();

/* =============================
   LOAD VENUES FOR FILTER
   ============================= */
async function loadVenueFilter() {
    const { data, error } = await supabaseClient
        .from('venues')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Lỗi load venues:', error);
        return;
    }

    // reset select
    filterArea.innerHTML = `<option value="all">Tất cả khu vực</option>`;

    data.forEach(v => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = v.name;
        filterArea.appendChild(option);
    });
}
/* =============================
   LOAD VENUES FOR MODAL + FILTER
   ============================= */
async function loadVenueOptions(selectEl) {
    const { data, error } = await supabaseClient
        .from('venues')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Lỗi load venues:', error);
        return;
    }

    selectEl.innerHTML = '';

    data.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = v.name;
        selectEl.appendChild(opt);
    });
}

function openAddService() {
    const modal = document.getElementById('service-modal');

    document.getElementById('service-modal-title').innerText = 'Thêm dịch vụ';
    document.getElementById('service-form').reset();
    document.getElementById('service-id').value = '';

    loadVenueOptions(document.getElementById('service-venue'));

    modal.showModal();
}
async function openEditService(id) {
    const { data, error } = await supabaseClient
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById('service-modal-title').innerText = 'Sửa dịch vụ';
    document.getElementById('service-id').value = data.id;
    document.getElementById('service-name').value = data.name;
    document.getElementById('service-quantity').value = data.quantity ?? data.Quantity;
    document.getElementById('service-price').value = data.price;
    document.getElementById('service-active').checked = data.is_active;

    const venueSelect = document.getElementById('service-venue');
    await loadVenueOptions(venueSelect);
    venueSelect.value = data.venue_id;

    document.getElementById('service-modal').showModal();
}
document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('service-id').value;

    const payload = {
        name: document.getElementById('service-name').value,
        venue_id: document.getElementById('service-venue').value,
        quantity: Number(document.getElementById('service-quantity').value),
        price: Number(document.getElementById('service-price').value),
        is_active: document.getElementById('service-active').checked
    };

    if (id) {
        await updateService(id, payload);
    } else {
        await addService(payload);
    }

    closeServiceModal();
});
function closeServiceModal() {
    document.getElementById('service-modal').close();
}
document.getElementById('btn-add-service')
    ?.addEventListener('click', openAddService);


