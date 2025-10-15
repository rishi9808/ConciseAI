# 🐳 Docker Database Setup - Complete Guide

## 📋 Overview

This project now includes a complete Docker setup for running PostgreSQL database locally. No need to install PostgreSQL on your machine!

## 🚀 Quick Start (3 Steps)

### 1️⃣ Start the Database

```bash
npm run db:start
```

This will:
- ✅ Start PostgreSQL container
- ✅ Start pgAdmin (database UI)
- ✅ Wait for database to be ready
- ✅ Generate Prisma Client
- ✅ Run all migrations

### 2️⃣ Update Environment Variables

Add to your `.env.local`:

```env
DATABASE_URL="postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db"
```

### 3️⃣ Start Your App

```bash
npm run dev
```

**That's it! You're ready to go! 🎉**

---

## 📦 What's Included

### Services Running

| Service | Port | Description |
|---------|------|-------------|
| **PostgreSQL** | 5432 | Main database |
| **pgAdmin** | 5050 | Database management UI |

### Containers

- `conciseai-postgres` - PostgreSQL 16 Alpine
- `conciseai-pgadmin` - pgAdmin 4 (optional)

---

## 🛠️ Available Commands

### NPM Scripts (Recommended)

```bash
# Database Management
npm run db:start          # Start database + run migrations
npm run db:stop           # Stop database containers
npm run db:reset          # Reset database (deletes all data!)
npm run db:studio         # Open Prisma Studio

# Prisma Commands
npm run db:migrate        # Create a new migration
npm run db:generate       # Generate Prisma Client
npm run db:push          # Push schema without migration

# Docker Commands
npm run docker:up         # Start containers only
npm run docker:down       # Stop and remove containers
npm run docker:logs       # View container logs
```

### Direct Docker Commands

```bash
# Start/Stop
docker-compose up -d              # Start all services
docker-compose stop               # Stop services
docker-compose down               # Remove containers
docker-compose down -v            # Remove containers + volumes (data)

# Logs
docker-compose logs -f            # Follow all logs
docker-compose logs postgres      # PostgreSQL logs only
docker-compose logs pgadmin       # pgAdmin logs only

# Status
docker-compose ps                 # List containers
docker stats conciseai-postgres   # Resource usage
```

---

## 🔐 Access Information

### PostgreSQL Database

**Connection String:**
```
postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db
```

**Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `conciseai_db`
- Username: `conciseai`
- Password: `conciseai_password_2024`

### pgAdmin (Database UI)

**URL:** http://localhost:5050

**Login:**
- Email: `admin@conciseai.com`
- Password: `admin123`

**Add PostgreSQL Server in pgAdmin:**
1. Right-click "Servers" → "Register" → "Server"
2. **General Tab:**
   - Name: `ConciseAI Local`
3. **Connection Tab:**
   - Host: `postgres` (from pgAdmin) or `localhost` (from your machine)
   - Port: `5432`
   - Database: `conciseai_db`
   - Username: `conciseai`
   - Password: `conciseai_password_2024`

### Prisma Studio

```bash
npm run db:studio
```

**URL:** http://localhost:5555

---

## 📊 Database Operations

### View Data

**Option 1: Prisma Studio (Recommended)**
```bash
npm run db:studio
```
- Beautiful UI
- Easy to use
- Edit data visually

**Option 2: pgAdmin**
- Go to http://localhost:5050
- Professional tool
- Advanced features

**Option 3: CLI**
```bash
docker exec -it conciseai-postgres psql -U conciseai -d conciseai_db
```

### Backup Database

```bash
# Create backup
docker exec conciseai-postgres pg_dump -U conciseai conciseai_db > backup_$(date +%Y%m%d).sql

# Or use provided script
./scripts/backup-db.sh
```

### Restore Database

```bash
# Restore from backup
docker exec -i conciseai-postgres psql -U conciseai -d conciseai_db < backup.sql
```

### Reset Database

```bash
# This deletes ALL data!
npm run db:reset
```

---

## 🔄 Development Workflow

### Normal Development

```bash
# 1. Start database (once per session)
npm run db:start

# 2. Start development server
npm run dev

# 3. When done, optionally stop database
npm run db:stop
```

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma

# 2. Create migration
npm run db:migrate

# 3. Migration is applied automatically
```

### Viewing Data

```bash
# Quick view
npm run db:studio
```

---

## 🐛 Troubleshooting

### Port 5432 Already in Use

**Problem:** Another PostgreSQL is running on port 5432

**Solution 1:** Stop other PostgreSQL
```bash
# macOS (Homebrew)
brew services stop postgresql

