# gRPC Connection Troubleshooting Guide

## Current Issue: Connection Refused

The error `ECONNREFUSED ::1:50051` indicates the gRPC client cannot connect to the auth service.

## Steps to Fix:

### 1. Install Dependencies
Make sure both services have the gRPC dependencies installed:

```bash
# Auth service
cd server/auth
npm install

# Products service  
cd server/products
npm install
```

### 2. Start Services in Correct Order

**IMPORTANT**: Start the auth service FIRST, then the products service.

```bash
# Terminal 1 - Start Auth Service (gRPC Server)
cd server/auth
npm run dev
```

Wait for the message: `gRPC server running on 127.0.0.1:50051`

```bash
# Terminal 2 - Start Products Service (gRPC Client)
cd server/products
npm run dev
```

### 3. Verify Connection

You should see:
- Auth service: `gRPC server running on 127.0.0.1:50051 (port 50051)`
- Products service: `✅ gRPC connection to auth service established`

### 4. Test the API

Test the shop validation endpoint:
```bash
curl http://localhost:5001/api/shops/by-code/SHOP-0001
```

## Common Issues:

1. **Port Already in Use**: Change GRPC_PORT in auth service .env file
2. **IPv6 vs IPv4**: Updated to use 127.0.0.1 instead of localhost
3. **Service Order**: Auth service must start before products service
4. **Dependencies**: Make sure @grpc/grpc-js and @grpc/proto-loader are installed

## Environment Variables:

**Auth Service (.env):**
```env
GRPC_PORT=50051
```

**Products Service (.env):**
```env
AUTH_GRPC_URL=127.0.0.1:50051
```

## Success Indicators:

- ✅ Auth service shows: `gRPC server running on 127.0.0.1:50051`
- ✅ Products service shows: `gRPC connection to auth service established`
- ✅ API endpoint `/api/shops/by-code/SHOP-XXXX` returns shop data
