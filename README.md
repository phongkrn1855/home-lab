# 🚀 TASKFLOW - Premium Todo App (Fullstack & Docker Compose)

Ứng dụng quản lý công việc (Todo App) cao cấp được thiết kế theo tiêu chuẩn thực tế (**Production-Ready**). Đây là dự án mẫu hoàn chỉnh trình bày kỹ năng phát triển phần mềm Fullstack, đóng gói container và tự động hóa toàn bộ quy trình vận hành.

---

## 📋 Tổng quan kiến trúc

Sơ đồ mạng ảo Docker Network mô tả luồng dữ liệu 1 chiều thông suốt từ máy vật lý của người dùng vào hệ thống container đóng gói:

```text
  👤 Người dùng ────> Nginx Proxy (:5173) 
                         ├── Web Frontend ➔ todo-frontend-web:80 (Nginx)
                         └── Backend API  ➔ todo-backend-server:5000 (Node.js)

                            Docker Network
                         ┌─────────┴─────────┐
                      Nginx               Node.js
                      Frontend            Backend
                      :80                 :5000
                         │                   │
                         │                   ▼ (Sequelize ORM)
                         └──────────────> MySQL DB
                                          :3306
```

---

## 🚀 Khởi động nhanh (3 bước)

### Bước 1: Chuẩn bị môi trường
Yêu cầu máy tính cài đặt sẵn **Docker Desktop**. Bạn không cần cài Node.js hay MySQL trên máy thật.

```bash
# Clone hoặc mở thư mục dự án
cd home-lab
```

### Bước 2: Khởi chạy hệ thống
Sử dụng Docker Compose để tự động tải thư viện, build image và khởi động đồng thời 3 container.

```bash
# Khởi chạy toàn bộ container ở chế độ nền (background)
docker compose up -d --build
```

### Bước 3: Trải nghiệm ứng dụng
Mở trình duyệt web của bạn và truy cập địa chỉ sau:
* Giao diện web: **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 Service Endpoints

Bảng ánh xạ các cổng kết nối dịch vụ từ Container ra máy vật lý (Host machine) của bạn:

| Dịch vụ | URL | Mô tả |
| :--- | :--- | :--- |
| 💻 **Web UI** | [http://localhost:5173](http://localhost:5173) | Giao diện quản lý công việc Glassmorphism, Responsive |
| ⚙️ **Agent API** | [http://localhost:5000/api/todos](http://localhost:5000/api/todos) | RESTful API CRUD (GET, POST, PUT, DELETE) |
| 🗄️ **MySQL DB** | `localhost:3306` | Kết nối CSDL (User: `root`, Pass: `rootpassword`) |

---

## ⚙️ Cấu trúc project

Sơ đồ cây cấu trúc phân mục dự án chuẩn chỉnh, phân tách rõ ràng trách nhiệm của từng cấu phần:

```text
home-lab/
├── backend/
│   ├── src/
│   │   ├── config/db.js        # Cấu hình kết nối MySQL Sequelize
│   │   ├── models/Todo.js      # Model Sequelize ánh xạ bảng "todos"
│   │   ├── routes/todoRoutes.js # Các API routes CRUD cho Todo
│   │   ├── app.js              # Khởi tạo Express, CORS, Middlewares
│   │   └── index.js            # Khởi động server & sequelize.sync()
│   ├── .env.example            # Mẫu cấu hình môi trường Backend
│   ├── Dockerfile              # File đóng gói backend Node.js
│   └── package.json            # Quản lý dependencies backend
├── frontend/
│   ├── src/
│   │   ├── components/         # Các UI Components (Stats, Form, Item, List)
│   │   ├── App.jsx             # Quản lý State React & gọi API backend
│   │   ├── App.css             # Giao diện phong cách Glassmorphism
│   │   ├── index.css           # Cấu hình CSS Variables & Scrollbars
│   │   └── main.jsx            # Entry point React
│   ├── index.html              # HTML chính & Tối ưu SEO
│   ├── nginx.conf              # Cấu hình Web Server Nginx (SPA, Gzip)
│   ├── .env.example            # Mẫu biến môi trường frontend
│   ├── vercel.json             # Cấu hình SPA routing trên Vercel
│   └── Dockerfile              # Đóng gói React (Multi-stage + Nginx)
├── docker-compose.yml          # Kịch bản khởi chạy toàn bộ 3 dịch vụ
└── README.md                   # Tài liệu hướng dẫn (Tệp tin này)
```

---

## 📌 Ví dụ tác vụ

### Qua giao diện web
Truy cập trực tiếp tại **[http://localhost:5173](http://localhost:5173)** để thực hiện:
* Thêm công việc mới vào danh sách.
* Click nút tròn đầu dòng để đánh dấu hoàn thành (Toggle State).
* Lọc danh sách theo các tab: *Tất cả*, *Đang làm*, *Đã xong*.
* Nhấp biểu tượng thùng rác để xóa công việc khỏi MySQL.

### Qua REST API
Bạn có thể sử dụng các công cụ như cURL hoặc Postman để kiểm tra API trực tiếp:

* **Lấy danh sách Todos (GET)**:
  ```bash
  curl -X GET http://localhost:5000/api/todos
  ```
* **Tạo Todo mới (POST)**:
  ```bash
  curl -X POST http://localhost:5000/api/todos \
    -H "Content-Type: application/json" \
    -d '{"title": "Học cách deploy ứng dụng Fullstack"}'
  ```

---

## 🔧 Quản lý

Các câu lệnh hữu ích giúp vận hành và kiểm tra hệ thống container nhanh chóng:

```bash
# Xem log thời gian thực của tất cả các container
docker compose logs -f

# Xem log riêng biệt của backend server
docker compose logs -f backend

# Khởi động lại một container cụ thể (ví dụ backend)
docker compose restart backend

# Dừng toàn bộ hệ thống container
docker compose down

# Dừng và xóa sạch toàn bộ cơ sở dữ liệu (Reset sạch sẽ database)
docker compose down -v
```

---

## 🌐 Deploy Production (Online)

Khi triển khai thực tế trên Internet, chúng ta chia tách để tận dụng tối đa các gói Cloud miễn phí:

1. **MySQL Database**: Tạo tài khoản và Cluster MySQL miễn phí trên **[Aiven.io](https://aiven.io)** ➔ Nhận chuỗi kết nối `DATABASE_URL`.
2. **Backend Express**: Đẩy thư mục `/backend` lên **[Render.com](https://render.com)** (Chọn Web Service) ➔ Thêm biến môi trường `DATABASE_URL` trỏ vào DB của Aiven. Nhận URL backend từ Render (ví dụ: `https://api.onrender.com`).
3. **Frontend React**: Đẩy thư mục `/frontend` lên **[Vercel.com](https://vercel.com)** ➔ Thêm biến môi trường `VITE_API_URL` trỏ về URL backend của Render.

---

## 📄 Tài liệu thêm & License

* **Giấy phép**: Dự án mã nguồn mở theo chuẩn Apache 2.0.
* **Liên kết**: Dự án được xây dựng phục vụ việc học tập kỹ năng Fullstack, Dockerize và Cloud Deployment.
# home-lab
