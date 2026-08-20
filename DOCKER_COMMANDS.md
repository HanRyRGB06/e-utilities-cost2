# Docker Commands Reference

## 🐳 Quick Docker Commands

### View Status
```bash
# List all containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mariadb
```

### Start & Stop
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop specific service
docker-compose stop backend

# Restart service
docker-compose restart backend
```

### Build & Rebuild
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache

# Build and start
docker-compose up -d --build
```

### Execute Commands
```bash
# Run command in container
docker-compose exec backend npm run dev

# Run command in database
docker-compose exec mariadb mariadb -u root -p

# Access shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Database
```bash
# Connect to MySQL
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost

# Run SQL query
docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost -e "SHOW TABLES;"

# Database backup
docker-compose exec mariadb mysqldump -u root -pchangeme_root e_utilities_cost > backup.sql

# Database restore
docker-compose exec -T mariadb mysql -u root -pchangeme_root e_utilities_cost < backup.sql
```

### Cleanup
```bash
# Remove stopped containers
docker-compose rm

# Remove images
docker image rm e-utilities-cost-backend e-utilities-cost-frontend

# Remove volumes (WARNING: Data loss!)
docker volume rm e-utilities-cost_mariadb_data

# Full cleanup
docker-compose down -v
```

---

## 🌍 Access Points

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| Frontend | http://localhost:8080 | - | - |
| Backend API | http://localhost:3000/api | - | - |
| Backend Health | http://localhost:3000/health | - | - |
| phpMyAdmin | http://localhost:8081 | app_user | changeme |
| Nginx Proxy | http://localhost | - | - |
| Redis | localhost:6379 | (no auth) | - |

---

## 🔧 Useful Docker Compose Options

### Run in Background
```bash
docker-compose up -d
```

### Run in Foreground (see logs)
```bash
docker-compose up
```

### Scale Service
```bash
# Run multiple instances (if service supports it)
docker-compose up -d --scale backend=2
```

### View Resource Usage
```bash
docker stats
```

### Network
```bash
# List networks
docker network ls

# Inspect network
docker network inspect e-utilities-cost_e-utilities-network

# Connect to network
docker run -it --network e-utilities-cost_e-utilities-network ubuntu bash
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Container Won't Start
```bash
# View logs
docker-compose logs backend

# Check container status
docker-compose ps

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Cannot Connect to Database
```bash
# Check MariaDB is running
docker-compose ps mariadb

# Test connection
docker-compose exec backend npm run test:db

# View MariaDB logs
docker-compose logs mariadb
```

### Frontend Cannot Reach Backend
```bash
# Check backend is running
docker-compose ps backend

# Test from frontend container
docker-compose exec frontend curl http://backend:3000/health

# Check Nginx proxy
docker-compose exec nginx curl http://backend:3000/health
```

---

## 📊 Docker Compose File Structure

```yaml
version: '3.8'          # Docker Compose version

services:               # Define services (containers)
  mariadb:
    image:             # Pre-built image
    build:             # Build from Dockerfile
    container_name:    # Container name
    environment:       # Environment variables
    volumes:           # Data persistence
    ports:             # Port mapping
    depends_on:        # Service dependencies
    networks:          # Custom networks
    restart:           # Restart policy
    healthcheck:       # Health check config

volumes:               # Named volumes
networks:              # Custom networks
```

---

## 🔐 Security Tips

### Don't Commit Secrets
```bash
# .env file in .gitignore
echo ".env" >> .gitignore
```

### Secure Docker Registry
```bash
# Login to Docker Hub
docker login

# Logout when done
docker logout
```

### Update Images Regularly
```bash
# Pull latest images
docker-compose pull

# Rebuild with latest base images
docker-compose build --pull
```

---

## 💾 Backup & Restore

### Backup Database
```bash
docker-compose exec mariadb mysqldump -u root -pchangeme_root e_utilities_cost > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
docker-compose exec -T mariadb mysql -u root -pchangeme_root e_utilities_cost < backup.sql
```

### Backup Volumes
```bash
# Create backup
docker run --rm --volumes-from e-utilities-mariadb -v $(pwd):/backup alpine tar czf /backup/mariadb_backup.tar.gz /var/lib/mysql

# Restore from backup
docker run --rm --volumes-from e-utilities-mariadb -v $(pwd):/backup alpine tar xzf /backup/mariadb_backup.tar.gz -C /
```

---

## 📈 Performance Monitoring

### View Container Resources
```bash
docker stats

# Specific container
docker stats e-utilities-backend
```

### View System Info
```bash
docker system df
docker system info
```

### Prune Unused Resources
```bash
docker system prune       # Remove unused containers, networks, images
docker system prune -a    # Also remove unused images
docker system prune -a --volumes  # Also remove volumes
```

---

## 🚀 Production Considerations

### Use .env.production
```bash
NODE_ENV=production
JWT_SECRET=<strong-secret-key>
DB_PASSWORD=<strong-password>
```

### Enable Logging
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Set Restart Policy
```yaml
restart: always
```

### Use Secrets (Docker Swarm/Kubernetes)
```bash
# For production, use Docker secrets or Kubernetes
docker secret create db_password -
```

---

**Docker Documentation**: https://docs.docker.com/
**Docker Compose Docs**: https://docs.docker.com/compose/
