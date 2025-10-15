#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Opening Prisma Studio...${NC}"
echo -e "${YELLOW}This will open in your browser at http://localhost:5555${NC}"
echo ""

npx prisma studio
