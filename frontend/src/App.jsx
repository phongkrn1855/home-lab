import React, { useState, useEffect } from 'react';
import './App.css';
import Stats from './components/Stats';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

/**
 * Component chính của ứng dụng Todo.
 * Chịu trách nhiệm quản lý state toàn cục, gọi các API CRUD tới backend,
 * và điều khiển các thông báo Toast.
 */
function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 1. LẤY BIẾN MÔI TRƯỜNG CẤU HÌNH API
  // Vite nạp biến môi trường thông qua `import.meta.env` thay vì `process.env` của Node.
  // Chúng ta thiết lập fallback dự phòng là 'http://localhost:5000' để chạy local ngay mà không bị lỗi.
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_ENDPOINT = `${API_URL}/api/todos`;

  // 2. HIỂN THỊ THÔNG BÁO TOAST TỰ ĐỘNG ẨN
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // 3. FETCH DATA - Tải danh sách Todo từ Database qua Backend API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      
      console.log(`Đang gọi API lấy danh sách tại: ${API_ENDPOINT}`);
      const response = await fetch(API_ENDPOINT);
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách công việc từ máy chủ.');
      }
      
      const data = await response.ok ? await response.json() : [];
      setTodos(data);
    } catch (error) {
      console.error('Lỗi khi gọi API GET:', error);
      showToast('Không kết nối được tới Backend Server!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchTodos lần đầu khi ứng dụng được render (mount)
  useEffect(() => {
    fetchTodos();
  }, []);

  // 4. ADD TODO - Thêm công việc mới vào database
  const handleAddTodo = async (title) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi lưu công việc.');
      }

      const newTodo = await response.json();
      // Cập nhật state nội bộ ngay lập tức để UI render mượt mà mà không cần reload
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      showToast('Đã thêm công việc thành công!');
    } catch (error) {
      console.error('Lỗi khi POST todo:', error);
      showToast(error.message || 'Lỗi kết nối máy chủ.', 'error');
    }
  };

  // 5. TOGGLE TODO - Đổi trạng thái hoàn thành (completed)
  const handleToggleTodo = async (id, currentCompletedStatus) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Gửi trạng thái ngược lại với trạng thái hiện tại
        body: JSON.stringify({ completed: !currentCompletedStatus }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái.');
      }

      const updatedTodo = await response.json();
      
      // Tìm todo vừa update trong state và thay thế bằng dữ liệu mới từ database
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      
      if (updatedTodo.completed) {
        showToast('Chúc mừng! Đã hoàn thành một công việc 🎉');
      } else {
        showToast('Đã đánh dấu công việc chưa hoàn thành.');
      }
    } catch (error) {
      console.error('Lỗi khi PUT todo status:', error);
      showToast('Lỗi cập nhật trạng thái.', 'error');
    }
  };

  // 6. DELETE TODO - Xóa hẳn công việc
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa nhiệm vụ.');
      }

      // Loại bỏ todo vừa xóa khỏi state để cập nhật UI ngay lập tức
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      showToast('Đã xóa công việc khỏi danh sách.');
    } catch (error) {
      console.error('Lỗi khi DELETE todo:', error);
      showToast('Không thể xóa công việc.', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Tiêu đề ứng dụng (SEO chuẩn: chỉ dùng duy nhất 1 thẻ h1 toàn trang) */}
      <header className="header">
        <h1>TASKFLOW</h1>
        <p>Hệ thống quản lý công việc cá nhân cao cấp</p>
        
        {/* Badge kiểm thử CI/CD siêu trực quan */}
        <div className="cicd-badge">
          <span className="pulse-dot"></span>
          <span>CI/CD: Auto-Deployed via GitHub Actions 🚀</span>
        </div>
      </header>

      <main className="glass-panel">
        {/* Component hiển thị thống kê & tiến trình */}
        <Stats todos={todos} />

        {/* Form để thêm Todo mới */}
        <TodoForm onAddTodo={handleAddTodo} />

        {/* Trạng thái tải dữ liệu hoặc hiển thị danh sách */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" aria-label="Đang tải dữ liệu"></div>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
      </main>

      {/* Thông báo Toast hiện lên ở góc màn hình khi hành động thành công/lỗi */}
      {toast.show && (
        <div className={`toast ${toast.type}`} role="alert">
          {toast.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
