# E-Commerce Backend - Authentication Module

## Project Structure

```
Backend/
├── config/
│   └── database.js                 # MongoDB connection
├── controllers/
│   └── authController.js           # Authentication logic
├── middleware/
│   ├── authMiddleware.js           # JWT verification & role checking
│   └── validationMiddleware.js     # Input validation
├── models/
│   └── User.js                     # User schema with roles
├── routes/
│   └── authRoutes.js               # Authentication endpoints
├── utils/
│   └── tokenUtils.js               # JWT token generation & verification
├── server.js                       # Main server file
├── package.json                    # Dependencies
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## Installation

1. Navigate to the Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

5. Ensure MongoDB is running, then start the server:
```bash
npm run dev      # Development mode with auto-reload
npm start        # Production mode
```

The server will be available at `http://localhost:5000`

## Authentication Features

### User Roles
- **Customer**: Browse products, add to cart, place orders
- **Business**: Manage product catalog, pending approval
- **Admin**: Approve/reject businesses, manage platform

### User Model
- **Fields**: name, email, password, role, isActive, isEmailVerified, profile, businessProfile
- **Password**: Hashed with bcrypt, never returned in responses
- **Timestamps**: createdAt, lastLogin, updatedAt

### Business Profile
- **Fields**: businessName, businessEmail, registrationNumber, taxId, documents
- **Approval Status**: pending, approved, rejected
- **Documents**: Support for multiple document uploads with types

## API Endpoints

### Public Routes

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // optional: customer (default), business, admin
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### 3. Refresh Token
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_value"
}

Response (200):
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token"
  }
}
```

#### 4. Logout
```
POST /api/auth/logout

Response (200):
{
  "success": true,
  "message": "Logout successful. Please clear tokens from client side."
}
```

### Protected Routes (Require Authentication)

**Header**: `Authorization: Bearer <token>`

#### 5. Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

#### 6. Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001",
  "profileImage": "image_url"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

#### 7. Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### 8. Health Check
```
GET /api/health

Response (200):
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-03T10:30:00.000Z"
}
```

## Middleware

### authMiddleware.js
- **authMiddleware**: Verifies JWT token from Authorization header
- **requireRole(...roles)**: Checks if user has required role
- **requireEmailVerified**: Ensures email is verified

### validationMiddleware.js
- **validateRegister**: Validates registration data
- **validateLogin**: Validates login credentials
- **validateUpdateProfile**: Validates profile update data
- **validateBusinessRegister**: Validates business registration
- **handleValidationErrors**: Sends validation error responses

## Token Structure

### Access Token (JWT)
- **Payload**: { id, role }
- **Expiration**: 7 days (configurable)
- **Purpose**: API request authentication

### Refresh Token
- **Payload**: { id }
- **Expiration**: 30 days (configurable)
- **Purpose**: Obtain new access token

## Error Handling

Standard error response format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (dev only)"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

## Security Features

✅ Password hashing with bcryptjs
✅ JWT token-based authentication
✅ Role-based access control (RBAC)
✅ Input validation and sanitization
✅ CORS configuration
✅ Password change functionality
✅ Token refresh mechanism
✅ Account active status tracking

## Next Steps

1. **Business Management**: Create business approval endpoints
2. **Product Management**: Add product CRUD operations
3. **Order Management**: Implement order placement and tracking
4. **Admin Features**: Business approval workflows, analytics
5. **Testing**: Add unit and integration tests
6. **Email Verification**: Implement email verification flow
7. **Rate Limiting**: Add rate limiting for security
8. **Logging**: Enhanced logging and monitoring

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT token handling
- **bcryptjs**: Password hashing
- **dotenv**: Environment variables
- **cors**: Cross-Origin Resource Sharing
- **express-validator**: Input validation
- **morgan**: HTTP request logging
- **nodemon**: Auto-reload for development

## Development

For development with auto-reload:
```bash
npm run dev
```

For production:
```bash
npm start
```

## Notes

⚠️ Replace JWT secrets in production
⚠️ Use environment variables for sensitive data
⚠️ Enable email verification in production
⚠️ Implement rate limiting for login attempts
⚠️ Use HTTPS in production
