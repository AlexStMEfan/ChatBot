# ChatBot Platform

Приложение для общения с нейросетями, поддерживающее различные модели (ChatGPT, YandexGPT, GigaChat и другие), темную/светлую тему, авторизацию, а также экспорт чатов и командную работу.

## 🚀 Технологии

- ⚛️ React 18+ + TypeScript
- 🎨 Ant Design v5
- 🌙 Поддержка темной/светлой темы
- 🌐 React Router
- 🔒 VK ID, Yandex 360, OAuth
- 📦 Docker, Nginx
- ☁️ Cloud.ru Evolution Container App

---

## 📦 Установка и запуск

### Локальный запуск

```bash
git clone https://github.com/your-org/chatbot.git
cd chatbot
npm install
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

### Сборка для продакшена

```bash
npm run build
```

Файлы будут собраны в папку `build/`. Для развёртывания можно использовать nginx или контейнеризацию через Docker.

---

## 🐳 Docker

```bash
docker build -t chatbot .
docker run -p 3000:80 chatbot
```

## ⚙️ Сценарии

| Скрипт            | Описание                              |
|------------------|---------------------------------------|
| `npm start`       | Запуск dev-сервера                    |
| `npm run build`   | Сборка продакшн-версии                |
| `npm test`        | Запуск тестов                         |
| `npm run eject`   | Извлечение конфигурации CRA (опасно)  |

---

## 🧠 Поддерживаемые модели

- OpenAI ChatGPT
- YandexGPT
- GigaChat
- Qwen
- DeepSeek (через OpenRouter)

---

## 📂 Структура проекта

```
src/
├── components/      # Компоненты UI (Sidebar, ChatWindow, SendMessage)
├── pages/           # Страницы (LoginPage, MainPage и т.д.)
├── assets/          # Иконки, стили
├── utils/           # Хелперы и утилиты
└── App.tsx          # Основной роутинг
```

---

## 🔐 Аутентификация

- Вход через Yandex 360 (OAuth)
- VK ID (OneTap)
- Email + пароль
- SSO (Single Sign-On)

---

## 📄 Лицензия

[MIT](LICENSE)
