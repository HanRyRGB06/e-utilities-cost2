# e-Utilities Cost System

ระบบควบคุม-ติดตาม ค่าสาธารณูปโภค (Utility Expense Tracking & Control System)

## 📋 Overview

ระบบเว็บแอปพลิเคชันสำหรับบันทึก ติดตาม และสรุปรายงาน ค่าสาธารณูปโภคของหน่วยงาน/สถานศึกษา รองรับการเบิกจ่ายจากหลายหมวดเงินงบประมาณ พร้อม dashboard สรุปยอดรายเดือนและดูข้อมูลย้อนหลัง

## 🐳 Docker Services (6 Containers)

1. **MariaDB** - ฐานข้อมูล
2. **phpMyAdmin** - Database Admin Interface
3. **Redis** - Caching & Session Storage
4. **Backend API** - Node.js + Express Server
5. **Frontend** - Vue 3 + Nginx
6. **Nginx** - Reverse Proxy

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js + Express.js |
| **Frontend** | Vue 3 (Composition API) + Vite + Tailwind CSS |
| **Database** | MariaDB 11 |
| **Authentication** | JWT + bcrypt |
| **ORM** | Sequelize |
| **Cache** | Redis |
| **Container** | Docker + Docker Compose |
| **Proxy** | Nginx |

## 📁 Project Structure

```
e-utilities-cost/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── router/
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── Dockerfile
│   └── nginx.conf
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       └── default.conf
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Docker Compose
- Git

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/e-utilities-cost.git
cd e-utilities-cost
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
# Edit .env if needed
```

3. **Build & Start Containers**
```bash
docker-compose up -d --build
```

4. **Access the Application**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api
- **phpMyAdmin**: http://localhost:8081
- **Nginx Proxy**: http://localhost:80

### Initial Setup

#### Create Admin User (Backend Container)
```bash
docker-compose exec backend npm run seed
```

Or manually via phpMyAdmin:
- Insert user with hashed password using bcrypt

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Expense Categories
- `GET /api/expense-categories` - List all
- `POST /api/expense-categories` - Create
- `PUT /api/expense-categories/:id` - Update
- `DELETE /api/expense-categories/:id` - Delete

### Budget Categories
- `GET /api/budget-categories` - List all
- `POST /api/budget-categories` - Create
- `PUT /api/budget-categories/:id` - Update
- `DELETE /api/budget-categories/:id` - Delete

### Expenses
- `GET /api/expenses` - List with filters
- `GET /api/expenses/:id` - Get single
- `POST /api/expenses` - Create
- `PUT /api/expenses/:id` - Update
- `DELETE /api/expenses/:id` - Delete

### Dashboard/Reports
- `GET /api/dashboard/summary?year=` - Monthly summary
- `GET /api/dashboard/by-category?year=` - By category
- `GET /api/dashboard/by-budget?year=` - By budget
- `GET /api/dashboard/compare?year1=&year2=` - Year comparison

## 🔐 Security Features

- Password hashing with bcrypt (salt rounds ≥ 10)
- JWT token-based authentication
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- Input validation
- HTTPS support (ready for production)

## 📝 Environment Variables

### Backend (.env)
```env
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=e_utilities_cost
DB_USER=app_user
DB_PASSWORD=changeme
DB_ROOT_PASSWORD=changeme_root

PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:8080
REDIS_HOST=redis
REDIS_PORT=6379
```

## 🛠️ Development

### Backend Development
```bash
docker-compose exec backend npm run dev
```

### Frontend Development
```bash
docker-compose exec frontend npm run dev
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mariadb
```

## 📊 Database Schema

### Users Table
- id (INT, PK)
- username (VARCHAR 50, UNIQUE)
- password (VARCHAR 255, bcrypt)
- full_name (VARCHAR 100)
- role (ENUM: admin, staff)
- created_at, updated_at

### Expense Categories
- id, name, code, unit, is_active, created_at

### Budget Categories
- id, name, code, is_active, created_at

### Expenses
- id, expense_category_id, budget_category_id, amount
- billing_month, paid_date, invoice_no, note
- attachment_path, created_by, created_at, updated_at

## 🚀 Deploy to Production

### Build Docker Images
```bash
docker-compose build

# Tag images
docker tag e-utilities-cost-backend:latest yourusername/e-utilities-cost-backend:latest
docker tag e-utilities-cost-frontend:latest yourusername/e-utilities-cost-frontend:latest

# Push to Docker Hub
docker push yourusername/e-utilities-cost-backend:latest
docker push yourusername/e-utilities-cost-frontend:latest
```

### Deploy
```bash
# Update docker-compose.yml with your Docker Hub username
docker-compose -f docker-compose.yml up -d
```

## 📚 Features

### Phase 1 (Core)
- ✅ User authentication (JWT)
- ✅ Expense CRUD
- ✅ Category management
- ✅ Dashboard with charts
- ✅ Docker deployment

### Phase 2 (Future)
- PDF/Excel export
- Threshold alerts
- File attachments
- Multi-branch support
- Role-based permissions

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml or .env
docker-compose down
docker-compose up -d
```

### Database Connection Error
```bash
# Check MariaDB status
docker-compose ps mariadb
docker-compose logs mariadb
```

### Frontend Cannot Connect to API
```bash
# Check VITE_API_BASE_URL in frontend/.env
# Verify backend is running: docker-compose ps backend
```

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 📄 License

ISC License

## 👨‍💻 Author

Created for educational purposes

---

**Last Updated**: August 2024
