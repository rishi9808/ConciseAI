#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p backups

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/conciseai_backup_${TIMESTAMP}.sql"

echo -e "${BLUE}💾 Creating database backup...${NC}"

# Create backup
docker exec conciseai-postgres pg_dump -U conciseai conciseai_db > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo -e "${GREEN}✅ Backup created successfully!${NC}"
    echo -e "${BLUE}📁 File: ${BACKUP_FILE}${NC}"
    echo -e "${BLUE}📊 Size: ${SIZE}${NC}"
    echo ""
    echo -e "${YELLOW}💡 To restore this backup:${NC}"
    echo -e "   docker exec -i conciseai-postgres psql -U conciseai -d conciseai_db < ${BACKUP_FILE}"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi

# Optional: Clean old backups (keep last 10)
cd backups
ls -t conciseai_backup_*.sql | tail -n +11 | xargs -r rm
cd ..

echo -e "${GREEN}🧹 Old backups cleaned (kept last 10)${NC}"