# Linux
sudo systemctl stop postgresql
```

**Solution 2:** Use different port in `docker-compose.yml`
```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Use 5433 instead
```
Then update DATABASE_URL to use port 5433

### Connection Refused

**Problem:** Database not ready yet

**Solution:** Wait a few seconds
```bash
# Check if database is ready
docker exec conciseai-postgres pg_isready -U conciseai
```

### Permission Denied

**Problem:** Docker volume permission issues

**Solution:** Reset volumes
```bash
docker-compose down -v
docker-compose up -d
```

### Prisma Client Not Generated

**Problem:** Missing Prisma Client

**Solution:** Generate it
```bash
npm run db:generate
```

### Can't Connect from App

**Checklist:**
- ✅ Is database running? `docker-compose ps`
- ✅ Is DATABASE_URL correct in `.env.local`?
- ✅ Did you restart the dev server after changing `.env.local`?
- ✅ Did you run `npx prisma generate`?

### View Logs

```bash
# All logs
npm run docker:logs

# Or specific service
docker-compose logs -f postgres
```

---

## 🔒 Security Notes

⚠️ **IMPORTANT:** The default credentials are for **DEVELOPMENT ONLY**!

### For Production:

1. **Use Strong Passwords**
   ```yaml
   environment:
     POSTGRES_PASSWORD: ${DB_PASSWORD}  # From .env
   ```

2. **Use Secrets Management**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Environment variables in CI/CD

3. **Enable SSL**
   - Use managed database services
   - Or configure SSL in PostgreSQL

4. **Restrict Access**
   - Don't expose ports publicly
   - Use private networks
   - Enable firewall rules

5. **Regular Backups**
   - Automated daily backups
   - Test restore procedures
   - Store backups securely

---

## 🚀 Production Alternatives

Instead of Docker in production, use:

### Managed Database Services

**Recommended Options:**
- [Supabase](https://supabase.com/) - Free tier, PostgreSQL, easy setup
- [Neon](https://neon.tech/) - Serverless PostgreSQL, free tier
- [Railway](https://railway.app/) - Easy deployment, free tier
- [AWS RDS](https://aws.amazon.com/rds/) - Enterprise-grade
- [Google Cloud SQL](https://cloud.google.com/sql) - Managed PostgreSQL
- [Azure Database](https://azure.microsoft.com/en-us/products/postgresql/) - Microsoft Cloud

**Why Managed?**
- ✅ Automatic backups
- ✅ High availability
- ✅ Scaling
- ✅ Security patches
- ✅ Monitoring
- ✅ No maintenance

---

## 📁 File Structure

```
/Users/rishi/Projects/ConciseAI/
├── docker-compose.yml          # Main Docker configuration
├── Dockerfile                  # App containerization (optional)
├── docker/
│   ├── README.md              # Docker documentation
│   ├── SCRIPTS.md             # Script documentation
│   ├── .gitignore             # Docker-specific ignores
│   └── postgres/
│       └── init/
│           └── 01-init.sh     # Database initialization
├── scripts/
│   ├── start-db.sh            # Start database script
│   ├── stop-db.sh             # Stop database script
│   ├── reset-db.sh            # Reset database script
│   └── db-studio.sh           # Open Prisma Studio
└── .env.local                 # Environment variables
```

---

## 💡 Tips & Best Practices

### 1. Always Use Scripts
```bash
✅ npm run db:start
❌ docker-compose up -d
```
Scripts handle initialization properly

### 2. Version Control
```bash
# .gitignore already includes:
postgres_data/     # Database files
pgadmin_data/      # pgAdmin config
*.sql             # Backup files
```

### 3. Keep Data Separate
- Database data is in Docker volumes
- Survives container restarts
- Only deleted with `docker-compose down -v`

### 4. Regular Backups (Production)
```bash
# Automated backup script
0 2 * * * /path/to/backup-db.sh
```

### 5. Monitor Resources
```bash
# Check memory/CPU usage
docker stats conciseai-postgres
```

---

## 🆘 Getting Help

### Check Status
```bash
docker-compose ps
```

### View Logs
```bash
npm run docker:logs
```

### Test Connection
```bash
docker exec -it conciseai-postgres psql -U conciseai -d conciseai_db -c "SELECT version();"
```

### Access Container Shell
```bash
docker exec -it conciseai-postgres /bin/sh
```

---

## 📚 Additional Resources

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

---

## ✅ Checklist

Before starting development:

- [ ] Docker Desktop installed and running
- [ ] `.env.local` has DATABASE_URL
- [ ] Ran `npm run db:start`
- [ ] Database is ready (green checkmark)
- [ ] Prisma Client generated
- [ ] Migrations applied

Now you're ready to develop! 🚀

---

**Need help?** Check the troubleshooting section or open an issue.
