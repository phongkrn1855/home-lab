import dotenv from 'dotenv';
import app from './app.js';
import connectDB, { sequelize } from './config/db.js';

// Nạp các biến môi trường từ file .env
dotenv.config();

/**
 * Khởi động Server Backend
 * Cơ chế hoạt động:
 * 1. Gọi hàm connectDB() để xác thực kết nối MySQL.
 * 2. Thực hiện `sequelize.sync()` để tự động quét toàn bộ model
 *    và tạo bảng `todos` trong Database nếu bảng này chưa tồn tại.
 * 3. Bắt đầu lắng nghe kết nối HTTP trên Port được chỉ định.
 */
const startServer = async () => {
  try {
    // 1. Kết nối và xác thực cơ sở dữ liệu MySQL
    await connectDB();

    // 2. Đồng bộ hóa cấu trúc Database (Table Sync)
    // Tùy chọn { alter: true } có thể dùng ở môi trường phát triển để tự động cập nhật cột nếu model thay đổi.
    // Lệnh sync() không xóa dữ liệu cũ, chỉ tạo bảng nếu chưa có.
    console.log('Đang đồng bộ hóa cấu trúc bảng MySQL...');
    await sequelize.sync();
    console.log('Đồng bộ hóa bảng MySQL thành công!');

    // Lấy cổng PORT từ biến môi trường
    const PORT = process.env.PORT || 5000;

    // 3. Khởi chạy server Express
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` SERVER ĐANG CHẠY TRÊN PORT: ${PORT}`);
      console.log(` Môi trường: ${process.env.NODE_ENV || 'development'}`);
      console.log(` URL Local: http://localhost:${PORT}`);
      console.log(` API Endpoint: http://localhost:${PORT}/api/todos`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Không thể khởi chạy Server Backend do lỗi:', error.message);
    process.exit(1);
  }
};

startServer();
