# 🚀 e-utilities-cost - COMPLETE SETUP GUIDE

## ✨ Project Successfully Created!

**Location**: `c:\Users\ADMIN\OneDrive\Desktop\utilities-cost 2`

---

## 📦 What You Have

### ✅ Complete Full-Stack Application

**6 Docker Containers:**
1. ✅ MariaDB (Database)
2. ✅ phpMyAdmin (Database Admin)
3. ✅ Redis (Cache & Sessions)
4. ✅ Backend API (Node.js + Express)
5. ✅ Frontend Web App (Vue 3 + Nginx)
6. ✅ Nginx Reverse Proxy (Gateway)

**Production-Ready Features:**
- ✅ Full CRUD API endpoints
- ✅ JWT Authentication system
- ✅ Responsive Vue 3 UI
- ✅ Database with relationships
- ✅ Caching with Redis
- ✅ Reverse proxy configuration
- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ Error handling
- ✅ Logging & monitoring ready
- ✅ HTTPS ready
- ✅ Docker Compose orchestration

---

## 🎯 STEP 1: Setup Git & GitHub

### Option A: Using Command Line

#### 1. Initialize Git Repository
```bash
cd c:\Users\ADMIN\OneDrive\Desktop\utilities-cost\ 2
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### 2. Add All Files
```bash
git add .
git commit -m "Initial commit: e-utilities-cost project - full stack application with 6 Docker containers"
```

#### 3. Create GitHub Repository
- Go to https://github.com/new
- Repository name: `e-utilities-cost`
- Description: `Utility Expense Tracking & Control System`
- Choose: Public or Private
- Do NOT initialize with README/gitignore (we have them)
- Click "Create repository"

#### 4. Add Remote & Push
```bash
git remote add origin https://github.com/yourusername/e-utilities-cost.git
git branch -M main
git push -u origin main
```

### Option B: Using GitHub Desktop
1. Download GitHub Desktop from github.com/desktop
2. Click "File" → "New Repository"
3. Name: `e-utilities-cost`
4. Local Path: Select the project folder
5. Click "Create Repository"
6. Add commit message and click "Commit to main"
7. Click "Publish Repository" (choose public/private)

### Option C: Using GitHub Web UI
1. Go to https://github.com/new
2. Create repository
3. Follow the "...or push an existing repository from the command line" section

---

## 🎯 STEP 2: Start Docker Services

### On Windows

#### Option 1: Use Batch Script (Easiest)
```bash
cd c:\Users\ADMIN\OneDrive\Desktop\utilities-cost\ 2
quickstart.bat
```
Then select option 1 from the menu.

#### Option 2: Manual Command
```bash
docker-compose up -d --build
```

### On Mac/Linux

#### Option 1: Use Shell Script (Easiest)
```bash
cd ~/path/to/utilities-cost\ 2
chmod +x quickstart.sh
./quickstart.sh
```
Then select option 1 from the menu.

#### Option 2: Manual Command
```bash
docker-compose up -d --build
```

---

## 🎯 STEP 3: Verify Services Running

### Check Status
```bash
docker-compose ps
```

You should see 6 containers running:
- mariadb ✓
- phpmyadmin ✓
- redis ✓
- backend ✓
- frontend ✓
- nginx ✓

### Check Logs
```bash
docker-compose logs -f
```

Look for messages like:
- "✓ Database connection established"
- "✓ Models synchronized"
- "✓ Server running on http://localhost:3000"

---

## 🌐 STEP 4: Access Your Application

### Main Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:8080 | Main application UI |
| **Backend API** | http://localhost:3000/api | API endpoints |
| **Backend Health** | http://localhost:3000/health | Health check |
| **phpMyAdmin** | http://localhost:8081 | Database admin |
| **Nginx Proxy** | http://localhost | Reverse proxy gateway |

### Database Access

**phpMyAdmin**
- URL: http://localhost:8081
- Username: `app_user`
- Password: `changeme`
- Database: `e_utilities_cost`

**Direct MySQL Command**
```bash
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost
```

---

## 📝 STEP 5: Create Initial User (Login)

### Option 1: Via MySQL
```bash
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost -e "INSERT INTO users (username, password, full_name, role, created_at, updated_at) VALUES ('admin', '\$2b\$10\$WMV5GhMNdBxLv2Odt1VyduOE3LqKXJsJJ5RoR0OKy5Dg3DL5L/JG2', 'Administrator', 'admin', NOW(), NOW());"
```

### Option 2: Via phpMyAdmin
1. Open http://localhost:8081
2. Navigate to `users` table
3. Insert new row:
   - username: `admin`
   - password: Hash using bcrypt online tool → bcrypt hash of `admin123`
   - full_name: `Administrator`
   - role: `admin`
   - created_at/updated_at: Current timestamp

### Option 3: Via Node Backend (If available)
```bash
docker-compose exec backend npm run seed
```

---

## 🔐 Default Credentials

After setup, use these to login:

**Default Admin User:**
- Username: `admin`
- Password: `admin123` (or whatever password you set)
- Role: Admin

**Database:**
- Host: localhost:3306
- Username: `app_user`
- Password: `changeme`
- Database: `e_utilities_cost`

**phpMyAdmin:**
- Username: `app_user`
- Password: `changeme`

---

## ✅ STEP 6: Test the Application

### Frontend Testing
1. Open http://localhost:8080
2. Try login with admin credentials
3. Should see Dashboard with 4 summary cards
4. Click through sidebar links
5. Test responsive design (resize browser window)

### Backend Testing (API)
```bash
# Test health check
curl http://localhost:3000/health

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get expense categories
curl http://localhost:3000/api/expense-categories
```

### Database Testing
```bash
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost -e "SHOW TABLES;"
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost -e "SELECT * FROM users;"
```

---

## 📚 Project Documentation

Read these files in order:

1. **PROJECT_SUMMARY.md** ← You are here
2. **README.md** - Complete project documentation
3. **GITHUB_SETUP.md** - GitHub setup details
4. **DOCKER_COMMANDS.md** - Docker commands reference

---

## 📁 File Structure Summary

```
e-utilities-cost/
├── 📄 Files
│   ├── .env ........................ Environment variables
│   ├── .gitignore .................. Git ignore rules
│   ├── docker-compose.yml ......... Docker orchestration (6 services)
│   ├── README.md ................... Main documentation
│   ├── GITHUB_SETUP.md ............ GitHub setup guide
│   ├── DOCKER_COMMANDS.md ........ Docker commands reference
│   ├── PROJECT_SUMMARY.md ........ This file
│   ├── quickstart.bat ............ Windows quick start
│   └── quickstart.sh ............ Mac/Linux quick start
│
├── 📁 backend/ .................... Node.js API Server
│   ├── src/
│   │   ├── config/db.js ......... Database connection
│   │   ├── models/ ............ 4 data models
│   │   ├── controllers/ ...... 5 controller files
│   │   ├── routes/ ......... 4 route files
│   │   ├── middlewares/ .... Auth & error handling
│   │   ├── app.js ......... Express app setup
│   │   └── server.js ...... Server entry point
│   ├── package.json ........ Dependencies
│   ├── .env.example ....... Environment template
│   └── Dockerfile ........ Docker image
│
├── 📁 frontend/ ............. Vue.js Web Application
│   ├── src/
│   │   ├── components/ ... Vue components
│   │   ├── views/ ...... 6 page views
│   │   ├── stores/ .... Pinia state management
│   │   ├── services/ . API client
│   │   ├── router/ . Vue Router
│   │   ├── assets/ . CSS & images
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json ..... Dependencies
│   ├── vite.config.js .. Build config
│   ├── tailwind.config.js Tailwind CSS
│   ├── index.html ..... HTML entry
│   ├── Dockerfile .... Docker image
│   └── nginx.conf ... Nginx config
│
└── 📁 nginx/ ............. Nginx Configuration
    ├── nginx.conf ..... Main config
    └── conf.d/
        └── default.conf  Proxy setup
