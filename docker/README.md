# Docker Database Setup for ConciseAI

This directory contains Docker configuration files for running the PostgreSQL database locally.

## 🚀 Quick Start

### 1. Start the Database

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Check status
docker-compose ps
```

### 2. Update Environment Variables

Update your `.env.local` file with the database connection:

```env
DATABASE_URL="postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db"
```

### 3. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Or create a new migration
npx prisma migrate dev --name init

# Seed database (if you have seed data)
npx prisma db seed
```

### 4. Access Database

**Via Prisma Studio:**
```bash
npx prisma studio
# Opens at http://localhost:5555
```

**Via pgAdmin:**
- URL: http://localhost:5050
- Email: admin@conciseai.com
- Password: admin123

Then add a new server:
- Host: postgres (or localhost from host machine)
- Port: 5432
- Database: conciseai_db
- Username: conciseai
- Password: conciseai_password_2024

## 🛠️ Docker Commands

### Start Services
```bash
docker-compose up -d              # Start in detached mode
docker-compose up                 # Start with logs
```

### Stop Services
```bash
docker-compose stop               # Stop containers
docker-compose down               # Stop and remove containers
docker-compose down -v            # Stop, remove containers and volumes
```

### View Logs
```bash
docker-compose logs               # All logs
docker-compose logs postgres      # Postgres logs only
docker-compose logs -f            # Follow logs
docker-compose logs --tail=100    # Last 100 lines
```

### Database Management
```bash
# Connect to PostgreSQL CLI
docker exec -it conciseai-postgres psql -U conciseai -d conciseai_db

# Backup database
docker exec conciseai-postgres pg_dump -U conciseai conciseai_db > backup.sql

# Restore database
docker exec -i conciseai-postgres psql -U conciseai -d conciseai_db < backup.sql

# Reset database (WARNING: Deletes all data!)
docker-compose down -v
docker-compose up -d
npx prisma migrate deploy
```

### Container Management
```bash
# Restart specific service
docker-compose restart postgres

# View container stats
docker stats conciseai-postgres

# Access container shell
docker exec -it conciseai-postgres /bin/sh
```

## 📦 Services

### PostgreSQL (Port 5432)
- **Image**: postgres:16-alpine
- **Container**: conciseai-postgres
- **Database**: conciseai_db
- **User**: conciseai
- **Password**: conciseai_password_2024

### pgAdmin (Port 5050)
- **Image**: dpage/pgadmin4
- **Container**: conciseai-pgadmin
- **URL**: http://localhost:5050
- **Email**: admin@conciseai.com
- **Password**: admin123

## 🔐 Security Notes

⚠️ **Important**: The credentials in `docker-compose.yml` are for **development only**.

For production:
1. Use strong, unique passwords
2. Use environment variables or secrets management
3. Don't commit `.env` files to git
4. Enable SSL/TLS connections
5. Restrict network access
6. Regular backups

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5432
lsof -i :5432

# Or use different port in docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 on host
```

### Connection Refused
```bash
# Wait for database to be ready
docker-compose logs postgres

# Check health status
docker inspect conciseai-postgres | grep Health
```

### Permission Issues
```bash
# Fix volume permissions
docker-compose down
sudo rm -rf ./postgres_data
docker-compose up -d
```

### Reset Everything
```bash
# Nuclear option - removes all data!
docker-compose down -v
docker volume prune
docker-compose up -d
npx prisma migrate deploy
```

## 📊 Database Schema

Your current Prisma schema includes:
- **User** - User accounts and profiles
- **PdfSummary** - PDF summaries and metadata
- **Payment** - Payment transactions

## 🔄 Development Workflow

1. **Start Database**: `docker-compose up -d`
2. **Run Migrations**: `npx prisma migrate dev`
3. **Start App**: `npm run dev`
4. **View Data**: `npx prisma studio` or pgAdmin
5. **Stop Database**: `docker-compose stop`

## 📝 Environment Variables

Add to your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db"

# Optional: Direct connection (without pooling)
DIRECT_URL="postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db"
```

## 🚀 Production Deployment

For production, consider:
- **Managed Services**: AWS RDS, Google Cloud SQL, Supabase
- **Connection Pooling**: PgBouncer or Prisma Data Proxy
- **Backups**: Automated daily backups
- **Monitoring**: Database performance monitoring
- **Scaling**: Read replicas for heavy read workloads

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

---

**Need Help?** Check the troubleshooting section or view logs with `docker-compose logs -f`
