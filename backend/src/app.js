import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';

// Khởi tạo ứng dụng Express
const app = express();

// --- MIDDLEWARES ---

// 1. Cấu hình CORS (Cross-Origin Resource Sharing)
// Cho phép ứng dụng Frontend (chạy ở domain khác, ví dụ localhost:5173 hoặc Vercel) 
// có thể thực hiện các cuộc gọi API tới Backend này mà không bị trình duyệt chặn.
app.use(cors());

// Bạn cũng có thể khóa chặt CORS chỉ cho phép domain Frontend của bạn trên Production bằng cách:
/*
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
*/

// 2. Middleware phân tích cú pháp JSON (Body Parser)
// Cho phép Express đọc và hiểu dữ liệu định dạng JSON được gửi lên từ Frontend trong `req.body`
app.use(express.json());

// 3. Logger đơn giản để theo dõi các request đến server
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API ROUTES ---

// Gắn các routes xử lý công việc vào tiền tố `/api/todos`
app.use('/api/todos', todoRoutes);

// Route mặc định để kiểm tra trạng thái hoạt động của Backend (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Chào mừng bạn đến với Premium Todo Application API!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- ERROR HANDLING MIDDLEWARE ---

// Middleware bắt lỗi toàn cục (Global Error Handler)
// Khi bất kỳ API nào gặp lỗi crash ngoài ý muốn, middleware này sẽ bắt lại và trả về mã lỗi 500 đẹp đẽ
app.use((err, req, res, next) => {
  console.error('Lỗi hệ thống nghiêm trọng:', err.stack);
  res.status(500).json({
    message: 'Đã xảy ra lỗi hệ thống nghiêm trọng!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

export default app;
