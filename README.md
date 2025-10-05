# 🏓 PolyBooking – Ứng dụng Đặt Sân Pickleball

**PolyBooking** là ứng dụng giúp người dùng dễ dàng **đặt sân Pickleball**, quản lý lịch đặt, thanh toán, và kết nối cộng đồng người chơi.  
Dự án gồm **Frontend (Android App)** và **Backend (BaaS với Supabase)**.

---

## 🚀 Cách Chạy Ứng Dụng

### ⚙️ 1. Khởi chạy Backend (Database – Supabase)

**Yêu cầu:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)  
  → Mở Docker Desktop → **Settings → Docker Engine**  
  → Bật tuỳ chọn:  
  ```json
  "hosts": ["tcp://localhost:2375", "npipe://"]
  ```
  *(hoặc bật tùy chọn trong Setting  **Expose daemon on tcp://localhost:2375 without TLS**)*

- Cài đặt **Supabase CLI**:  
  ```bash
  npx supabase
  ```

**Chạy Supabase local:**
```bash
cd database
npx supabase start
```

Lệnh trên sẽ:
- Khởi chạy Postgres, Studio, API Gateway.  
- Sinh ra thông tin kết nối (`anon key`, `service key`) để app Android sử dụng.

---

### 🤖 2. Khởi chạy Ứng Dụng Android

1. Mở thư mục **`android`** bằng **Android Studio**.  
2. Đợi Android Studio **sync Gradle** hoàn tất.  
3. Chạy app trên **emulator** hoặc **thiết bị thật**.

---

## 🧩 Cấu Trúc Thư Mục

```
PolyBooking/
│
├── database/              # Supabase BaaS (Database + Auth + Storage)
│   ├── supabase/config/   # Config & schema
│   └── ...
│
├── android/               # Ứng dụng Android (Frontend)
│   ├── app/
│   ├── build.gradle
│   └── ...
│
└── README.md
```

---

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
|-------------|------------|
| **Frontend** | Android (Kotlin / Jetpack Compose) |
| **Backend (BaaS)** | Supabase (PostgreSQL + Auth + Storage) |
| **CI/CD** | GitHub Actions |
| **Containerization** | Docker |

---

## 👥 Đội Ngũ Phát Triển

| Vai trò | Thành viên |
|----------|-------------|
| Backend / Database | _Cập nhật sau_ |
| Mobile Developer | _Cập nhật sau_ |
| UI/UX Design | _Cập nhật sau_ |

---

## 📄 Giấy Phép

Dự án phát hành theo **MIT License**.  
Bạn được phép sử dụng, chỉnh sửa và phân phối lại mã nguồn cho mục đích học tập hoặc nghiên cứu.

---

> 💡 *Nếu gặp lỗi khi khởi chạy Supabase, hãy đảm bảo Docker đang chạy và daemon đã được bật qua TCP.*