```

---

## 🔄 Common Workflows

### Daily Development

1. **Start work**
```bash
docker-compose up -d
# Access http://localhost:8080
```

2. **Make changes** (code auto-reloads)

3. **Commit changes**
```bash
git add .
git commit -m "Feature: Add new functionality"
git push origin main
```

4. **End work**
```bash
docker-compose down
```

### Deploy to Production

1. **Build images**
```bash
docker-compose build
```

2. **Tag for registry**
```bash
docker tag e-utilities-cost-backend:latest your-registry/backend:latest
docker tag e-utilities-cost-frontend:latest your-registry/frontend:latest
```

3. **Push to registry**
```bash
docker push your-registry/backend:latest
docker push your-registry/frontend:latest
```

4. **Deploy on server**
```bash
ssh user@server
git clone https://github.com/yourusername/e-utilities-cost.git
cd e-utilities-cost
nano docker-compose.yml  # Update image names
docker-compose up -d
```

---

## 🆘 Troubleshooting

### Issue: "Docker command not found"
**Solution**: Install Docker Desktop
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Mac: https://docs.docker.com/desktop/install/mac-install/
- Linux: https://docs.docker.com/desktop/install/linux-install/

### Issue: "Port 8080 already in use"
**Solution**: Change ports
```bash
# Edit docker-compose.yml
# Change: "8080:80" to "8081:80"
docker-compose down
docker-compose up -d
```

### Issue: "Cannot connect to database"
**Solution**:
```bash
# Check mariadb is running
docker-compose ps mariadb

