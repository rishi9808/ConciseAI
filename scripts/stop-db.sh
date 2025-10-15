#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping Docker containers...${NC}"
docker-compose stop

echo -e "${GREEN}✅ Database containers stopped${NC}"
echo -e "${YELLOW}💡 To start again, run: npm run db:start${NC}"
