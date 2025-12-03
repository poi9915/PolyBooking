# 🏓 PolyBooking -- Ứng dụng Đặt Sân Pickleball

**PolyBooking** là ứng dụng React Native (Expo) giúp người dùng dễ
dàng:\
✔ tìm sân Pickleball\
✔ đặt lịch\
✔ quản lý đặt chỗ\
✔ thanh toán\
✔ kết nối cộng đồng người chơi

Backend sử dụng **Supabase (host online)**.

------------------------------------------------------------------------

# 🚀 Cách Chạy Ứng Dụng (React Native -- Expo)

## ✅ 1. Cài đặt môi trường

### Yêu cầu:

-   **Node.js** ≥ 18\

-   **Expo CLI**

    ``` bash
    npm i -g expo-cli
    ```

-   **Expo Go** (nếu test trên điện thoại)

-   **Android Studio** / Simulator (nếu test Android)

------------------------------------------------------------------------

## 🔐 2. Tạo file môi trường `.env.local`

Trong thư mục gốc của project, tạo file:

``` bash
.env.local
```

Thêm nội dung sau:

``` env
EXPO_PUBLIC_SUPABASE_URL= ///
EXPO_PUBLIC_SUPABASE_KEY= ///
```

### ⚠️ Lưu ý:

-   Biến môi trường **phải bắt đầu bằng `EXPO_PUBLIC_`** để Expo cho
    phép dùng trong client.
------------------------------------------------------------------------

## 📦 3. Cài đặt dependencies

``` bash
npm install
# hoặc
bun install
# hoặc
yarn install
```

------------------------------------------------------------------------

## ▶️ 4. Chạy ứng dụng

``` bash
expo start
```

Chọn: - **a** → chạy Android emulator\
- **i** → chạy iOS (Mac)\
- **Scan QR** → chạy trên Expo Go

------------------------------------------------------------------------

# 🔌 5. Kết nối Supabase trong code

`lib/supabase.ts`:

``` ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Sử dụng:

``` ts
const { data, error } = await supabase.from("venues").select("*");
```

------------------------------------------------------------------------

# 📁 Cấu Trúc Thư Mục

    PolyBooking/
    │
    ├── app/                     # Expo Router screens
    ├── components/              # UI components
    ├── store/                   # Zustand stores
    ├── utils/                   # Supabase client, utilities
    │
    ├── .env.local               # Env file 
    ├── app.json                 # Expo config
    └── README.md

------------------------------------------------------------------------

# 🛠️ Công Nghệ Sử Dụng

  Thành phần           Công nghệ
  -------------------- ------------------------------------
  **Frontend**         React Native (Expo), Expo Router
  **State**            Zustand
  **Backend (BaaS)**   Supabase (Auth, Database, Storage)
  **UI**               gluestack-ui / NativeWind
  **Auth**             Supabase Auth
  **Database**         PostgreSQL (Supabase)
  **Build**            EAS Build

------------------------------------------------------------------------

# 📡 Supabase Online (Production)

Ứng dụng sử dụng Supabase:

    https://supabase.com/

Chỉ cần tạo `.env.local` và thêm url , key là chạy được.

------------------------------------------------------------------------

# 👥 Đội Ngũ Phát Triển

  Vai trò                     Thành viên
  --------------------------- ----------------
  Mobile App (React Native)   *Cập nhật sau*
  Backend / Supabase          *Cập nhật sau*
  UI/UX                       *Cập nhật sau*

------------------------------------------------------------------------

# 📄 Giấy Phép

Dự án phát hành theo **MIT License** -- bạn được phép sử dụng cho học
tập và nghiên cứu.

------------------------------------------------------------------------

``` bash
expo start -c
```
