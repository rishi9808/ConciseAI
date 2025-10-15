#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Starting ConciseAI Database...${NC}"

# Start Docker Containers
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Check if database is ready
until docker exec conciseai-postgres pg_isready -U conciseai > /dev/null 2>&1; do
  echo -e "${YELLOW}Waiting for database connection...${NC}"
  sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"

# Generate Prisma Client
echo -e "${YELLOW}🔄 Generating Prisma Client...${NC}"
npx prisma generate

# Run Prisma migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
npx prisma migrate deploy

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo -e "${BLUE}📍 Connection Information:${NC}"
echo -e "   PostgreSQL: postgresql://conciseai:conciseai_password_2024@localhost:5432/conciseai_db"
echo -e "   pgAdmin: http://localhost:5050"
echo -e "   - Email: admin@conciseai.com"
echo -e "   - Password: admin123"
echo ""
echo -e "${BLUE}💡 Useful Commands:${NC}"
echo -e "   View logs: docker-compose logs -f postgres"
echo -e "   Prisma Studio: npx prisma studio"
echo -e "   Stop database: npm run db:stop"
echo ""
