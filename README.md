# 🛍️ ShopApp — Full-Stack E-Commerce Application

[![PR Pipeline](https://github.com/bumesh7/shopify-app/actions/workflows/pr-pipeline.yml/badge.svg)](https://github.com/bumesh7/shopify-app/actions/workflows/pr-pipeline.yml)
[![Main Pipeline](https://github.com/bumesh7/shopify-app/actions/workflows/main-pipeline.yml/badge.svg)](https://github.com/bumesh7/shopify-app/actions/workflows/main-pipeline.yml)
[![Health Check](https://github.com/bumesh7/shopify-app/actions/workflows/health-check.yml/badge.svg)](https://github.com/bumesh7/shopify-app/actions/workflows/health-check.yml)

A production-ready shopping application built with **Spring Boot** (Java 17) backend, **React** frontend, **PostgreSQL** database, and **Redis** caching — fully containerized with Docker and Docker Compose.

---

## 🧰 Tech Stack

| Layer       | Technology                               |
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

## ⚙️ Repository Setup — Do This Before Your First Push

> **These steps are mandatory. The pipeline will fail without them.**

---

### Step 1 — Create a Docker Hub Access Token

Never use your Docker Hub password in GitHub Actions. Create a dedicated token:

1. Log in to [hub.docker.com](https://hub.docker.com)
2. Click your avatar (top-right) → **Account Settings**
3. Go to **Security** → **New Access Token**
4. Name it `github-actions-shopapp`
5. Set permissions to **Read, Write, Delete**
6. Click **Generate** → **copy the token immediately** (shown only once)

---

### Step 2 — Add Repository Secrets

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **Secrets tab**

Click **New repository secret** for each entry below:

| Secret Name | Value | Why it's needed |
|-------------|-------|-----------------|
| `DOCKER_USERNAME` | `bumesh7` (your Docker Hub username) | Used to log in to Docker Hub |
| `DOCKER_TOKEN` | `dckr_pat_xxxx...` (the token from Step 1) | Password for Docker Hub login — never use your real password |

> ⚠️ Secret values are **encrypted and never shown again** after saving. If you lose one, delete and recreate it.

---

### Step 3 — Add Repository Variables

Still on the **Actions** page → click the **Variables tab**

Click **New repository variable** for each entry below:

| Variable Name | Value | Why it's needed |
|---------------|-------|-----------------|
| `DOCKER_USERNAME` | `bumesh7` (your Docker Hub username) | Used to build image names like `bumesh7/shopapp-backend`. Variables (unlike secrets) can be used in `with:` input strings in reusable workflows |

> ℹ️ **Why both a Secret and a Variable for the same username?**  
> GitHub Actions does not allow secrets to be passed as `inputs:` to reusable workflows — only variables can be used there. The secret is used for login; the variable is used for the image name string.

---

### Step 4 — Create the Production Environment

This adds a manual approval gate before any deploy runs:

1. Repo → **Settings** → **Environments** → **New environment**
2. Name it exactly: `production`
3. Under **Deployment protection rules**, enable **Required reviewers**
4. Add your GitHub username as a reviewer
5. Click **Save protection rules**

When a merge to `main` triggers the pipeline, the deploy job will **pause and email you** for approval after the security scan passes.

---

### Step 5 — Enable Secret Scanning (free, one click)

This protects against accidentally committing API keys or passwords:

1. Repo → **Settings** → **Security** → **Code security and analysis**
2. Enable **Secret scanning** → detects secrets already in the repo
3. Enable **Push protection** → **blocks the push** if a new secret is detected

---

### Step 6 — Verify Everything Is in Place

Use this checklist before your first push to `main`:

```
GitHub → Settings → Secrets and variables → Actions

  Secrets tab
  ✅ DOCKER_USERNAME   = umesh4999
  ✅ DOCKER_TOKEN      = dckr_pat_xxxxxxxxxxxxxxxxxxxx

  Variables tab
  ✅ DOCKER_USERNAME   = umesh4999

GitHub → Settings → Environments
  ✅ production        (Required reviewers enabled)

GitHub → Settings → Security → Code security and analysis
  ✅ Secret scanning   enabled
  ✅ Push protection   enabled
```

---

### What Happens If You Skip Any Step

| Skipped step | What breaks | Error you'll see |
|---|---|---|
| `DOCKER_TOKEN` secret | Docker login fails | `unauthorized: incorrect username or password` |
| `DOCKER_USERNAME` secret | Docker login fails | `unauthorized: incorrect username or password` |
| `DOCKER_USERNAME` variable | Image name becomes `/shopapp-backend` | `invalid tag "/shopapp-backend:..."` |
| `production` environment | Deploy job errors immediately | `Environment 'production' not found` |
| Secret scanning | No protection — secrets can enter git history | (silent — no pipeline error, just a security risk) |

---

### Pipeline Overview

```
PR opened / updated
──────────────────────────────────────────────────────────
  Build & Test ──────────────▶ Dependency Review (CVE scan)
       │                                 │
       └──────────────┬──────────────────┘
                      ▼
              PR Comment (build + security status posted to PR)
  ✅ No Docker images built or pushed on PRs

Push to main
──────────────────────────────────────────────────────────
  Build & Test (Java 17 + Node 20)
      │
      ▼
  Docker Build & Push  →  bumesh7/shopapp-backend:sha-<hash>
                       →  umesh4999/shopapp-frontend:sha-<hash>
                       →  :latest tags
      │
      ▼
  🔒 Trivy Security Scan (fail on CRITICAL or HIGH CVEs)
     Results uploaded to Security tab (SARIF)
      │
      ▼
  Deploy → production  ← pauses for manual approval click

Every 12 hours (+ manual trigger)
──────────────────────────────────────────────────────────
  🩺 Health Check
  Pull :latest → start containers → curl endpoints → report
```

### Workflow Files

| File | Trigger | Purpose |
|------|---------|---------|
| `reusable-build-test.yml` | `workflow_call` | Compile + build + test backend and frontend |
| `reusable-docker.yml` | `workflow_call` | Build and push Docker images to Docker Hub |
| `pr-pipeline.yml` | PR → `main` | Build + test + dependency CVE review + PR comment |
| `main-pipeline.yml` | Push → `main` | Build → Docker → Trivy scan → deploy |
| `health-check.yml` | Schedule + manual | Pull images, run containers, check health endpoints |

### Security Layers (DevSecOps — Day 49)

| Layer | Tool | What it catches |
|-------|------|-----------------|
| PR dependency check | `actions/dependency-review-action` | New packages with critical CVEs |
| Docker image scan | `aquasecurity/trivy-action` | Vulnerable OS packages in image layers |
| Secret detection | GitHub Secret Scanning (built-in) | API keys, tokens, passwords in commits |
| Push protection | GitHub Push Protection (built-in) | Blocks the push if a secret is detected |
| Least-privilege | Workflow `permissions:` blocks | Limits blast radius of compromised actions |
| Pinned SHA actions | All `uses:` pinned to commit SHA | Protects against supply-chain tag tampering |

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
├── .github/
│   └── workflows/
│       ├── reusable-build-test.yml
│       ├── reusable-docker.yml
│       ├── pr-pipeline.yml
│       ├── main-pipeline.yml
│       └── health-check.yml
│
├── backend/
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
├── frontend/
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

> ⏳ First build takes ~3–5 minutes. Subsequent starts are fast.

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

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@shopapp.com | admin123 |
| User  | user@shopapp.com  | user123  |

Seeded automatically on first startup by `DataInitializer.java`.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint           | Auth   | Description       |
|--------|--------------------|--------|-------------------|
| POST   | /api/auth/register | Public | Register new user |
| POST   | /api/auth/login    | Public | Login, get JWT    |

### Products
| Method | Endpoint                | Auth  | Description              |
|--------|-------------------------|-------|--------------------------|
| GET    | /api/products           | Public | List (paginated, filter) |
| GET    | /api/products/:id       | Public | Product detail           |
| GET    | /api/products/featured  | Public | Featured list            |
| GET    | /api/products/search?q= | Public | Full-text search         |
| GET    | /api/categories         | Public | All categories           |
| POST   | /api/admin/products     | ADMIN  | Create product           |
| PUT    | /api/admin/products/:id | ADMIN  | Update product           |
| DELETE | /api/admin/products/:id | ADMIN  | Soft-delete product      |

### Cart
| Method | Endpoint          | Auth | Description      |
|--------|-------------------|------|------------------|
| GET    | /api/cart         | User | Get cart summary |
| POST   | /api/cart         | User | Add item         |
| PUT    | /api/cart/:itemId | User | Update quantity  |
| DELETE | /api/cart/:itemId | User | Remove item      |
| DELETE | /api/cart         | User | Clear cart       |

### Orders
| Method | Endpoint                     | Auth  | Description     |
|--------|------------------------------|-------|-----------------|
| POST   | /api/orders                  | User  | Place order     |
| GET    | /api/orders                  | User  | My orders       |
| GET    | /api/orders/:orderNumber     | User  | Order detail    |
| PUT    | /api/orders/admin/:id/status | ADMIN | Update status   |

### Addresses
| Method | Endpoint           | Auth | Description    |
|--------|--------------------|------|----------------|
| GET    | /api/addresses     | User | List addresses |
| POST   | /api/addresses     | User | Add address    |
| PUT    | /api/addresses/:id | User | Update address |
| DELETE | /api/addresses/:id | User | Delete address |

---

## 🐳 Docker Details

### Multi-Stage Builds

**Backend** (`backend/Dockerfile`)
1. `maven:3.9.5-eclipse-temurin-17` — compiles and packages JAR
2. `eclipse-temurin:17-jre-alpine` — minimal JRE, runs as non-root user

**Frontend** (`frontend/Dockerfile`)
1. `node:20-alpine` — installs deps, runs `npm run build`
2. `nginx:1.25-alpine` — serves static build, proxies `/api/*` to backend

### Services
| Service  | Port | Role                  |
|----------|------|-----------------------|
| postgres | 5432 | Primary database      |
| redis    | 6379 | Cache + session store |
| backend  | 8080 | Spring Boot REST API  |
| frontend | 80   | Nginx + React SPA     |

---

## ⚙️ Environment Variables

| Variable     | Default        | Description           |
|--------------|----------------|-----------------------|
| DB_HOST      | localhost      | PostgreSQL host       |
| DB_PORT      | 5432           | PostgreSQL port       |
| DB_NAME      | shopapp        | Database name         |
| DB_USER      | shopuser       | DB username           |
| DB_PASSWORD  | shoppass       | DB password           |
| REDIS_HOST   | localhost      | Redis host            |
| REDIS_PORT   | 6379           | Redis port            |
| JWT_SECRET   | (see compose)  | JWT signing key       |
| CORS_ORIGINS | localhost:3000 | Allowed CORS origins  |

---

## 🛑 Cleanup

```bash
docker compose down           # Stop services
docker compose down -v        # Stop + wipe all data volumes
docker compose down --rmi all # Stop + remove all built images
```

---

## 📝 Notes

- Schema is auto-created by Hibernate (`ddl-auto: update`) on first run
- Seed data is inserted by `DataInitializer.java` only when tables are empty
- Redis cache TTL is 10 minutes for product listings
- For production: rotate `JWT_SECRET`, `DB_PASSWORD`, and disable `show-sql`

---

## 📄 License

MIT — free to use and modify.

---

## How to Contribute

1. Fork → clone → `git checkout -b feature/your-feature`
2. Make changes → `git commit -m "Add: description"`
3. `git push origin feature/your-feature`
4. Open a Pull Request — the PR pipeline runs automatically
