# 🛍️ ShopStore — Full-Stack E-Commerce Portfolio

A production-grade headless e-commerce application built with React, Node.js, PostgreSQL, and Prisma.
Designed as a showcase-ready portfolio project demonstrating real-world architecture and clean code.

---

## 🧱 Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React 18, Vite, TailwindCSS, React Router v6   |
| State       | Context API + useReducer                        |
| HTTP Client | Axios with interceptors                         |
| Backend     | Node.js, Express.js                             |
| Database    | PostgreSQL + Prisma ORM                         |
| Auth        | JWT + bcryptjs                                  |
| Security    | Helmet, CORS, express-validator                 |
| Dev Tools   | Nodemon, ESLint, Prisma Studio                  |

---

## 📁 Project Structure

```
shopify-store/
├── public/
│   └── index.html
├── src/
│   ├── api/              ← Axios instance + interceptors
│   ├── assets/           ← Static files
│   ├── components/       ← Reusable UI components
│   ├── context/          ← AuthContext, CartContext, WishlistContext
│   ├── data/             ← Mock Shopify data shapes
│   ├── hooks/            ← Custom React hooks
│   ├── pages/            ← All 9 page components
│   ├── services/         ← API service layer
│   ├── App.jsx
│   └── main.jsx
└── server/
    ├── api/v1/           ← Versioned route mounting
    ├── controllers/      ← Request handlers
    ├── middleware/        ← Auth, error, validation, logger
    ├── models/           ← Prisma data access layer
    ├── prisma/           ← Schema + seed
    ├── routes/           ← Express routers
    └── settings/         ← Config, constants, DB singleton
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL 15+ (local or cloud via [Neon.tech](https://neon.tech))
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shopify-store.git
cd shopify-store
```

---

### 2. Setup the Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/shopify_store?schema=public"
JWT_SECRET=your_long_random_secret_here
```

Run database setup:
```bash
npx prisma migrate dev --name init   # Creates all tables
npx prisma generate                  # Generates Prisma client
node prisma/seed.js                  # Seeds products + users
```

Start the server:
```bash
npm run dev
# → http://localhost:5000
# → http://localhost:5000/health
# → http://localhost:5000/api/v1/ping
```

---

### 3. Setup the Frontend

```bash
cd ..   # back to shopify-store root
npm install
cp src/.env.example src/.env
```

Start the dev server:
```bash
npm run dev
# → http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role     | Email                        | Password       |
|----------|------------------------------|----------------|
| Customer | customer@shopstore.com       | Customer@123   |
| Admin    | admin@shopstore.com          | Admin@123      |

---

## 🛒 Promo Codes

| Code    | Discount          |
|---------|-------------------|
| SAVE10  | 10% off           |
| SAVE20  | 20% off           |
| FLAT50  | $50 off           |

---

## 📄 API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Auth
```
POST   /auth/register    → Register new user
POST   /auth/login       → Login, returns JWT
GET    /auth/me          → Get current user (protected)
```

### Products
```
GET    /products                      → List products (paginated)
GET    /products/handle/:handle       → Single product + related
GET    /products/collections          → All collections
```

**Query params for `/products`:**
| Param      | Type   | Example         |
|------------|--------|-----------------|
| page       | number | `?page=2`       |
| limit      | number | `?limit=12`     |
| collection | string | `?collection=electronics` |
| search     | string | `?search=headphones`      |
| sortBy     | string | `?sortBy=price_asc`       |

### Cart
```
GET    /cart                → Get cart (header: x-cart-token)
POST   /cart                → Create new cart
POST   /cart/items          → Add item
PATCH  /cart/items          → Update quantity
DELETE /cart/items/:id      → Remove item
DELETE /cart/clear          → Clear cart
POST   /cart/promo          → Apply promo code
```

### Orders
```
POST   /orders              → Place order
GET    /orders/:id          → Get order by ID
GET    /orders/my-orders    → User's orders (protected)
```

---

## 🗄️ Database Schema

```
User          ← email, password (hashed), role
Address       ← shipping addresses per user
Product       ← title, handle, vendor, status
ProductVariant← price, compareAtPrice, SKU, inventory
ProductImage  ← src, altText, position
Collection    ← title, handle, image
Cart + CartItem
Order + OrderLineItem
WishlistItem
```

---

## 🧪 Testing the Full Flow

1. Open http://localhost:5173
2. Browse the home page → click a collection
3. Open a product → select a variant → **Add to Cart**
4. Open the cart drawer → click **Checkout**
5. Log in with demo credentials
6. Fill in shipping form → payment (use any test values)
7. Review → **Place Order**
8. See order confirmation with order number
9. Go to **My Orders** to view order history

---

## 🌿 Git Setup

```bash
# In shopify-store/ root
git init
git add .
git commit -m "feat: initial production build — Phase 1-7 complete"
```

Add a `.gitignore` at both levels:

**`shopify-store/.gitignore`**
```
node_modules/
dist/
.env
.DS_Store
*.log
```

**`shopify-store/server/.gitignore`**
```
node_modules/
.env
*.log
```

---

## 🚢 Deployment Guide (Optional)

| Service     | What to deploy      |
|-------------|---------------------|
| **Vercel**  | React frontend      |
| **Railway** | Node.js backend     |
| **Neon**    | PostgreSQL database |

Set environment variables in each platform's dashboard using `.env.example` as a guide.

---

## 📸 Pages Overview

| Page                | Route                    | Auth Required |
|---------------------|--------------------------|---------------|
| Home                | `/`                      | No            |
| Shop                | `/shop`                  | No            |
| Product Detail      | `/products/:handle`      | No            |
| Cart                | `/cart`                  | No            |
| Wishlist            | `/wishlist`              | No            |
| Checkout            | `/checkout`              | ✅ Yes        |
| Order Confirmation  | `/order-confirmation/:id`| ✅ Yes        |
| My Orders           | `/orders`                | ✅ Yes        |
| Login               | `/login`                 | No            |
| Register            | `/register`              | No            |
| 404                 | `/404`                   | No            |

---

## 👤 Author

Built as a portfolio project to demonstrate full-stack development skills with
React, Node.js, PostgreSQL, and production-level architecture patterns.

---

## 📝 License

MIT — free to use and modify for personal and portfolio use.