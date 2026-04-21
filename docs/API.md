# API Documentation

This document provides a high-level overview of the MernShop REST API. Start the backend server on `http://localhost:5000` to access these endpoints. 

> [!NOTE]
> All endpoints under `/api/products` (mutations), `/api/orders`, and `/api/users` require an Authorization header containing your JWT Bearer token unless specified otherwise.

## Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/` | Fetch all products | Public |
| GET | `/:id` | Fetch a specific product by ID | Public |
| POST | `/` | Create a new product | Admin |
| PUT | `/:id` | Update an existing product | Admin |
| DELETE | `/:id` | Delete a product | Admin |

## User & Authentication Routes (`/api/users`)

| Method | Endpoint | Description | Access | 
| ------ | -------- | ----------- | ------ |
| POST | `/login` | Authenticate user & get token | Public |
| POST | `/register`| Register a new user | Public |
| GET | `/profile` | Get current user's profile | User |
| PUT | `/profile` | Update user profile | User |
| GET | `/` | Get all users | Super Admin |
| DELETE | `/:id` | Delete a user | Super Admin |
| PUT | `/:id` | Update user role | Super Admin |

## Order Routes (`/api/orders`)

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/` | Create new order | User |
| GET | `/:id` | Get order by ID | User (Own) / Admin |
| GET | `/myorders`| Get logged in user orders | User |
| GET | `/` | Get all orders | Admin |
| PUT | `/:id/pay` | Update order to paid status | User |
| PUT | `/:id/deliver`| Update order to delivered | Admin |

## Authentication Format

When making requests to protected routes, supply the JWT token in your HTTP Headers:
```json
{
  "Authorization": "Bearer <YOUR_JWT_TOKEN>"
}
```

## API Testing Accounts

Refer to the project's internal `ysers.md` or the [Testing Profiles](#) for mock credentials associated with Standard User, Admin, and Super Admin tiers.
