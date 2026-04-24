# 🛍️ ShopApp — Full-Stack E-Commerce Application

A production-ready shopping application built with **Spring Boot** (Java 17) backend, **React** frontend, **PostgreSQL** database, and **Redis** caching — fully containerized with Docker and Docker Compose.

---

## 🧰 Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Backend     | Java 17, Spring Boot 3.2, Spring Security |
| Auth        | JWT (jjwt 0.12), BCrypt                  |
| Database    | PostgreSQL 16                            |
| Cache       | Redis 7                                  |
| Frontend    | React 18, React Router 6, Axios          |
| Styling     | Custom CSS with CSS Variables (no UI lib)|
| Web Server  | Nginx 1.25 (reverse proxy + static)      |
| Container   | Docker, Docker Compose, Multi-stage builds |

---

## ✨ Features

### 🛒 Shopping
- Browse all products with pagination
- Filter by category, sort by price / rating / newest
- Full-text product search
- Detailed product pages with image gallery
- Featured products on homepage

### 🔐 Authentication
- JWT-based login / registration
- Role-based access (USER / ADMIN)
- Protected routes

### 🛍️ Cart
- Add / remove / update quantity
- Persistent cart (DB-backed per user)
- Subtotal, tax (18% GST), shipping calculation
- Free shipping on orders above ₹500

### 📦 Checkout & Orders
- Multi-step checkout (Address → Payment → Review)
- Manage multiple delivery addresses
- Payment options: COD, UPI, Card
- Real-time order status tracking
- Order history with detailed view

### 🌗 Dark / Light Mode
- System-aware theme toggle
- Persisted in localStorage
- Full CSS variable theming

### 🔧 Admin Panel
- Product CRUD (create, delete, soft-delete)
- Order management with status updates
- Dashboard stats (revenue, orders, products)

---

## 🗂️ Project Structure

```
shopify-app/
├── backend/                        # Spring Boot API
│   ├── src/main/java/com/shopapp/
│   │   ├── config/                 # Security, Redis, DataInitializer
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Request/Response DTOs
│   │   ├── model/                  # JPA entities
│   │   ├── repository/             # Spring Data JPA repos
│   │   ├── security/               # JWT filter, UserDetailsService
│   │   └── service/                # Business logic
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── Dockerfile                  # Multi-stage (Maven build + JRE runtime)
│   └── pom.xml
│
├── frontend/                       # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, Footer
│   │   │   └── shop/               # ProductCard
│   │   ├── context/                # Auth, Cart, Theme contexts
│   │   ├── pages/                  # Home, Shop, ProductDetail, Cart,
│   │   │                           # Checkout, Auth, Orders, Admin
│   │   ├── styles/global.css       # Full design system (dark+light)
│   │   ├── utils/api.js            # Axios instance with interceptors
│   │   ├── App.js                  # Routes
│   │   └── index.js
│   ├── public/index.html
│   ├── nginx/nginx.conf            # Reverse proxy + SPA fallback
│   ├── Dockerfile                  # Multi-stage (Node build + Nginx)
│   └── package.json
│
├── docker-compose.yml              # Production (all 4 services)
├── docker-compose.dev.yml          # Dev (DB + Redis only)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

---

### ▶️ Option 1 — Run Everything with Docker Compose (Recommended)

```bash
# 1. Clone / extract the project
cd shopify-app

# 2. Build and start all services
docker compose up --build

# 3. Open in browser
#    Frontend:  http://localhost
#    Backend API: http://localhost:8080/api
```

> ⏳ First build takes ~3–5 minutes (Maven downloads dependencies, npm builds React).  
> Subsequent starts are fast.

---

### ▶️ Option 2 — Local Development (Hot Reload)

**Step 1 — Start only infrastructure**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Step 2 — Start Spring Boot backend**
```bash
cd backend

# Set environment variables (or export them)
export DB_HOST=localhost DB_PORT=5432 DB_NAME=shopapp
export DB_USER=shopuser DB_PASSWORD=shoppass
export REDIS_HOST=localhost REDIS_PORT=6379
export JWT_SECRET=shopapp-super-secret-jwt-key-minimum-256-bits-for-hs256-algorithm
export CORS_ORIGINS=http://localhost:3000

mvn spring-boot:run
# API available at http://localhost:8080
```

**Step 3 — Start React frontend**
```bash
cd frontend
npm install
npm start
# App available at http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@shopapp.com    | admin123  |
| User  | user@shopapp.com     | user123   |

These are seeded automatically on first startup by `DataInitializer.java`.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Auth     | Description        |
|--------|----------------------|----------|--------------------|
| POST   | /api/auth/register   | Public   | Register new user  |
| POST   | /api/auth/login      | Public   | Login, get JWT     |

