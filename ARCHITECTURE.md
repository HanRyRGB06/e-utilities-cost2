# 🏗️ e-utilities-cost System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                             │
│                   (Vue 3 + Tailwind CSS)                          │
└──────────────────────────────┬──────────────────────────────────┘
                                │ HTTP/HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NGINX Reverse Proxy                           │
│                    (Port 80/443)                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Route /                  → Frontend (8080)                │  │
│  │  Route /api/*             → Backend (3000)                 │  │
│  │  Route /phpmyadmin/       → phpMyAdmin (8081)              │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────┬─────────────────────┘
                       │                      │
         ┌─────────────┴──────────┐   ┌───────┴──────────┐
         │                        │   │                  │
         ▼                        ▼   ▼                  ▼
    ┌─────────────┐      ┌─────────────────┐    ┌────────────────┐
    │  Frontend   │      │  Backend API    │    │  phpMyAdmin    │
    │ (Nginx)     │      │  (Express.js)   │    │  (Web UI)      │
    │ Port 8080   │      │  Port 3000      │    │  Port 8081     │
    └─────────────┘      └────────┬────────┘    └────────┬────────┘
                                  │                     │
                    ┌─────────────┴──────────┐          │
                    │                        │          │
         ┌──────────▼─────────┐   ┌──────────▼────┐    │
         │   MariaDB 11       │   │  Redis        │    │
         │  (Database)        │   │ (Cache)       │    │
         │  Port 3306         │   │ Port 6379     │    │
         │                    │   │               │    │
         │  Database:         │   │ Session Store │    │
         │  e_utilities_cost  │   │ Cache Layer   │    │
         └────────────────────┘   └───────────────┘    │
                                                        │
                                         Connects to both DB & Cache
```

---

## Component Architecture

### 1. Frontend Layer (Vue 3 + Vite)

**Technology Stack:**
- Vue 3 (Composition API)
- Vite (Build tool)
- Vue Router (Navigation)
- Pinia (State management)
- Axios (HTTP client)
- Tailwind CSS (Styling)
- Nginx (Static hosting)

**Key Features:**
- Single Page Application (SPA)
- Responsive design (Mobile/Tablet/Desktop)
- JWT-based authentication
- Auto-redirect to login on auth failure
- Lazy-loaded routes

**Folder Structure:**
```
frontend/src/
├── components/
│   └── layout/
│       ├── Navbar.vue
│       └── Sidebar.vue
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── ExpenseListView.vue
│   ├── ExpenseFormView.vue
│   ├── CategoryManageView.vue
│   └── ReportHistoryView.vue
├── stores/
│   └── auth.js (Pinia store)
├── services/
│   └── api.js (Axios instance)
├── router/
│   └── index.js (Vue Router config)
├── assets/
│   └── main.css (Tailwind)
├── App.vue
└── main.js
```

---

### 2. Backend API Layer (Node.js + Express)

**Technology Stack:**
- Node.js 20 (Runtime)
- Express.js (Web framework)
- Sequelize (ORM)
- JWT (Authentication)
- bcrypt (Password hashing)
- Redis client (Caching)
- CORS (Cross-origin)
- Helmet (Security)
- Rate limiting (DOS protection)

**Architecture Pattern:**
```
Request → Middleware → Controller → Model → Database
                          ↓
                      Validation
                      Error Handling
                      Logging
```

**Folder Structure:**
```
backend/src/
├── config/
│   └── db.js (Database connection)
├── models/
│   ├── user.model.js
│   ├── expenseCategory.model.js
│   ├── budgetCategory.model.js
│   └── expense.model.js
├── controllers/
│   ├── auth.controller.js
│   ├── expense.controller.js
│   ├── expenseCategory.controller.js
│   ├── budgetCategory.controller.js
│   └── dashboard.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── expense.routes.js
│   ├── expenseCategory.routes.js
│   ├── budgetCategory.routes.js
│   └── dashboard.routes.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── app.js (Express setup)
└── server.js (Entry point)
```

---

### 3. Database Layer (MariaDB)

**Database Schema:**

```
users
├── id (PK, AUTO_INCREMENT)
├── username (UNIQUE)
├── password (bcrypt hash)
├── full_name
├── role (admin/staff)
└── created_at, updated_at

expense_categories
├── id (PK)
├── name
├── code (UNIQUE)
├── unit
├── is_active
└── created_at

budget_categories
├── id (PK)
├── name
├── code (UNIQUE)
├── is_active
└── created_at

expenses
├── id (PK)
├── expense_category_id (FK → expense_categories)
├── budget_category_id (FK → budget_categories)
├── amount (DECIMAL)
├── billing_month (DATE)
├── paid_date (DATE)
├── invoice_no
├── note
├── attachment_path
├── created_by (FK → users)
└── created_at, updated_at
```

**Relationships:**
```
users (1) ──→ (N) expenses
expense_categories (1) ──→ (N) expenses
budget_categories (1) ──→ (N) expenses
```

---

### 4. Caching Layer (Redis)

**Purpose:**
- Session storage
- Query result caching
- Rate limiting data
- Real-time notifications (future)

**Key/Value Structure:**
```
sessions:user:{id}       → User session data
cache:categories         → Cached category list
cache:expenses:{year}    → Cached expense reports
```

---

### 5. Reverse Proxy Layer (Nginx)

**Configuration:**
```
Server Block (Port 80/443)
├── Upstream: backend (port 3000)
├── Upstream: frontend (port 80)
├── Location /api/*       → backend
├── Location /phpmyadmin/ → phpmyadmin
└── Location /           → frontend
```

**Responsibilities:**
- SSL termination
- Request routing
- Load balancing (optional)
- Compression (gzip)
- Caching headers
- Security headers

---

## Data Flow Diagrams

### Authentication Flow

```
User Input → Login Form
    ↓
Frontend: POST /api/auth/login
    ↓
Backend: authController.login
    ├─ Validate input
    ├─ Query user from DB
    ├─ Compare password (bcrypt)
    └─ Generate JWT tokens
    ↓
Response: {accessToken, refreshToken, user}
    ↓
Frontend: Store in Pinia store
    ├─ accessToken in memory
    └─ refreshToken in httpOnly cookie
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### Expense Submission Flow

```
User fills form (Category, Amount, Date)
    ↓
Frontend: POST /api/expenses
    ├─ Header: Authorization: Bearer {token}
    └─ Body: {expense_category_id, budget_category_id, amount, ...}
    ↓
Backend: authMiddleware
    ├─ Extract & verify JWT
    └─ Attach user to request
    ↓
Backend: expenseController.create
    ├─ Validate input
    ├─ Create expense record in DB
    └─ Invalidate cache
    ↓
Response: {status: 'success', data: expense}
    ↓
Frontend: Refresh expense list
    ├─ GET /api/expenses (with filters)
    └─ Update Pinia store
    ↓
Display in table/list
```

### Dashboard Report Generation

```
User selects year → Frontend
    ↓
GET /api/dashboard/summary?year=2024
    ↓
Backend: dashboardController.summary
    ├─ Query from cache (Redis)
    ├─ If miss: Query from database
    │   ├─ GROUP BY month
    │   ├─ SUM(amount)
    │   └─ Store in cache
    └─ Return data
    ↓
Frontend: Receive monthly data
    ├─ Format for Chart.js
    └─ Render bar chart
    ↓
Display dashboard with:
    ├─ Summary cards
    ├─ Monthly chart
    ├─ Category breakdown
    └─ Budget comparison
```

---

## API Request/Response Pattern

### Standard Request Format
```javascript
GET /api/resource?query=value
POST /api/resource

Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}

Body (POST):
{
  "field1": "value1",
  "field2": "value2"
}
```

### Standard Response Format
```javascript
// Success
{
  "status": "success",
  "data": { /* data */ },
  "total": 100,
  "page": 1
}

