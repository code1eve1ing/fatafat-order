# Products Microservice

This is the products microservice for the FataFat Order system, handling menu sections and products management.

## Features

- **Menu Sections CRUD**: Create, read, update, and delete menu sections
- **Products CRUD**: Create, read, update, and delete products
- **Shop-based Organization**: All data is organized by shop ID
- **Authentication**: JWT-based authentication middleware
- **Validation**: Input validation using express-validator
- **Rate Limiting**: Protection against excessive requests

## API Endpoints

### Menu Sections
- `POST /api/menu-sections` - Create a new menu section
- `GET /api/menu-sections/shop/:shopId` - Get all menu sections for a shop
- `GET /api/menu-sections/:id` - Get a single menu section by ID
- `PUT /api/menu-sections/:id` - Update a menu section
- `DELETE /api/menu-sections/:id` - Delete a menu section

### Products
- `POST /api/products` - Create a new product
- `GET /api/products/shop/:shopId` - Get all products for a shop
- `GET /api/products/menu-section/:menuSectionId` - Get products by menu section
- `GET /api/products/:id` - Get a single product by ID
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Health Check
- `GET /health` - Health check endpoint

## Data Models

### Menu Section
```javascript
{
  _id: ObjectId,
  name: String,
  shop_id: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  shop_id: ObjectId,
  name: String,
  menu_section_id: ObjectId,
  price: Number,
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Navigate to the products server directory:
```bash
cd server/products
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/fatafat-products
JWT_SECRET=your_jwt_secret_key_here
```

5. Start the development server:
```bash
npm run dev
```

The server will start on port 5001 (or the port specified in your .env file).

## Development

### Project Structure
```
server/products/
├── controllers/          # Request handlers
│   ├── menuSectionController.ts
│   └── productController.ts
├── middleware/           # Custom middleware
│   ├── auth.ts
│   ├── rateLimit.ts
│   └── validation.ts
├── models/              # Database models
│   ├── MenuSection.ts
│   └── Product.ts
├── routes/              # API routes
│   ├── menuSection.ts
│   └── product.ts
├── app.ts               # Express app configuration
├── server.ts            # Server entry point
└── package.json
```

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Authentication

All write operations (POST, PUT, DELETE) require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error description",
  "errors": [] // Validation errors (if applicable)
}
```

## Rate Limiting

- General endpoints: 100 requests per 15 minutes per IP
- Product endpoints: 50 requests per 15 minutes per IP

## Integration with Client

The client-side integration is handled through:
- `client/src/services/api.js` - API configuration for products service
- `client/src/services/shopkeeperService.js` - Service layer integration
- `client/src/hooks/useShopkeeper.jsx` - React hook for state management

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/fatafat-products |
| JWT_SECRET | JWT signing secret | - |

## Contributing

1. Follow the existing code structure and patterns
2. Add proper TypeScript types
3. Include input validation for all endpoints
4. Add error handling for all operations
5. Update this README when adding new features
