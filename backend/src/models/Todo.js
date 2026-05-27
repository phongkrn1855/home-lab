import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Định nghĩa cấu trúc bảng (Table Schema) "Todos" trong MySQL sử dụng Sequelize ORM.
 * Sequelize sẽ tự động ánh xạ Model này thành bảng `Todos` trong cơ sở dữ liệu.
 */
const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tiêu đề nhiệm vụ không được để trống.'
      },
      len: {
        args: [1, 100],
        msg: 'Tiêu đề không được dài quá 100 ký tự.'
      }
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  // Các tùy chọn bổ sung cho table
  tableName: 'todos', // Ép buộc tên bảng chính xác trong MySQL là "todos"
  timestamps: true    // Tự động tạo 2 cột: createdAt và updatedAt
});

export default Todo;