// Error
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed"
}
```

---

## Authentication & Authorization

### JWT Token Structure
```
Header.Payload.Signature

Payload:
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Token Lifecycle
```
1. Login
   └─ Generate accessToken (1 hour)
   └─ Generate refreshToken (7 days, httpOnly)

2. API Request
   ├─ Send accessToken in Authorization header
   └─ Middleware verifies

3. Token Expiry
   ├─ Attempt API call → 401 Unauthorized
   ├─ Frontend detects
   └─ POST /api/auth/refresh with refreshToken
       └─ Get new accessToken

4. Logout
   ├─ Clear refreshToken cookie
   └─ Clear accessToken from memory
```

### Permission Control
```
Middleware checks:
├─ Is token valid?
├─ Has token expired?
├─ Is user role allowed? (future)
└─ Allow/Reject request
```

---

## Error Handling Strategy

### Backend Error Flow
```
Try {
  Process request
} Catch (error) {
  ├─ Validation error → 400
  ├─ Authentication error → 401
  ├─ Authorization error → 403
  ├─ Not found error → 404
  └─ Server error → 500
  ↓
  Log error
  ↓
  Return JSON response with:
    ├─ statusCode
    ├─ message
    └─ timestamp
}
```

### Frontend Error Handling
```
Axios interceptor:
├─ On 401 → Redirect to login
├─ On 4xx → Show user message
├─ On 5xx → Show technical error
└─ On network error → Show retry option
```

