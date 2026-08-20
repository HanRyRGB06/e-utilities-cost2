# GitHub Repository Setup Guide

## 📝 Step-by-Step Guide to Create GitHub Repository

### 1. Create New Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click on **"+"** icon in the top right corner
3. Select **"New repository"**

### 2. Repository Settings

**Repository Name**: `e-utilities-cost`

**Description**: 
```
Utility Expense Tracking & Control System - Web application for tracking utility expenses with dashboard, reports, and Docker deployment
```

**Visibility**: Choose one of the following:
- **Public** - Anyone can view and fork
- **Private** - Only you and invited collaborators

**Initialize Options**:
- ✓ Add .gitignore (Already included)
- ✓ Add README.md (Already included)
- Choose License: ISC

### 3. Repository URL

After creation, you'll get:
```
https://github.com/yourusername/e-utilities-cost.git
```

---

## 💻 Local Setup & Push to GitHub

### 1. Initialize Git in Project (If not already done)

```bash
cd c:\Users\ADMIN\OneDrive\Desktop\utilities-cost\ 2

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: e-utilities-cost project structure"
```

### 2. Add Remote Repository

Replace `yourusername` with your GitHub username:

```bash
git remote add origin https://github.com/yourusername/e-utilities-cost.git
```

### 3. Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Verify (Optional)

```bash
git remote -v
```

You should see:
```
origin  https://github.com/yourusername/e-utilities-cost.git (fetch)
origin  https://github.com/yourusername/e-utilities-cost.git (push)
```

---

## 🔑 Authentication Options

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `gist`
4. Copy the token and use it as password when pushing

### Option 2: SSH Key

1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add to GitHub:
   - GitHub Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key

3. Use SSH URL:
```bash
git remote add origin git@github.com:yourusername/e-utilities-cost.git
```

---

## 📋 GitHub Repository Setup Checklist

After pushing to GitHub, configure:

### 1. Repository Settings
- [ ] Add Description
- [ ] Add Topics: `utility`, `expenses`, `docker`, `vue`, `nodejs`
- [ ] Enable Issues
- [ ] Enable Discussions
- [ ] Enable Wiki (optional)

### 2. Branch Protection (Optional - for main)
- Require pull request reviews
- Require status checks to pass

### 3. Add Collaborators (if team project)
- Settings → Collaborators
- Add team members

### 4. Workflows & Actions (Optional)
- Create GitHub Actions for CI/CD
- Auto-run tests on push
- Build Docker images on release

---

## 🎯 Recommended Additional GitHub Features

### 1. Create GitHub Issues

Template for issues:
```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: Windows/Mac/Linux
- Docker Version: 
- Browser:
```

### 2. Create GitHub Milestones

```
Milestone 1: Core Backend API
Milestone 2: Frontend UI
Milestone 3: Docker & Deployment
Milestone 4: Testing & Documentation
```

### 3. Create GitHub Projects

Create a Kanban board for tracking:
- To Do
- In Progress
- Review
- Done

### 4. Add GitHub Labels

- bug 🐛
- enhancement ✨
- documentation 📚
- help wanted 🤝
- good first issue 👶
- wontfix ❌

---

## 🔄 Common Git Commands

### Push Changes
```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

### Create Feature Branch
```bash
git checkout -b feature/feature-name
git push origin feature/feature-name
```

### Merge with Main
```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feature/feature-name

# Push
git push origin main
```

---

## 📦 Docker Hub Integration (Optional)

### 1. Create Docker Hub Account
- Go to [Docker Hub](https://hub.docker.com)
- Sign up for free account

### 2. Login to Docker Hub
```bash
docker login
```

### 3. Build and Push Images
```bash
# Build backend
docker build -t yourdockerhubusername/e-utilities-cost-backend:latest ./backend
docker push yourdockerhubusername/e-utilities-cost-backend:latest

# Build frontend
docker build -t yourdockerhubusername/e-utilities-cost-frontend:latest ./frontend
docker push yourdockerhubusername/e-utilities-cost-frontend:latest
```

### 4. Update docker-compose.yml
Replace image names with your Docker Hub images

---

## ✅ Project Ready Checklist

- [x] Git repository initialized locally
- [ ] GitHub repository created
- [ ] Project pushed to GitHub
- [ ] Docker images built
- [ ] Docker containers tested and working
- [ ] README.md updated with your information
- [ ] Environment variables configured (.env)
- [ ] Backend database running and seeded
- [ ] Frontend accessible at http://localhost:8080
- [ ] API accessible at http://localhost:3000/api
- [ ] All 6 Docker containers running:
  - [x] MariaDB
  - [x] phpMyAdmin
  - [x] Redis
  - [x] Backend
  - [x] Frontend
  - [x] Nginx

---

## 🚀 Next Steps

1. **Local Development**
   ```bash
   docker-compose up -d
   # Access at http://localhost:8080
   ```

2. **Development Workflow**
   - Create feature branches
   - Commit changes
   - Push to GitHub
   - Create Pull Requests

3. **Production Deployment**
   - Push Docker images to registry
   - Deploy using docker-compose on server
   - Configure domain and SSL
   - Monitor and maintain

---

## 📚 Useful Resources

- [GitHub Docs](https://docs.github.com)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Guide](https://docs.docker.com/compose)

---

**Created for e-utilities-cost project | August 2024**
