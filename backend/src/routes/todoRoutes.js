import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

/**
 * @route   GET /api/todos
 * @desc    Lấy toàn bộ danh sách Todo từ MySQL
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Truy vấn tất cả Todo trong bảng và sắp xếp theo ngày tạo mới nhất (createdAt DESC)
    const todos = await Todo.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Không thể tải danh sách công việc', error: error.message });
  }
});

/**
 * @route   POST /api/todos
 * @desc    Tạo một Todo mới
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    // Sequelize sẽ tự kiểm tra validation trong Model, tuy nhiên kiểm tra nhanh ở đây để phản hồi sớm
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Tiêu đề nhiệm vụ không được để trống.' });
    }

    // Tạo dòng dữ liệu mới trong bảng todos
    const newTodo = await Todo.create({
      title: title.trim()
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: 'Không thể tạo mới công việc', error: error.message });
  }
});

/**
 * @route   PUT /api/todos/:id
 * @desc    Cập nhật thông tin Todo (completed hoặc title)
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Tìm kiếm công việc theo khóa chính (Primary Key - PK)
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ message: 'Không tìm thấy công việc cần cập nhật.' });
    }

    // Cập nhật các trường dữ liệu nếu có truyền lên từ body
    await todo.update({
      title: title !== undefined ? title.trim() : todo.title,
      completed: completed !== undefined ? completed : todo.completed
    });

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật công việc', error: error.message });
  }
});

/**
 * @route   DELETE /api/todos/:id
 * @desc    Xóa một Todo ra khỏi MySQL
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm kiếm todo cần xóa
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ message: 'Không tìm thấy công việc cần xóa.' });
    }

    // Thực hiện xóa dòng dữ liệu khỏi bảng
    await todo.destroy();

    res.status(200).json({ message: 'Đã xóa công việc thành công.', id });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa công việc', error: error.message });
  }
});

export default router;