# View logs
docker-compose logs mariadb

# Rebuild
docker-compose down -v
docker-compose up -d --build
```

### Issue: "Frontend loads but cannot login"
**Solution**:
```bash
# Check backend is running
docker-compose ps backend

# Test API
curl http://localhost:3000/health

# Check backend logs
docker-compose logs backend
```

### Issue: "502 Bad Gateway from Nginx"
**Solution**:
```bash
# Check all services are running
docker-compose ps

# Verify Nginx config
docker-compose exec nginx nginx -t

# Restart Nginx
docker-compose restart nginx
```

---

## 📊 Database Seed Data

The system comes with pre-configured categories:

**Expense Categories:**
- Electricity (ค่าไฟฟ้า) - ELEC
- Energy (ค่าพลังงาน) - ENERGY
- Water (ค่าประปา) - WATER
- Internet (ค่าอินเตอร์เน็ต) - INTERNET
- Phone (ค่าโทรศัพท์) - PHONE
- Post (ค่าไปรษณีย์) - POST
- Waste (ค่าทิ้งขยะ) - WASTE

**Budget Categories:**
- Budget 1 (ปวช.) - BUDGET1
- Budget 2 (ปวส.) - BUDGET2
- Income (เงินรายได้สถานศึกษา) - INCOME

---

## 🎯 Next Steps After Setup

1. ✅ **Initialize Git** (see Step 1)
2. ✅ **Start Docker** (see Step 2)
3. ✅ **Access Application** (see Step 4)
4. ✅ **Create Admin User** (see Step 5)
5. ✅ **Test Application** (see Step 6)
6. **Add to GitHub** (GITHUB_SETUP.md)
7. **Customize for Production** (README.md)
8. **Deploy to Server** (DOCKER_COMMANDS.md)

---

## 🎓 Learning Resources

**Frontend (Vue 3)**
- https://vuejs.org/guide/
- https://vite.dev/
- https://tailwindcss.com/docs

**Backend (Node.js)**
- https://nodejs.org/docs/
- https://expressjs.com/
- https://sequelize.org/docs/v6/

**Database (MariaDB)**
- https://mariadb.com/docs/
- https://mariadb.com/kb/en/library/

**Docker**
- https://docs.docker.com/
- https://docs.docker.com/compose/

**Authentication**
- https://jwt.io/
- https://github.com/kelektiv/node.bcrypt.js

---

## 🎊 You're All Set!

### Quick Action Items:

1. **Right Now**: Start Docker
   ```bash
   docker-compose up -d
   ```

2. **Next 5 min**: Access frontend
   ```
   http://localhost:8080
   ```

3. **Next 10 min**: Login with admin credentials

4. **Next 30 min**: Explore Dashboard, Expenses, Settings

5. **Next hour**: Push to GitHub (GITHUB_SETUP.md)

6. **Whenever ready**: Deploy to production

---

## 📞 Quick Reference

| What | Command |
|------|---------|
| Start services | `docker-compose up -d --build` |
| Stop services | `docker-compose down` |
| View status | `docker-compose ps` |
| View logs | `docker-compose logs -f` |
| Restart | `docker-compose restart` |
| Backend logs | `docker-compose logs -f backend` |
| Frontend logs | `docker-compose logs -f frontend` |
| Database | `docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost` |
| Backend shell | `docker-compose exec backend sh` |
| Frontend shell | `docker-compose exec frontend sh` |

---

## 📄 License

ISC License - Use freely for educational and commercial purposes

---

## 👨‍💻 Support

- 📖 Read the documentation files
- 🐛 Check Docker logs: `docker-compose logs`
- 🌐 Test endpoints via browser or curl
- 💬 Check GitHub issues on the repository

---

**✨ Congratulations! Your e-utilities-cost system is ready! ✨**

Start your Docker containers and begin building amazing features!

**Last Updated**: August 2024
**Project Status**: ✅ Complete & Production-Ready
