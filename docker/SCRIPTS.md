# Development Environment Setup Scripts

## Quick Start Database

This script starts the PostgreSQL database and sets up everything:

```bash
#!/bin/bash

# Start Docker Containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy

# Open Prisma Studio (optional)
echo "📊 Opening Prisma Studio..."
npx prisma studio &

echo "✅ Database setup complete!"
echo "📍 PostgreSQL: postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db"
echo "📍 pgAdmin: http://localhost:5050 (admin@conciseai.com / admin123)"
echo "📍 Prisma Studio: http://localhost:5555"
```

Save this as `scripts/start-db.sh` and make it executable:

```bash
chmod +x scripts/start-db.sh
./scripts/start-db.sh
```

## Stop Database

```bash
#!/bin/bash
echo "🛑 Stopping Docker containers..."
docker-compose stop
echo "✅ Containers stopped"
```

Save as `scripts/stop-db.sh`

## Reset Database

```bash
#!/bin/bash
echo "⚠️  WARNING: This will delete ALL data!"
read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  Removing containers and volumes..."
    docker-compose down -v
    
    echo "🐳 Starting fresh containers..."
    docker-compose up -d
    
    echo "⏳ Waiting for PostgreSQL..."
    sleep 5
    
    echo "🔄 Running migrations..."
    npx prisma generate
    npx prisma migrate deploy
    
    echo "✅ Database reset complete!"
fi
```

Save as `scripts/reset-db.sh`
