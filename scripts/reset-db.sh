#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}⚠️  WARNING: This will delete ALL database data!${NC}"
echo -e "${YELLOW}This action cannot be undone.${NC}"
echo ""
read -p "Are you sure you want to reset the database? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}🗑️  Removing containers and volumes...${NC}"
    docker-compose down -v
    
    echo -e "${YELLOW}🐳 Starting fresh containers...${NC}"
    docker-compose up -d
    
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
    
    # Check if database is ready
    until docker exec conciseai-postgres pg_isready -U conciseai > /dev/null 2>&1; do
      echo -e "${YELLOW}Waiting for database connection...${NC}"
      sleep 2
    done
    
    echo -e "${YELLOW}🔄 Generating Prisma Client...${NC}"
    npx prisma generate
    
    echo -e "${YELLOW}🔄 Running migrations...${NC}"
    npx prisma migrate deploy
    
    echo -e "${GREEN}✅ Database reset complete!${NC}"
    echo -e "${YELLOW}💡 Your database is now empty and ready to use.${NC}"
else
    echo -e "${GREEN}Cancelled. No changes made.${NC}"
fi
