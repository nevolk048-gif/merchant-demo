# Webhook Endpoint Fix

## Проблема
PaymentsGate отправлял webhook на `https://merchant-demo.up.railway.app/api/webhooks/paymentsgate`, но получал 404, потому что endpoint не существовал.

## Решение
Добавлен Vercel Serverless Function для приема webhook'ов.

## Что добавлено

### 1. `/api/webhooks/paymentsgate.js`
- Vercel Serverless Function для приема webhook'ов от PaymentsGate
- Проверка HMAC подписи (timestamp.uuid.body)
- Логирование всех входящих webhook'ов
- Возвращает 200 OK для подтверждения получения

### 2. `/vercel.json`
- Конфигурация для Vercel
- Настройка роутинга для API endpoints
- Environment variable `CASINO_SECRET_KEY`

## Деплой на Vercel

```bash
cd ~/Desktop/merchant-demo
git add api/ vercel.json
git commit -m "Add webhook endpoint for PaymentsGate"
git push
```

После деплоя:
1. Vercel автоматически создаст endpoint: `https://your-domain.vercel.app/api/webhooks/paymentsgate`
2. Обновите webhook_url в базе PaymentsGate:

```sql
UPDATE casinos 
SET webhook_url = 'https://your-vercel-domain.vercel.app/api/webhooks/paymentsgate'
WHERE name = 'Demo Casino';
```

## Environment Variables на Vercel
В настройках проекта на Vercel добавьте:
- `CASINO_SECRET_KEY` = `sk_demo_casino_secret_key_12345678`

## Проверка работы
После деплоя webhook endpoint будет:
- Принимать POST запросы
- Проверять подпись
- Логировать события в Vercel Functions Logs
- Возвращать 200 OK (ошибка 404 исчезнет)
