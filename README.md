# 🚀 TASKFLOW - Premium Todo App (Fullstack, Docker Compose & CI/CD)

Ứng dụng quản lý công việc (Todo App) cao cấp được thiết kế theo tiêu chuẩn thực tế (**Production-Ready**). Đây là dự án mẫu hoàn chỉnh trình bày kỹ năng phát triển phần mềm Fullstack, đóng gói container và tự động hóa toàn bộ quy trình triển khai bằng **GitHub Actions CI/CD Pipeline**.

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

## 🔁 Luồng Hoạt Động Của CI/CD Pipeline (Tự Động Hóa)

Khi bạn đẩy code mới lên GitHub, quy trình triển khai tự động sẽ được thực thi trên máy chủ Ubuntu của bạn:

```mermaid
graph TD
    Dev[💻 Lập trình viên] -->|1. Push code| GitHub[🐙 GitHub Repo]
    GitHub -->|2. Kích hoạt Workflow| Runner[🖥️ Ubuntu Self-hosted Runner]
    
    subgraph Máy chủ Ubuntu cục bộ (Local VM)
        Runner -->|3. Tải mã nguồn mới| Checkout[📥 Actions Checkout]
        Checkout -->|4. Sinh tệp cấu hình| Env[🔑 Tạo file .env tự động]
        Env -->|5. Khởi động hệ thống| Deploy[🐳 docker compose up -d --build]
        Deploy -->|6. Giải phóng bộ nhớ| Clean[🧹 docker image prune -f]
    end
```

---

## 🚀 Hướng Dẫn Vận Hành CI/CD & Runner Trơn Tru (24/7)

Để GitHub Runner trên máy chủ Ubuntu ảo của bạn hoạt động liên tục ngay cả khi bạn tắt cửa sổ Terminal hoặc tắt SSH, hãy thiết lập nó chạy dưới dạng **Dịch vụ Hệ thống (System Service)**:

### Bước 1: Khởi chạy Runner dưới dạng dịch vụ ngầm (Ubuntu)
Mở Terminal trên máy ảo Ubuntu của bạn, di chuyển vào thư mục runner và thực hiện:

```bash
cd ~/actions-runner

# 1. Cài đặt dịch vụ hệ thống (Cần quyền quản trị)
sudo ./svc.sh install

# 2. Bật và khởi động dịch vụ chạy ngầm
sudo ./svc.sh start

# 3. Kiểm tra trạng thái hoạt động
sudo ./svc.sh status
```
*Từ nay, mỗi khi máy chủ Ubuntu khởi động, GitHub Runner sẽ tự động bật và sẵn sàng nhận lệnh deploy.*

### Bước 2: Cấu hình khóa bảo mật (GitHub Secrets)
Để bảo vệ an toàn cho cơ sở dữ liệu và liên kết đúng địa chỉ IP máy chủ của bạn, hãy vào kho lưu trữ GitHub của bạn ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions** và tạo 2 biến sau:

| Tên Secret | Giá trị mẫu | Ý nghĩa |
| :--- | :--- | :--- |
| 🔑 **DB_PASSWORD** | `rootpassword` | Mật khẩu truy cập tài khoản Root của MySQL CSDL |
| 🌐 **SERVER_IP** | `192.168.1.15` | Địa chỉ IP nội bộ của máy chủ Ubuntu (Giúp máy khách kết nối đúng API) |

---

## 🔗 Service Endpoints (Khi Khởi Chạy Thành Công)

| Dịch vụ | URL | Mô tả |
| :--- | :--- | :--- |
| 💻 **Web UI** | [http://localhost:5173](http://localhost:5173) | Giao diện quản lý công việc Glassmorphism (Hoặc IP máy chủ: `http://<SERVER_IP>:5173`) |
| ⚙️ **Agent API** | [http://localhost:5000/api/todos](http://localhost:5000/api/todos) | RESTful API CRUD (GET, POST, PUT, DELETE) |
| 🗄️ **MySQL DB** | `localhost:3306` | Kết nối CSDL (User: `root`, Pass: `DB_PASSWORD`) |

---

## ⚙️ Cấu trúc project

```text
home-lab/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Kịch bản CI/CD triển khai tự động (GitHub Actions)
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

## 📌 Các Lệnh Vận Hành Tiêu Biểu bằng Docker

```bash
# Xem log trực tiếp của toàn bộ hệ thống đang deploy
docker compose logs -f

# Dừng toàn bộ hệ thống
docker compose down

# Xóa sạch dữ liệu và khởi động lại mới tinh
docker compose down -v
```

---

## 📄 Tài liệu thêm & License

* **Giấy phép**: Dự án mã nguồn mở theo chuẩn Apache 2.0.
* **Liên kết**: Dự án được xây dựng phục vụ việc học tập kỹ năng Fullstack, Dockerize và CI/CD Automation.
