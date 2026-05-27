import React, { useState } from 'react';
import TodoItem from './TodoItem';

/**
 * Component hiển thị danh sách các Todo kèm bộ lọc phân loại.
 * Các bộ lọc gồm: Tất cả (All), Đang làm (Pending), Đã xong (Completed).
 */
const TodoList = ({ todos, onToggleTodo, onDeleteTodo }) => {
  const [filter, setFilter] = useState('all'); // all, pending, completed

  // Lọc danh sách công việc dựa trên filter đang active
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // mặc định 'all'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Bộ lọc thanh Tab */}
      <div className="filters-menu" role="tablist">
        <button
          id="filter-btn-all"
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          role="tab"
          aria-selected={filter === 'all'}
        >
          Tất cả ({todos.length})
        </button>
        <button
          id="filter-btn-pending"
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
          role="tab"
          aria-selected={filter === 'pending'}
        >
          Đang làm ({todos.filter(t => !t.completed).length})
        </button>
        <button
          id="filter-btn-completed"
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
          role="tab"
          aria-selected={filter === 'completed'}
        >
          Đã xong ({todos.filter(t => t.completed).length})
        </button>
      </div>

      {/* Danh sách nhiệm vụ sau khi lọc */}
      <div className="todos-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))
        ) : (
          /* Trạng thái trống (Empty State) siêu đẹp mắt */
          <div className="empty-state">
            <span className="empty-icon" role="img" aria-label="Nhiệm vụ trống">
              {filter === 'completed' ? '🎉' : '✨'}
            </span>
            <p>
              {filter === 'all' && 'Không có công việc nào. Hãy thêm công việc mới!'}
              {filter === 'pending' && 'Tuyệt vời! Không còn công việc nào đang chờ xử lý.'}
              {filter === 'completed' && 'Chưa có công việc nào được hoàn thành.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
