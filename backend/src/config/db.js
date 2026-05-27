import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Đảm bảo các biến môi trường được tải
dotenv.config();

let sequelize;

// HỖ TRỢ ĐỒNG THỜI CẢ 2 PHƯƠNG THỨC KẾT NỐI:
// 1. Nếu có chuỗi kết nối DATABASE_URL (khuyên dùng khi deploy Cloud)
if (process.env.DATABASE_URL) {
  console.log('Phát hiện chuỗi kết nối DATABASE_URL. Đang cấu hình kết nối Sequelize...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false, // Tắt hiển thị các câu lệnh SQL thô trong console để tránh rối mắt
    define: {
      timestamps: true // Tự động quản lý createdAt và updatedAt cho tất cả các bảng
    }
  });
} 
// 2. Sử dụng các tham số kết nối riêng lẻ (Thường dùng cho local development)
else {
  console.log('Không có DATABASE_URL. Sử dụng cấu hình kết nối riêng lẻ...');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'todo_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true
      }
    }
  );
}

/**
 * Hàm kiểm tra kết nối tới MySQL Database thông qua Sequelize ORM
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công tới cơ sở dữ liệu MySQL!');
  } catch (error) {
    console.error('LỖI: Không thể kết nối tới cơ sở dữ liệu MySQL:', error.message);
    console.error('Vui lòng kiểm tra lại cấu hình DB trong file .env hoặc đảm bảo dịch vụ MySQL đang chạy.');
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
