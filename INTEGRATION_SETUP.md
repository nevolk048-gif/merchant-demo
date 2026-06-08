# 🔗 Полная настройка интеграции Casino ↔ PaymentsGate

## Шаг 1: Получить данные казино из БД

После создания казино в PaymentsGate, выполните SQL запрос:

```sql
SELECT
    id,
    name,
    api_key,
    merchant_id,
    base_url,
    secret_key,
    webhook_url,
    status
FROM casinos
WHERE name = 'Demo Casino';
```

Вы получите:

| Поле | Значение | Назначение |
|------|----------|-----------|
| `id` | `918cb745-...` | UUID казино (Casino ID) |
| `api_key` | `ck_...` | API ключ для авторизации запросов от казино к PaymentsGate |
| `merchant_id` | `casino_demo_001` | Идентификатор мерчанта |
| `base_url` | `https://merchant-demo.up.railway.app` | URL приложения казино |
| `secret_key` | `sk_demo_casino_...` | Секретный ключ для проверки webhook подписей |
| `webhook_url` | `https://merchant-demo.up.railway.app/api/webhooks/paymentsgate` | Endpoint для получения webhook |

## Шаг 2: Настроить Merchant Demo приложение

### 2.1. Задеплоить на Railway

1. Создайте репозиторий на GitHub:
```bash
cd ~/Desktop/merchant-demo
git remote add origin https://github.com/nevolk048-gif/merchant-demo.git
git branch -M main
git push -u origin main
```

2. Зайдите на https://railway.app
3. New Project → Deploy from GitHub repo
4. Выберите `merchant-demo`
5. Settings → Generate Domain
6. Скопируйте URL (например, `merchant-demo-production-abc123.up.railway.app`)

### 2.2. Обновить webhook URL в БД

После получения домена Railway, обновите БД:

```sql
UPDATE casinos
SET
    base_url = 'https://merchant-demo-production-abc123.up.railway.app',
    webhook_url = 'https://merchant-demo-production-abc123.up.railway.app/api/webhooks/paymentsgate'
WHERE name = 'Demo Casino';
```

### 2.3. Настроить приложение

1. Откройте ваш merchant-demo URL
2. Перейдите в **"🔌 Интеграция"**
3. Заполните форму:
   - **API URL**: `https://your-paymentsgate.up.railway.app/api/v1`
   - **API Key**: Скопируйте `api_key` из БД
   - **Casino ID**: Скопируйте `id` из БД
4. Нажмите **"💾 Сохранить настройки"**

## Шаг 3: Тестирование

### 3.1. Создать депозит

1. Откройте главную страницу merchant-demo
2. Выберите сумму (например, 200 ₽)
3. Нажмите "Пополнить баланс"
4. Вы увидите реквизиты для оплаты

### 3.2. Проверить webhook

PaymentsGate отправит webhook на `webhook_url` когда статус изменится:

```json
POST https://merchant-demo.../api/webhooks/paymentsgate

Headers:
  X-Major-Timestamp: 1780913490
  X-Major-Signature: hmac_sha256_hash
  Content-Type: application/json

Body:
{
  "type": "payment.success",
  "object": {
    "uuid": "transaction_id",
    "status": "PAID",
    "amount": 200.0,
    "external_id": "your_tx_id"
  },
  "secret_key": "sk_demo_casino_..."
}
```

### 3.3. Проверить подпись (важно для безопасности!)

Webhook содержит подпись в заголовке `X-Major-Signature`. Проверяйте её:

**Формула:**
```
HMAC-SHA256(timestamp + "." + transaction_id + "." + raw_body, casino_secret_key)
```

**Пример на PHP:**
```php
$timestamp = $_SERVER["HTTP_X_MAJOR_TIMESTAMP"];
$signature = $_SERVER["HTTP_X_MAJOR_SIGNATURE"];
$rawBody = file_get_contents("php://input");
$payload = json_decode($rawBody, true);

$txId = $payload["object"]["uuid"];
$secretKey = "sk_demo_casino_secret_key_12345678"; // Из БД

$dataToSign = $timestamp . "." . $txId . "." . $rawBody;
$expected = hash_hmac("sha256", $dataToSign, $secretKey);

if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit("Invalid Signature");
}

// Обработать событие...
```

## Шаг 4: Данные для интеграции (что передать казино)

Казино нужно предоставить следующую информацию:

### 📋 Данные для интеграции с PaymentsGate

**API Endpoint:**
```
https://your-paymentsgate.up.railway.app/api/v1
```

**Авторизация:**
```
Header: X-API-Key: ck_demo_test_api_key_123456
```

**Casino ID:**
```
918cb745-6b24-404e-814b-9c69b96f4671
```

**Secret Key (для проверки webhook подписей):**
```
sk_demo_casino_secret_key_12345678
```

**Webhook URL (куда PaymentsGate отправляет уведомления):**
```
https://merchant-demo-production-abc123.up.railway.app/api/webhooks/paymentsgate
```

### 📖 Документация API:

Полная документация доступна в merchant-demo приложении в разделе "🔌 Интеграция"

## Поток данных

```
┌─────────────────┐
│  Casino/Merchant│
│   (Frontend)    │
└────────┬────────┘
         │ 1. POST /transactions/deposit
         │    Header: X-API-Key
         ▼
┌─────────────────┐
│  PaymentsGate   │
│      API        │
└────────┬────────┘
         │ 2. Route to Provider
         ▼
┌─────────────────┐
│  MajorPay       │
│   Provider      │
└────────┬────────┘
         │ 3. Webhook: payment.success
         ▼
┌─────────────────┐
│  PaymentsGate   │
│  (webhook rcv)  │
└────────┬────────┘
         │ 4. Update status in DB
         │ 5. Send webhook to casino
         ▼
┌─────────────────┐
│  Casino/Merchant│
│  (webhook rcv)  │
└─────────────────┘
```

## Troubleshooting

**Проблема:** Webhook не приходят
- Проверьте, что `webhook_url` правильно указан в БД
- Проверьте логи PaymentsGate: `[SUCCESS] Webhook sent to ...` или `[ERROR] Failed to send webhook`
- Убедитесь, что endpoint доступен публично (не localhost)

**Проблема:** Signature mismatch
- Убедитесь, что используете правильный `secret_key` из БД
- Проверьте формат: `timestamp + "." + tx_id + "." + raw_body`
- Используйте RAW body (до парсинга JSON)

**Проблема:** 401 Unauthorized
- Проверьте правильность `api_key`
- Убедитесь, что заголовок называется `X-API-Key` (не `Authorization`)

## Готово! 🎉

Теперь у вас полностью настроена интеграция:
- ✅ PaymentsGate может принимать депозиты от казино
- ✅ PaymentsGate отправляет webhook уведомления казино
- ✅ Казино проверяет подписи для безопасности
- ✅ Все работает end-to-end
