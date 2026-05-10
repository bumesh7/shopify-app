# 🛍️ ShopApp — Full-Stack E-Commerce Application

[![PR Pipeline](https://github.com/bumesh7/shopify-app/actions/workflows/pr-pipeline.yml/badge.svg)](https://github.com/bumesh7/shopify-app/actions/workflows/pr-pipeline.yml)
[![Main Pipeline](https://github.com/bumesh7/shopify-app/actions/workflows/main-pipeline.yml/badge.svg)](https://github.com/bumesh7/shopify-app/actions/workflows/main-pipeline.yml)
[![Health Check](https://github.com/bumesh7/shopify-app/actions/workflows/health-check.yml/badge.svg)](https://github.com/bumesh7/shopify-app/actions/workflows/health-check.yml)

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
| CI/CD       | GitHub Actions (5 workflow files)        |
| Security    | Trivy, GitHub Secret Scanning, Dependency Review |

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

## 🚀 CI/CD Pipeline (Day 48 & 49)

This project includes a complete, production-style GitHub Actions pipeline that builds, tests, scans for security vulnerabilities, and deploys the application automatically.

### Pipeline Overview

```
PR opened / updated
──────────────────────────────────────────────────────────
  Build & Test ──────────────▶ Dependency Review (CVE scan)
       │                                 │
       └──────────────┬──────────────────┘
                      ▼
              PR Comment (build + security status)
  ✅ No Docker push on PRs

Push to main
──────────────────────────────────────────────────────────
  Build & Test
      │
      ▼
  Docker Build & Push (backend + frontend → Docker Hub)
      │
      ▼
  🔒 Trivy Security Scan (fail on CRITICAL/HIGH CVEs)
      │
      ▼
  Deploy → production  (requires manual approval)

Every 12 hours
──────────────────────────────────────────────────────────
  🩺 Health Check (pull :latest → start containers → curl)
```

### Workflow Files

| File | Trigger | Purpose |
|------|---------|---------|
| `reusable-build-test.yml` | `workflow_call` | Reusable: compile, build, test backend + frontend |
| `reusable-docker.yml` | `workflow_call` | Reusable: build & push Docker images to Docker Hub |
| `pr-pipeline.yml` | PR → `main` | Build + test + dependency CVE review → PR comment |
| `main-pipeline.yml` | Push → `main` | Build → Docker → Trivy scan → deploy to production |
| `health-check.yml` | Schedule + manual | Pull images, start containers, health-check endpoints |

### Security (DevSecOps — Day 49)

| Layer | Tool | What it catches |
|-------|------|-----------------|
| PR dependency check | `actions/dependency-review-action` | New packages with critical CVEs |
| Docker image scan | `aquasecurity/trivy-action` | Vulnerable OS packages in image layers |
| Secret detection | GitHub Secret Scanning (built-in) | API keys, tokens, passwords in commits |
| Push protection | GitHub Push Protection (built-in) | Blocks push if a secret is detected |
| Least-privilege | Workflow `permissions` blocks | Limits blast radius of compromised actions |
| Pinned SHA actions | All actions pinned to commit SHA | Protects against supply-chain attacks |

### Repository Secrets Required

Set these in **Settings → Secrets and variables → Actions**:

| Name | Type | Description |
|------|------|-------------|
| `DOCKER_USERNAME` | Secret | Docker Hub username |
| `DOCKER_TOKEN` | Secret | Docker Hub access token (not your password) |
| `DOCKER_USERNAME` | Variable (`vars.`) | Same value — used in image name strings |

### Production Environment

1. Go to **Settings → Environments → New environment** → name it `production`
2. Enable **Required reviewers** and add yourself
3. The `deploy` job in `main-pipeline.yml` will pause for manual approval before running

---

## 🗂️ Project Structure

```
shopify-app/
├── .github/
│   └── workflows/
│       ├── reusable-build-test.yml   # Reusable: build + test
│       ├── reusable-docker.yml       # Reusable: Docker build & push
│       ├── pr-pipeline.yml           # PR checks (no Docker push)
│       ├── main-pipeline.yml         # Full pipeline with security scan
│       └── health-check.yml          # Scheduled container health check
│
├── 2026/
│   ├── day-48/
│   │   └── day-48-actions-project.md
│   └── day-49/
│       └── day-49-devsecops.md
│
├── backend/                        # Spring Boot API
│   ├── src/main/java/com/shopapp/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                       # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/global.css
│   │   ├── utils/api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/index.html
│   ├── nginx/nginx.conf
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

### Run Everything with Docker Compose

```bash
cd shopify-app
docker compose up --build
# Frontend:    http://localhost
# Backend API: http://localhost:8080/api
```

### Local Development (Hot Reload)

```bash
# Step 1 — infrastructure only
docker compose -f docker-compose.dev.yml up -d

# Step 2 — backend
cd backend
export DB_HOST=localhost DB_PORT=5432 DB_NAME=shopapp
export DB_USER=shopuser DB_PASSWORD=shoppass
export REDIS_HOST=localhost REDIS_PORT=6379
export JWT_SECRET=shopapp-super-secret-jwt-key-minimum-256-bits-for-hs256-algorithm
export CORS_ORIGINS=http://localhost:3000
mvn spring-boot:run

# Step 3 — frontend
cd frontend && npm install && npm start
```

---

## 🔑 Demo Credentials

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@shopapp.com    | admin123  |
| User  | user@shopapp.com     | user123   |

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
| Method | Endpoint             | Auth | Description         |
|--------|----------------------|------|---------------------|
| GET    | /api/cart            | User | Get cart summary    |
| POST   | /api/cart            | User | Add item            |
| PUT    | /api/cart/:itemId    | User | Update quantity     |
| DELETE | /api/cart/:itemId    | User | Remove item         |
| DELETE | /api/cart            | User | Clear cart          |

### Orders
| Method | Endpoint                         | Auth  | Description       |
|--------|----------------------------------|-------|-------------------|
| POST   | /api/orders                      | User  | Place order       |
| GET    | /api/orders                      | User  | My orders         |
| GET    | /api/orders/:orderNumber         | User  | Order detail      |
| PUT    | /api/orders/admin/:id/status     | ADMIN | Update status     |

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
2. **Stage `runtime`** — `eclipse-temurin:17-jre-alpine`: minimal JRE, non-root user

**Frontend** (`frontend/Dockerfile`)
1. **Stage `builder`** — `node:20-alpine`: installs deps, runs `npm run build`
2. **Stage `runtime`** — `nginx:1.25-alpine`: serves static build, proxies `/api/*`

### Services in `docker-compose.yml`
| Service   | Port | Role                  |
|-----------|------|-----------------------|
| postgres  | 5432 | Primary database      |
| redis     | 6379 | Cache + session store |
| backend   | 8080 | Spring Boot REST API  |
| frontend  | 80   | Nginx + React SPA     |

---

## ⚙️ Environment Variables

| Variable     | Default       | Description          |
|--------------|---------------|----------------------|
| DB_HOST      | localhost     | PostgreSQL host      |
| DB_PORT      | 5432          | PostgreSQL port      |
| DB_NAME      | shopapp       | Database name        |
| DB_USER      | shopuser      | DB username          |
| DB_PASSWORD  | shoppass      | DB password          |
| REDIS_HOST   | localhost     | Redis host           |
| REDIS_PORT   | 6379          | Redis port           |
| JWT_SECRET   | (see compose) | JWT signing key      |
| CORS_ORIGINS | localhost:3000 | Allowed CORS origins |

---

## 🛑 Cleanup

```bash
docker compose down          # Stop
docker compose down -v       # Stop + wipe data
docker compose down --rmi all # Stop + remove images
```

---

## 📝 Notes

- Schema is auto-created by Hibernate on first run.
- Seed data (users + products) is inserted by `DataInitializer.java` if tables are empty.
- Redis cache TTL is 10 minutes for product listings.
- For production: rotate `JWT_SECRET`, `DB_PASSWORD`, disable `show-sql`.

---

## 📄 License

MIT — free to use and modify.

---

## How to Contribute

1. Fork → clone → `git checkout -b feature/your-feature`
2. Make changes → `git commit -m "Add: description"`
3. `git push origin feature/your-feature`
4. Open a Pull Request — the PR pipeline runs automatically
