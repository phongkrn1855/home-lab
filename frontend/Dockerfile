# ==========================================
# STAGE 1: BUILD REACT APP
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Sao chép package.json và cài đặt thư viện trước để tối ưu hóa Docker Cache
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn frontend
COPY . .

# LƯU Ý QUAN TRỌNG: Vite biên dịch (bake) biến môi trường vào mã nguồn JS ngay tại THỜI ĐIỂM BUILD.
# Do đó, chúng ta cần khai báo ARG để truyền biến môi trường từ docker-compose.yml vào lúc build.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Tiến hành biên dịch React thành các file HTML/CSS/JS tĩnh trong thư mục /app/dist
RUN npm run build

# ==========================================
# STAGE 2: SERVE APP WITH NGINX
# ==========================================
FROM nginx:alpine

# Xóa cấu hình mặc định của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Sao chép file cấu hình Nginx tùy chỉnh của chúng ta vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép thư mục dist chứa các file tĩnh được build từ Stage 1 vào thư mục gốc của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 (cổng HTTP mặc định của Nginx)
EXPOSE 80

# Chạy Nginx ở chế độ background (Nginx tự động chạy mặc định khi container khởi động)
CMD ["nginx", "-g", "daemon off;"]
