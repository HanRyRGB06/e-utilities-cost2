# ⚡ QUICK REFERENCE CARD

## 🚀 START HERE

### For Windows Users
```bash
cd c:\Users\ADMIN\OneDrive\Desktop\utilities-cost\ 2
quickstart.bat
# Then choose option 1 to start
```

### For Mac/Linux Users
```bash
cd ~/path/to/utilities-cost\ 2
chmod +x quickstart.sh
./quickstart.sh
# Then choose option 1 to start
```

### Manual Start (All Platforms)
```bash
docker-compose up -d --build
```

---

## 🌐 ACCESS POINTS

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:8080 | Admin/admin123 |
| **Backend** | http://localhost:3000/api | JWT only |
| **Health** | http://localhost:3000/health | Public |
| **Database** | http://localhost:8081 | app_user/changeme |

---

## 📊 DOCKER STATUS

### Check All Services
```bash
docker-compose ps
```

### View Real-Time Logs
```bash
docker-compose logs -f
```

### Stop All Services
```bash
docker-compose down
```

### Restart Everything
```bash
docker-compose restart
```

---

## 🔧 BACKEND COMMANDS

### Run Backend in Dev Mode
```bash
docker-compose exec backend npm run dev
```

### Access Backend Container
```bash
docker-compose exec backend sh
```

### Run Backend Tests
```bash
docker-compose exec backend npm test
```

### View Backend Logs Only
```bash
docker-compose logs -f backend
```

---

## 🎨 FRONTEND COMMANDS

### Run Frontend in Dev Mode
```bash
docker-compose exec frontend npm run dev
```

### Access Frontend Container
```bash
docker-compose exec frontend sh
```

### Build Frontend
```bash
docker-compose exec frontend npm run build
```

### View Frontend Logs Only
```bash
docker-compose logs -f frontend
```

---

## 💾 DATABASE COMMANDS

### Access MySQL Shell
```bash
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost
```

### Backup Database
```bash
docker-compose exec mariadb mysqldump -u root -pchangeme_root e_utilities_cost > backup.sql
```

### Restore Database
```bash
docker-compose exec -T mariadb mysql -u root -pchangeme_root e_utilities_cost < backup.sql
```

### View phpMyAdmin
```
http://localhost:8081
Login: app_user / changeme
```

---

## 🔐 AUTHENTICATION

### Default Credentials
```
Username: admin
Password: admin123
```

### Test API Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get New Token
```bash
# Get accessToken from login response, then use in Authorization header:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/auth/me
```

---

## 📊 API TESTING EXAMPLES

### Health Check
```bash
curl http://localhost:3000/health
```

### Get All Expense Categories
```bash
curl "http://localhost:3000/api/expense-categories"
```

### Get Expenses (with JWT)
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/expenses?month=8&year=2024"
```

### Create Expense (with JWT)
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "expense_category_id": 1,
    "budget_category_id": 1,
    "amount": 5000.00,
    "billing_month": "2024-08-01"
  }'
```

### Get Dashboard Summary
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/dashboard/summary?year=2024"
```

---

## 🐛 TROUBLESHOOTING

### "Port already in use"
```bash
# Stop services on that port
docker-compose down

# Or change port in docker-compose.yml
# Then restart
docker-compose up -d
```

### "Cannot connect to database"
```bash
# Check MariaDB is healthy
docker-compose ps mariadb

# Rebuild database
docker-compose down -v
docker-compose up -d
```

### "Frontend shows blank page"
```bash
# Clear cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Or use Incognito window
```

### "Backend returns 401 Unauthorized"
```bash
# Login first to get token
curl -X POST http://localhost:3000/api/auth/login ...

# Use returned accessToken in Authorization header
```

### "Services won't start"
```bash
# View detailed logs
docker-compose logs

# Rebuild everything
docker-compose down -v
docker-compose up -d --build
```

---

## 📁 IMPORTANT FILES

| File | Purpose |
|------|---------|
| `.env` | Environment variables (secrets) |
| `docker-compose.yml` | Container orchestration |
| `backend/package.json` | Backend dependencies |
| `frontend/package.json` | Frontend dependencies |
| `.gitignore` | Files to ignore in Git |

---

## 🔄 GIT WORKFLOW

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/e-utilities-cost.git
git branch -M main
git push -u origin main
```

### Regular Development
```bash
# Make changes...
git add .
git commit -m "Describe changes"
git push origin main
```

### Feature Branch
```bash
git checkout -b feature/new-feature
# Make changes...
git commit -m "Add new feature"
git push origin feature/new-feature
# Create Pull Request on GitHub
```

---

## 📚 DOCUMENTATION FILES

| File | Read When |
|------|-----------|
| **SETUP_INSTRUCTIONS.md** | Setting up for first time |
| **README.md** | Understanding the project |
| **ARCHITECTURE.md** | Understanding design |
| **DOCKER_COMMANDS.md** | Working with Docker |
| **GITHUB_SETUP.md** | Setting up GitHub |
| **COMPLETION_SUMMARY.md** | Overview of what was created |
| **QUICK_REFERENCE.md** | This file! |

---

