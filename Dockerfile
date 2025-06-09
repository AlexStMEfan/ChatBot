# Используем официальный образ Node.js как базовый
# 1. Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# 2. Final stage
FROM nginxinc/nginx-unprivileged
EXPOSE 8080

# создаём нужные папки и меняем права
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx

COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html