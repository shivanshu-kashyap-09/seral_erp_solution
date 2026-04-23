# Order Management System

A robust Node.js based order processing engine with inventory management and idempotency support.

## Project Structure
```text
/src
  /config         # Database configuration
  /controllers    # REST API controllers
  /routes         # API route definitions
  /services       # Business logic and DB operations
  /utils          # Helper functions (e.g., retry logic)
seral_erp_solution.sql        # Database schema
index.js          # Entry point
```

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Database Setup**:
   - Create a MySQL database (default name: `seral_erp_solution`).
   - Import the `seral_erp_solution.sql` file to create necessary tables.
4. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=seral_erp_solution
   ```
5. **Run the Application**:
   ```bash
   npm start
   ```

## API Documentation

### 1. Create Order (Main API)
**POST** `/api/orders`
- **Description**: Places an order, validates stock, locks inventory, and simulates payment.
- **Request Body**:
  ```json
  {
    "userId": 101,
    "items": [
      { "productId": 1, "qty": 2 },
      { "productId": 2, "qty": 1 }
    ],
    "idempotencyKey": "unique-uuid-123"
  }
  ```
- **Process**: Validates stock -> Locks inventory -> Deducts stock -> Simulates payment -> Updates order status -> Rolls back if failed.

### 2. Get Order Details
**GET** `/api/orders/{orderId}`
- **Returns**: Order details, items, total amount, and status (INIT / PROCESSING / SUCCESS / FAILED / ROLLED_BACK).

### 3. Get All Orders
**GET** `/api/orders`
- **Optional Filters**: `userId`, `status`.

### 4. Product Inventory
**GET** `/api/products`
- **Returns**: List of all products and their current stock levels.

### 5. Add / Update Product
**POST** `/api/products`
- **Description**: Add a new product or update inventory.
- **Request Body**:
  ```json
  {
    "name": "Product Name",
    "stock": 100,
    "price": 49.99
  }
  ```

## Key Features
- **Idempotency**: Prevents duplicate order processing for the same key.
- **Pessimistic Locking**: Prevents race conditions during stock updates.
- **Transaction Management**: Ensures atomicity across orders and inventory.
- **Retry Mechanism**: Automatically retries on database deadlocks.
