# Orders Service

This service handles order management and OTP verification for the FataFat application.

## Features

- **Order Management**: Create, retrieve, and update orders
- **OTP Verification**: Email and SMS OTP verification before order placement
- **Shop Validation**: Validates shop existence via gRPC communication with auth service
- **Rate Limiting**: Protects against spam and abuse
- **Input Validation**: Comprehensive validation for all endpoints

## API Endpoints

### OTP Endpoints

#### Send OTP
```
POST /api/orders/send-otp
Content-Type: application/json

{
  "identifier": "user@example.com" | "9876543210",
  "type": "email" | "mobile"
}
```

#### Verify OTP
```
POST /api/orders/verify-otp
Content-Type: application/json

{
  "identifier": "user@example.com" | "9876543210",
  "otp": "123456",
  "type": "email" | "mobile"
}
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "shop_id": "shop_id_here",
  "customer_email": "user@example.com",
  "customer_mobile": "9876543210",
  "customer_name": "John Doe",
  "items": [
    {
      "product_id": "product_id",
      "product_name": "Product Name",
      "price": 100,
      "quantity": 2
    }
  ],
  "subtotal": 200,
  "tax_amount": 20,
  "total_amount": 220,
  "notes": "Special instructions"
}
```

#### Get Order
```
GET /api/orders/:orderId
```

#### Get Orders by Shop
```
GET /api/orders/shop/:shopId?status=pending&page=1&limit=20
```

#### Update Order Status
```
PATCH /api/orders/:orderId/status
Content-Type: application/json

{
  "status": "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
}
```

## Environment Variables

```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/fatafat_orders
AUTH_GRPC_URL=localhost:50051
PRODUCTS_GRPC_URL=localhost:50052
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start the server:
```bash
npm run dev
```

## Order Flow

1. Customer adds items to cart
2. On checkout, if no email/mobile in auth store, prompt for email/mobile
3. Send OTP to provided email/mobile
4. Verify OTP
5. Create order (only if OTP is verified)
6. Order is saved with pending status

## Rate Limits

- General API: 100 requests per 15 minutes
- OTP requests: 3 requests per minute
- Order creation: 10 requests per 5 minutes

## Dependencies

- Express.js for REST API
- MongoDB with Mongoose for data storage
- gRPC for service communication
- Nodemailer for email OTP
- Twilio for SMS OTP
- Express-validator for input validation
- Express-rate-limit for rate limiting
