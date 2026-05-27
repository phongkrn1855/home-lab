import React from 'react';

/**
 * Component hiển thị số liệu thống kê công việc và tiến trình hoàn thành.
 * Giúp người dùng có cái nhìn tổng quan trực quan và nâng tầm thẩm mỹ giao diện.
 */
const Stats = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  
  // Tính toán phần trăm hoàn thành, mặc định là 0% nếu chưa có công việc nào
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stats-info">
        <span className="stats-title">Tiến trình của bạn</span>
        <span className="stats-subtitle">
          {total === 0
            ? 'Chưa có công việc nào cần làm'
            : `${completed}/${total} công việc đã hoàn thành`}
        </span>
      </div>
      
      {total > 0 && (
        <div className="progress-wrapper">
          <span className="progress-percentage">{percentage}%</span>
          <div className="progress-track" aria-label="Tiến trình hoàn thành công việc">
            <div 
              className="progress-bar" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
