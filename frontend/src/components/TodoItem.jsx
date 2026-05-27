import React from 'react';

/**
 * Component hiển thị một công việc đơn lẻ.
 * Cho phép toggle hoàn thành hoặc xóa công việc với các hiệu ứng chuyển đổi mượt mà.
 */
const TodoItem = ({ todo, onToggleTodo, onDeleteTodo }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed-state' : ''}`}>
      <div className="todo-item-left">
        {/* Checkbox tùy chỉnh hình tròn siêu đẹp */}
        <button
          id={`todo-check-${todo._id}`}
          className={`checkbox-custom ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggleTodo(todo._id, todo.completed)}
          aria-label={todo.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
        ></button>
        
        <span className="todo-text">{todo.title}</span>
      </div>

      {/* Nút xóa công việc */}
      <button
        id={`todo-delete-${todo._id}`}
        className="btn-delete"
        onClick={() => onDeleteTodo(todo._id)}
        title="Xóa công việc này"
        aria-label="Xóa công việc"
      >
        {/* Biểu tượng Thùng rác SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
