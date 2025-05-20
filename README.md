# Food Explorer API

## How to Use

### Prerequisites
- Node.js (version 14 or higher)
- NPM or Yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/m-its/food-explorer-api.git
   cd food-explorer-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3333
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run database migrations
   ```bash
   npm run migrate
   ```

5. Start the server
   ```bash
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /users` - Create a new user
- `POST /sessions` - Login and get authentication token

#### Dishes
- `GET /dishes` - List all dishes
- `GET /dishes/:id` - Get a specific dish
- `POST /dishes` - Create a new dish (admin only)
- `PATCH /dishes/:id` - Update a dish (admin only)
- `DELETE /dishes/:id` - Delete a dish (admin only)

#### Orders
- `POST /orders` - Create a new order
- `GET /orders` - List orders (customers see their own, admins see all)

#### Favorites
- `POST /favorites/:dish_id` - Add a dish to favorites
- `GET /favorites` - List favorite dishes
- `DELETE /favorites/:id` - Remove a dish from favorites

### User Roles
- **Admin**: Can manage dishes, view all orders
- **Customer**: Can place orders, manage favorites, view own orders

### Environment Variables
- `PORT`: The port the server will run on (default: 3333)
- `JWT_SECRET`: Secret key for JWT token generation