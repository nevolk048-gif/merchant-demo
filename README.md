# Merchant Demo - Тестовый мерчант для PaymentsGate

Простое веб-приложение для тестирования интеграции с PaymentsGate.

## 🎯 Функционал

### 💳 Демо пополнения (`index.html`)
- Форма пополнения баланса
- Быстрый выбор суммы (100₽, 200₽, 500₽, 1000₽, 2000₽, 5000₽)
- Выбор страны
- Отображение реквизитов для оплаты
- Автоматическое обновление статуса транзакции (polling каждые 5 сек)
- Обновление баланса после успешной оплаты

### 🔌 Интеграция API (`integration.html`)
- Полная документация API
- Настройка API ключа и endpoint'а
- Примеры кода на JavaScript, Python, cURL
- Описание форматов запросов/ответов
- Инструкция по проверке webhook подписи

### 🔔 Webhook тестер (`webhook.html`)
- Тестирование webhook endpoint'а
- Логи входящих событий
- Отправка тестовых webhook'ов
- Инструкция по настройке с ngrok

## 🚀 Деплой

### Вариант 1: Railway (рекомендуется)

1. **Создайте репозиторий на GitHub:**
```bash
cd ~/Desktop/merchant-demo
git init
git add .
git commit -m "Initial commit: Merchant demo"
git branch -M main
git remote add origin https://github.com/ваш-username/merchant-demo.git
git push -u origin main
```

2. **Задеплойте на Railway:**
   - Зайдите на [railway.app](https://railway.app)
   - Нажмите "New Project" → "Deploy from GitHub repo"
   - Выберите репозиторий `merchant-demo`
   - Railway автоматически определит настройки из `railway.json`
   - После деплоя откройте Settings → Generate Domain

3. **Настройте приложение:**
   - Откройте ваш домен (например, `merchant-demo.up.railway.app`)
   - Перейдите в раздел "🔌 Интеграция"
   - Укажите URL вашего PaymentsGate API
   - Введите API ключ из базы данных

### Вариант 2: Vercel

```bash
cd ~/Desktop/merchant-demo
npm install -g vercel
vercel
```

Следуйте инструкциям в терминале.

### Вариант 3: Netlify

1. Перетащите папку `merchant-demo` на [app.netlify.com/drop](https://app.netlify.com/drop)
2. Готово!

### Вариант 4: GitHub Pages

```bash
cd ~/Desktop/merchant-demo
git init
git add .
git commit -m "Initial commit"
git branch -M gh-pages
git remote add origin https://github.com/ваш-username/merchant-demo.git
git push -u origin gh-pages
```

Включите GitHub Pages в настройках репозитория (Settings → Pages → Source: gh-pages).

## 🛠️ Локальная разработка

### С помощью Node.js:
```bash
cd ~/Desktop/merchant-demo
npm install
npm start
```

### С помощью Python:
```bash
cd ~/Desktop/merchant-demo
python -m http.server 3000
```

### С помощью PHP:
```bash
cd ~/Desktop/merchant-demo
php -S localhost:3000
```

Затем откройте http://localhost:3000

## ⚙️ Настройка

1. **Получите API ключ из базы данных:**
```sql
SELECT id, name, api_key FROM casinos WHERE name = 'Demo Casino';
```

2. **Откройте приложение** и перейдите в "🔌 Интеграция"

3. **Заполните форму:**
   - **API URL**: URL вашего PaymentsGate (например, `https://your-project.up.railway.app/api/v1`)
   - **API Key**: Ключ из базы данных
   - **Casino ID**: ID казино из базы данных

4. **Нажмите "💾 Сохранить настройки"**

5. **Перейдите на главную** и протестируйте пополнение

## 🧪 Тестирование

1. Откройте главную страницу
2. Выберите сумму (например, 200 ₽)
3. Выберите страну (например, Россия)
4. Нажмите "Пополнить баланс"
5. Приложение создаст транзакцию в PaymentsGate
6. Вы увидите реквизиты для оплаты
7. Статус будет автоматически обновляться

## 🔗 CORS

Если получаете ошибку CORS:

1. **Backend на Railway/Production**: Добавьте домен merchant-demo в CORS белый список
2. **Локальная разработка**: Используйте расширение браузера [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock)

Или обновите CORS настройки в backend:
```go
config := cors.DefaultConfig()
config.AllowOrigins = []string{
    "http://localhost:3000",
    "https://merchant-demo.up.railway.app"
}
```

## 📁 Структура проекта

```
merchant-demo/
├── index.html          # Главная страница (форма пополнения)
├── integration.html    # Документация API и настройки
├── webhook.html        # Тестер webhook'ов
├── package.json        # Зависимости для деплоя
├── railway.json        # Конфиг для Railway
├── .gitignore         # Git ignore файл
└── README.md          # Документация
```

## 🔔 Webhook

Для получения webhook уведомлений:

1. **Локальная разработка**: Используйте ngrok
```bash
ngrok http 3000
```

2. **Production**: URL будет вида `https://ваш-домен.com/api/webhooks/paymentsgate`

3. **Обновите в БД:**
```sql
UPDATE casinos 
SET webhook_url = 'https://ваш-домен.com/api/webhooks/paymentsgate' 
WHERE id = 'ваш_casino_id';
```

## 📋 Требования

- Современный браузер (Chrome, Firefox, Safari, Edge)
- PaymentsGate API (backend должен быть запущен)
- API ключ из базы данных

## 🆘 Troubleshooting

**Проблема**: "Failed to fetch"
- **Решение**: Проверьте, что backend запущен и доступен по указанному URL

**Проблема**: "401 Unauthorized"
- **Решение**: Проверьте правильность API ключа

**Проблема**: CORS ошибка
- **Решение**: Добавьте домен в CORS whitelist на backend

**Проблема**: Статус не обновляется
- **Решение**: Проверьте, что webhook настроен и провайдер отправляет события

## 📞 Поддержка

Если возникли проблемы, проверьте:
1. Console в браузере (F12 → Console)
2. Network вкладку (F12 → Network)
3. Логи backend сервера

## 📝 Лицензия

MIT
