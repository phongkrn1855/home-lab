# Sử dụng Node.js bản nhẹ (alpine) làm Base Image
FROM node:20-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép các file quản lý thư viện trước để tận dụng Docker cache layer
COPY package*.json ./

# Cài đặt các thư viện (sử dụng npm install để tương thích khi chưa có package-lock.json)
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn backend vào container
COPY . .

# Thông báo port mà ứng dụng sẽ chạy bên trong container
EXPOSE 5000

# Khởi chạy server backend
CMD ["npm", "start"]