## ⚙️ ENVIRONMENT VARIABLES

### Key Variables in .env
```bash
# Database
DB_HOST=mariadb
DB_PASSWORD=changeme
DB_USER=app_user

# Backend
PORT=3000
JWT_SECRET=your_secret_key

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
```

### Change Variables
```bash
# 1. Edit .env file
nano .env
# or use your editor

# 2. Restart services
docker-compose restart backend
docker-compose restart frontend
```

---

## 🎯 COMMON TASKS

### Create New Expense
1. Frontend → Click "💰 Expenses"
2. Click "+ Add Expense"
3. Fill form
4. Click "Save"

### View Dashboard
1. Frontend → Click "📊 Dashboard"
2. See summary cards
3. Check monthly chart

### Manage Categories
1. Frontend → Click "🏷️ Expense Categories"
2. Add/Edit/Delete as needed

### Check Database
1. Open http://localhost:8081
2. Login: app_user / changeme
3. Browse tables
4. Run queries

### View API
1. Open http://localhost:3000/api
2. Or use Postman
3. Or use curl commands

---

## 🚨 EMERGENCY RECOVERY

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

### Reset Database Only
```bash
docker volume rm e-utilities-cost_mariadb_data
docker-compose restart mariadb
```

### Reset Cache Only
```bash
docker volume rm e-utilities-cost_redis_data
docker-compose restart redis
```

### Clear All Containers
```bash
docker-compose down
docker system prune -a
docker-compose up -d
```

---

## 📱 MOBILE ACCESS (Advanced)

### Access from Mobile Device on Same Network
```bash
# Find your computer IP
ipconfig getifaddr en0  # Mac
ipconfig               # Windows (look for IPv4)

# On mobile, use:
http://YOUR_IP:8080
```

### Access with Nginx Only
- All services now routable through port 80
- Use single URL: `http://YOUR_IP`

---

## 🔒 SECURITY REMINDERS

### DO NOT
- ❌ Commit .env file (in .gitignore)
- ❌ Share JWT_SECRET
- ❌ Use default passwords in production
- ❌ Expose database to internet
- ❌ Store credentials in code

### DO
- ✅ Use strong passwords
- ✅ Enable HTTPS in production
- ✅ Use environment variables
- ✅ Keep dependencies updated
- ✅ Review security logs
- ✅ Backup database regularly

---

## 💡 PRO TIPS

### Faster Logs
```bash
# Just backend errors
docker-compose logs -f backend --tail 50

# Just errors
docker-compose logs -f | grep -i error
```

### Monitor Resources
```bash
# Watch container stats
docker stats
```

### Database Shell Tips
```sql
-- Show all tables
SHOW TABLES;

-- Show table structure
DESCRIBE expenses;

-- Count records
SELECT COUNT(*) FROM expenses;

-- Show recent data
SELECT * FROM expenses ORDER BY created_at DESC LIMIT 10;
```

### API Testing with Postman
1. Import collection from API documentation
2. Set `{{base_url}}` variable
3. Set `{{token}}` after login
4. Use in headers: `Authorization: Bearer {{token}}`

---

## 🎨 CUSTOMIZATION

### Change Frontend Color Scheme
Edit `frontend/src/assets/main.css`
```css
/* Add custom colors */
:root {
  --primary-color: #003366;
  --accent-color: #ff6600;
}
```

### Change API Base URL
Edit `.env`:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Add New Page
1. Create `frontend/src/views/NewPageView.vue`
2. Add route in `frontend/src/router/index.js`
3. Add navigation link in `Sidebar.vue`
4. Implement page content

### Add New API Endpoint
1. Create controller function
2. Create route handler
3. Add to routes file
4. Document in README

---

## 📊 PERFORMANCE TIPS

### Optimize Database
```sql
-- Add indexes
CREATE INDEX idx_expense_date ON expenses(billing_month);
CREATE INDEX idx_category ON expenses(expense_category_id);
```

### Clear Cache
```bash
docker-compose exec redis redis-cli FLUSHALL
```

### Rebuild Frontend
```bash
docker-compose exec frontend npm run build
```

---

## 🎓 LEARNING PATHS

### For Frontend Dev
1. Vue 3 Documentation
2. Tailwind CSS Docs
3. Read `frontend/src` code
4. Modify components
5. Add new pages

### For Backend Dev
1. Express.js Documentation
2. Sequelize ORM Docs
3. Read `backend/src` code
4. Add new endpoints
5. Write tests

### For DevOps
1. Docker Documentation
2. Docker Compose Docs
3. Read docker-compose.yml
4. Configure Nginx
5. Set up CI/CD

---

## ✅ DAILY CHECKLIST

- [ ] Start services: `docker-compose up -d`
- [ ] Check status: `docker-compose ps`
- [ ] Access frontend: http://localhost:8080
- [ ] Test API: http://localhost:3000/health
- [ ] Make changes
- [ ] Commit: `git add . && git commit -m "message"`
- [ ] Push: `git push origin main`
- [ ] Stop services: `docker-compose down`

---

**Quick Reference Card** | Created August 2024 | Updated Regularly

Need help? Check the full documentation files!
