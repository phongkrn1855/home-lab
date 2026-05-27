import React, { useState } from 'react';

/**
 * Component Form dùng để nhập và thêm nhiệm vụ mới.
 * Tích hợp kiểm tra tính hợp lệ dữ liệu (validation) cơ bản.
 */
const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra nếu tiêu đề rỗng hoặc chỉ toàn khoảng trắng thì không làm gì cả
    if (!title.trim()) return;

    // Gọi callback từ component cha (App.jsx) để thêm todo vào DB
    onAddTodo(title);

    // Reset lại ô nhập dữ liệu
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="todo-input-wrapper">
        <input
          id="todo-input-field"
          type="text"
          className="todo-input"
          placeholder="Thêm một công việc mới..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          autoComplete="off"
        />
      </div>
      <button 
        id="btn-add-todo"
        type="submit" 
        className="btn-add"
        disabled={!title.trim()}
      >
        {/* Biểu tượng dấu cộng SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Thêm</span>
      </button>
    </form>
  );
};

export default TodoForm;