---

## Performance Optimization

### Database Optimization
- ✅ Indexes on foreign keys
- ✅ Indexes on frequently queried columns
- ✅ Pagination for large datasets
- ✅ Lazy loading of relationships

### Caching Strategy
- ✅ Cache category lists (rarely change)
- ✅ Cache dashboard reports (expiry: 1 hour)
- ✅ Cache expense summaries by year
- ✅ Invalidate on data changes

### Frontend Optimization
- ✅ Code splitting (route-based)
- ✅ Lazy component loading
- ✅ Image optimization
- ✅ CSS/JS minification (Vite)
- ✅ Gzip compression (Nginx)

### Backend Optimization
- ✅ Connection pooling
- ✅ Query optimization
- ✅ Rate limiting (100 req/15min)
- ✅ Response compression

---

## Security Architecture

### Authentication Security
```
Password Storage:
   Input → bcrypt(password, salt:10) → hash
   
Login:
   Input password + hash → bcrypt.compare() → true/false

JWT Security:
   Signed with SECRET key
   Cannot forge without SECRET
   Verified on every request
```

### Transport Security
```
HTTP → HTTPS (in production)
   ├─ SSL/TLS certificate
   ├─ Encrypted communication
   └─ Secure cookies (httpOnly, secure, sameSite)
```

### Data Security
```
Environment Variables:
   ├─ JWT_SECRET (not in repo)
   ├─ DB_PASSWORD (not in repo)
   └─ Loaded from .env file

CORS:
   └─ Only allow frontend domain

Rate Limiting:
   └─ 100 requests per 15 minutes per IP

Input Validation:
   ├─ Type checking
   ├─ Length limits
   └─ SQL injection prevention (Sequelize)
```

---

## Deployment Architecture

### Docker Container Orchestration
```
docker-compose.yml
│
├─ Service: mariadb
│  └─ Volume: mariadb_data (persistent)
│
├─ Service: redis
│  └─ Volume: redis_data (persistent)
│
├─ Service: backend
│  ├─ Depends on: mariadb, redis
│  └─ Healthcheck: /health endpoint
│
├─ Service: frontend
│  ├─ Depends on: backend
│  └─ Built with multi-stage Dockerfile
│
└─ Service: nginx
   ├─ Depends on: backend, frontend
   └─ Reverse proxy configuration
```

### Production Deployment
```
1. Build Docker images
   ├─ Backend image
   ├─ Frontend image
   └─ Push to registry

2. Deploy on server
   ├─ Pull images from registry
   ├─ Set environment variables
   ├─ Start containers
   └─ Configure domain/SSL

3. Monitoring
   ├─ Health checks
   ├─ Log aggregation
   ├─ Error tracking
   └─ Performance metrics
```

---

## Scaling Considerations

### Horizontal Scaling
```
Multiple Backend Instances:
   Load Balancer → Backend 1
                → Backend 2
                → Backend 3
   
Shared Database:
   └─ Single MariaDB (or cluster)
   
Shared Cache:
   └─ Single Redis (or cluster)
```

### Vertical Scaling
```
Increase Container Resources:
   ├─ CPU limits
   ├─ Memory limits
   └─ Storage allocation
```

### Database Scaling
```
Optimization:
   ├─ Indexing strategy
   ├─ Query optimization
   ├─ Connection pooling
   └─ Read replicas (future)
```

---

## Future Enhancement Points

1. **WebSocket Support** (Real-time notifications)
2. **Message Queue** (Celery/Bull for async tasks)
3. **Search Engine** (Elasticsearch for full-text search)
4. **Monitoring** (Prometheus + Grafana)
5. **Logging** (ELK Stack)
6. **CI/CD Pipeline** (GitHub Actions)
7. **Kubernetes** (For cloud deployment)
8. **Microservices** (If further scaling needed)

---

## Technology Justification

| Technology | Why Chosen |
|------------|-----------|
| Vue 3 | Modern, reactive, great DX |
| Vite | Fast build, HMR, production ready |
| Express | Lightweight, flexible, large ecosystem |
| MariaDB | MySQL-compatible, free, reliable |
| Redis | High-performance caching, session storage |
| Sequelize | SQL ORM, supports MariaDB well |
| Docker | Containerization, consistency, deployment |
| Nginx | Reverse proxy, load balancer, efficient |
| JWT | Stateless auth, scalable, secure |
| bcrypt | Industry-standard password hashing |

---

**Architecture Documentation**
**Last Updated**: August 2024
**Status**: Production-Ready
