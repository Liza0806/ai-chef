# Используем Node.js LTS
FROM node:20-alpine

# Рабочая директория
WORKDIR /usr/src/app

# Копируем package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm
RUN npm install -g pnpm

# Устанавливаем зависимости
RUN pnpm install

# Копируем весь проект
COPY . .

# Генерируем Prisma клиент
RUN pnpm prisma generate

# Экспонируем порт (тот, который слушает backend)
EXPOSE 4000

# Запуск приложения
CMD ["pnpm", "start"]
