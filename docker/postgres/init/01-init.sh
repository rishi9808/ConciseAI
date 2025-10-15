#!/bin/bash
set -e

# This script runs when the PostgreSQL container is first initialized
# Add any custom initialization SQL here

echo "Initializing ConciseAI PostgreSQL database..."

# Create extensions if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Enable pg_trgm for text search
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    
    -- Enable pgcrypto for encryption functions
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- Grant all privileges
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL

echo "Database initialization completed!"