### Products
| Method | Endpoint                     | Auth     | Description              |
|--------|------------------------------|----------|--------------------------|
| GET    | /api/products                | Public   | List (paginated, filter) |
| GET    | /api/products/:id            | Public   | Product detail           |
| GET    | /api/products/featured       | Public   | Featured list            |
| GET    | /api/products/search?q=      | Public   | Full-text search         |
| GET    | /api/categories              | Public   | All categories           |
| POST   | /api/admin/products          | ADMIN    | Create product           |
| PUT    | /api/admin/products/:id      | ADMIN    | Update product           |
| DELETE | /api/admin/products/:id      | ADMIN    | Soft-delete product      |

### Cart
| Method | Endpoint             | Auth     | Description         |
|--------|----------------------|----------|---------------------|
| GET    | /api/cart            | User     | Get cart summary    |
| POST   | /api/cart            | User     | Add item            |
| PUT    | /api/cart/:itemId    | User     | Update quantity     |
| DELETE | /api/cart/:itemId    | User     | Remove item         |
| DELETE | /api/cart            | User     | Clear cart          |

### Orders
| Method | Endpoint                         | Auth     | Description       |
|--------|----------------------------------|----------|-------------------|
| POST   | /api/orders                      | User     | Place order       |
| GET    | /api/orders                      | User     | My orders         |
| GET    | /api/orders/:orderNumber         | User     | Order detail      |
| PUT    | /api/orders/admin/:id/status     | ADMIN    | Update status     |

### Addresses
| Method | Endpoint              | Auth | Description      |
|--------|-----------------------|------|------------------|
| GET    | /api/addresses        | User | List addresses   |
| POST   | /api/addresses        | User | Add address      |
| PUT    | /api/addresses/:id    | User | Update address   |
| DELETE | /api/addresses/:id    | User | Delete address   |

---

## 🐳 Docker Details

### Multi-Stage Builds

**Backend** (`backend/Dockerfile`)
1. **Stage `builder`** — `maven:3.9.5-eclipse-temurin-17`: compiles and packages JAR
2. **Stage `runtime`** — `eclipse-temurin:17-jre-alpine`: minimal JRE, runs app as non-root user

**Frontend** (`frontend/Dockerfile`)
1. **Stage `builder`** — `node:20-alpine`: installs dependencies, runs `npm run build`
2. **Stage `runtime`** — `nginx:1.25-alpine`: serves static build, proxies `/api/*` to backend

### Services in `docker-compose.yml`
| Service    | Image / Build     | Port  | Role                        |
|------------|-------------------|-------|-----------------------------|
| `postgres`  | postgres:16-alpine | 5432  | Primary database            |
| `redis`     | redis:7-alpine     | 6379  | Cache + session store       |
| `backend`   | ./backend/         | 8080  | Spring Boot REST API        |
| `frontend`  | ./frontend/        | 80    | Nginx + React SPA           |

All services are on a shared `shopapp-network` bridge network.  
Health checks ensure proper startup order: `postgres → redis → backend → frontend`.

---

## ⚙️ Environment Variables

### Backend
| Variable        | Default                    | Description              |
|-----------------|----------------------------|--------------------------|
| DB_HOST         | localhost                  | PostgreSQL host          |
| DB_PORT         | 5432                       | PostgreSQL port          |
| DB_NAME         | shopapp                    | Database name            |
| DB_USER         | shopuser                   | DB username              |
| DB_PASSWORD     | shoppass                   | DB password              |
| REDIS_HOST      | localhost                  | Redis host               |
| REDIS_PORT      | 6379                       | Redis port               |
| JWT_SECRET      | (see docker-compose.yml)   | JWT signing key (256bit) |
| CORS_ORIGINS    | http://localhost:3000      | Allowed CORS origins     |

---

## 🛑 Stopping & Cleanup

```bash
# Stop all services
docker compose down

# Stop and remove volumes (wipes all data)
docker compose down -v

# Remove built images
docker compose down --rmi all
```

---

## 🧪 Useful Commands

```bash
# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild a single service
docker compose up --build backend

# Open a shell in the backend container
docker compose exec backend sh

# Connect to PostgreSQL
docker compose exec postgres psql -U shopuser -d shopapp

# Connect to Redis
docker compose exec redis redis-cli
```

---

## 📝 Notes

- The database schema is auto-created by Hibernate (`ddl-auto: update`) on first run.
- Product and user seed data is inserted by `DataInitializer.java` only if the tables are empty.
- Product images use [Unsplash](https://unsplash.com) URLs; replace with your own CDN in production.
- Redis cache TTL is set to 10 minutes for product listings.
- For production, change `JWT_SECRET`, `DB_PASSWORD`, and disable `show-sql`.

---

## 📄 License

MIT — free to use and modify.

---

We welcome contributions to improve this project!

### How to Contribute

1. Fork the repository
2. Clone your fork
   git clone https://github.com/bumesh7/shopify-app.git

3. Create a new branch
   git checkout -b feature/your-feature-name

4. Make your changes

5. Commit your changes
   git commit -m "Add: your feature description"

6. Push to your fork
   git push origin feature/your-feature-name

7. Open a Pull Request
