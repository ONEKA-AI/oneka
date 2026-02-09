# PostgreSQL + PostGIS Database Setup and Configuration

**Date:** February 9, 2026  
**PostgreSQL Version:** 16.11  
**PostGIS Version:** 3.4  
**Target OS:** Ubuntu 24.04 / Linux

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [PostgreSQL Installation](#postgresql-installation)
4. [PostGIS Extension Installation](#postgis-extension-installation)
5. [Database Creation and Configuration](#database-creation-and-configuration)
6. [Backend Integration](#backend-integration)
7. [Alembic Migration Setup](#alembic-migration-setup)
8. [Testing and Verification](#testing-and-verification)
9. [Troubleshooting](#troubleshooting)
10. [Environment Configuration](#environment-configuration)

---

## Overview

This guide documents the complete setup process for PostgreSQL with PostGIS spatial extension and its integration with the ONEKA AI backend. PostGIS is essential for our application as it enables spatial queries on GPS coordinates, distance calculations, and geographic data analysis for infrastructure project locations.

### Why PostGIS?

- **Spatial Queries:** Calculate distances between project locations and perform radius searches
- **Geometry Type:** Store GPS coordinates as `GEOMETRY(POINT, 4326)` with WGS84 spatial reference
- **Spatial Indexing:** GIST indexes for fast geospatial queries
- **Integration:** Seamless integration with SQLAlchemy via GeoAlchemy2

---

## Prerequisites

- Ubuntu 24.04 or compatible Linux distribution
- sudo/root access
- Python 3.11+ installed
- Basic knowledge of PostgreSQL and SQL

---

## PostgreSQL Installation

### Step 1: Check if PostgreSQL is Already Installed

```bash
psql --version
```

If PostgreSQL is already installed, you'll see output like:

```
psql (PostgreSQL) 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
```

### Step 2: Install PostgreSQL (if not installed)

For Ubuntu/Debian systems:

```bash
# Update package lists
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### Step 3: Verify PostgreSQL Server

```bash
# Connect as postgres user
sudo -u postgres psql -c "SELECT version();"
```

Expected output should show PostgreSQL version information.

---

## PostGIS Extension Installation

### Step 1: Install PostGIS Package

PostGIS must match your PostgreSQL version. For PostgreSQL 16:

```bash
# Update package lists
sudo apt update

# Install PostGIS for PostgreSQL 16
sudo apt install -y postgresql-16-postgis-3

# Verify installation
dpkg -l | grep postgis
```

### Step 2: Verify PostGIS Files

Check that PostGIS control files are present:

```bash
ls /usr/share/postgresql/16/extension/postgis*
```

You should see files like:

- `postgis.control`
- `postgis--3.4.sql`
- `postgis_topology.control`

---

## Database Creation and Configuration

### Step 1: Create Database User

```bash
# Connect as postgres superuser
sudo -u postgres psql
```

In the PostgreSQL prompt, run:

```sql
-- Create user with password
CREATE USER oneka_user WITH PASSWORD 'password';

-- Grant createdb privilege (optional, for test databases)
ALTER USER oneka_user CREATEDB;
```

### Step 2: Create Databases

```sql
-- Create development database
CREATE DATABASE oneka_dev OWNER oneka_user;

-- Create test database
CREATE DATABASE oneka_test OWNER oneka_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE oneka_dev TO oneka_user;
GRANT ALL PRIVILEGES ON DATABASE oneka_test TO oneka_user;
```

### Step 3: Enable PostGIS Extension

```sql
-- Connect to development database
\c oneka_dev

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS installation
SELECT PostGIS_version();
```

Expected output:

```
            postgis_version
---------------------------------------
 3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
```

```sql
-- Connect to test database
\c oneka_test

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Step 4: Grant Schema Permissions

**Important:** PostgreSQL 15+ changed default schema permissions. We need to explicitly grant permissions:

```sql
-- Connect to oneka_dev
\c oneka_dev

-- Grant schema permissions to oneka_user
GRANT ALL ON SCHEMA public TO oneka_user;

-- Grant permissions on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO oneka_user;

-- Grant permissions on future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO oneka_user;

-- Repeat for test database
\c oneka_test
GRANT ALL ON SCHEMA public TO oneka_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO oneka_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO oneka_user;
```

Exit psql:

```sql
\q
```

### Step 5: Test User Connection

```bash
# Test connection with oneka_user
PGPASSWORD=password psql -U oneka_user -d oneka_dev -h localhost -c "SELECT current_database(), current_user, PostGIS_version();"
```

Expected output:

```
 current_database | current_user |            postgis_version
------------------+--------------+---------------------------------------
 oneka_dev        | oneka_user   | 3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
```

---

## Backend Integration

### Step 1: Install Python Dependencies

The following packages are required for PostgreSQL + PostGIS integration:

```bash
cd backend
source venv/bin/activate
pip install psycopg2-binary sqlalchemy geoalchemy2 alembic
```

These are already in `requirements.txt`:

- `psycopg2-binary==2.9.9` - PostgreSQL adapter for Python
- `sqlalchemy==2.0.25` - ORM framework
- `geoalchemy2==0.14.3` - PostGIS integration for SQLAlchemy
- `alembic==1.13.1` - Database migration tool

### Step 2: Configure Database Connection

Create `.env` file in `backend/` directory:

```bash
cp .env.example .env
nano .env
```

Update the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://oneka_user:password@localhost:5432/oneka_dev
DATABASE_TEST_URL=postgresql://oneka_user:password@localhost:5432/oneka_test

# Application Configuration
ENVIRONMENT=development
DEBUG=True
```

### Step 3: Database Connection Layer

The database connection is configured in `src/database.py`:

```python
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from src.config import settings

# Create database engine with connection pooling
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # Verify connections before using
    echo=settings.debug,  # Log SQL statements in debug mode
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()
```

**Key Points:**

- `pool_pre_ping=True` - Ensures connections are valid before use
- `echo=settings.debug` - Logs SQL queries in development mode
- `declarative_base()` - All models inherit from this Base

### Step 4: PostGIS Model Example

The `GeolocationRecord` model demonstrates PostGIS integration:

```python
from sqlalchemy import Column, DECIMAL, Boolean, String
from geoalchemy2 import Geometry
from src.models.base import Base, TimestampMixin

class GeolocationRecord(Base, TimestampMixin):
    __tablename__ = "geolocation_records"

    # ... other columns ...

    # GPS coordinates as decimals
    latitude = Column(DECIMAL(9, 6), nullable=False)
    longitude = Column(DECIMAL(9, 6), nullable=False)

    # PostGIS geometry column for spatial queries
    geom = Column(
        Geometry(geometry_type='POINT', srid=4326),
        nullable=True,
        comment='PostGIS Point geometry for spatial queries (SRID 4326 = WGS84)'
    )

    __table_args__ = (
        Index('idx_geolocation_records_geom', 'geom', postgresql_using='gist'),
    )
```

**Key Components:**

- `Geometry(geometry_type='POINT', srid=4326)` - Point geometry with WGS84 coordinate system
- `SRID 4326` - Standard GPS coordinate system
- GIST index on `geom` column for fast spatial queries

### Step 5: Create Database Tables

We use SQLAlchemy to create tables directly:

```bash
cd backend
source venv/bin/activate

# Create all tables
python -c "from src.database import Base, engine; from src.models import *; Base.metadata.create_all(bind=engine)"
```

### Step 6: Verify Tables

```bash
PGPASSWORD=password psql -U oneka_user -d oneka_dev -h localhost -c "\dt"
```

Expected output:

```
                 List of relations
 Schema |        Name         | Type  |   Owner
--------+---------------------+-------+------------
 public | financial_records   | table | oneka_user
 public | geolocation_records | table | oneka_user
 public | procurement_records | table | oneka_user
 public | projects            | table | oneka_user
 public | satellite_analyses  | table | oneka_user
 public | spatial_ref_sys     | table | postgres
```

---

## Alembic Migration Setup

Alembic is used for database schema versioning and migrations.

### Step 1: Initialize Alembic

```bash
cd backend
source venv/bin/activate
alembic init alembic
```

This creates:

- `alembic/` directory with migration scripts
- `alembic.ini` configuration file
- `alembic/env.py` environment setup

### Step 2: Configure alembic.ini

Edit `backend/alembic.ini` and update the database URL:

```ini
# Replace this line:
sqlalchemy.url = driver://user:pass@localhost/dbname

# With:
sqlalchemy.url = postgresql://oneka_user:password@localhost:5432/oneka_dev
```

### Step 3: Configure alembic/env.py

Update `alembic/env.py` to import your models:

```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import geoalchemy2  # Required for PostGIS support

# Import Base and all models
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.database import Base
from src.models import (
    Project,
    ProcurementRecord,
    GeolocationRecord,
    FinancialRecord,
    SatelliteAnalysis
)

# ... rest of the file ...

# Set target_metadata to your Base metadata
target_metadata = Base.metadata


def include_object(object, name, type_, reflected, compare_to):
    """
    Exclude PostGIS system tables from migrations.
    """
    if type_ == "table" and name in [
        "spatial_ref_sys",
        "geography_columns",
        "geometry_columns",
        "raster_columns",
        "raster_overviews"
    ]:
        return False
    return True


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object,  # Add this
    )
    # ... rest of function ...


def run_migrations_online() -> None:
    # ... connector setup ...

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=include_object,  # Add this
        )
        # ... rest of function ...
```

**Key Points:**

- Import `geoalchemy2` for PostGIS type support
- Import all models so Alembic can detect them
- Set `target_metadata = Base.metadata`
- Exclude PostGIS system tables with `include_object` function

### Step 4: Create Initial Migration

```bash
# Generate migration from current models
alembic revision --autogenerate -m "Initial database schema with PostGIS"
```

This creates a migration file in `alembic/versions/`.

### Step 5: Fix Migration File

Open the generated migration file and add `import geoalchemy2` at the top:

```python
"""Initial database schema with PostGIS

Revision ID: bcf9c05b9fb7
Revises:
Create Date: 2026-02-09 18:46:05.743568
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import geoalchemy2  # Add this line

# ... rest of the file ...
```

### Step 6: Apply Migration (Optional)

**Note:** We already created tables using SQLAlchemy directly. If starting fresh:

```bash
# Apply migration
alembic upgrade head

# To rollback
alembic downgrade -1
```

### Step 7: Check Migration History

```bash
# View migration history
alembic history

# Check current version
alembic current
```

---

## Testing and Verification

### Test 1: Database Connection

```bash
PGPASSWORD=password psql -U oneka_user -d oneka_dev -h localhost -c "SELECT current_user, current_database();"
```

### Test 2: PostGIS Version

```bash
PGPASSWORD=password psql -U oneka_user -d oneka_dev -h localhost -c "SELECT PostGIS_version();"
```

### Test 3: Spatial Query

Test PostGIS spatial functions:

```bash
PGPASSWORD=password psql -U oneka_user -d oneka_dev -h localhost -c "
SELECT
    ST_Distance(
        ST_GeomFromText('POINT(-1.2921 36.8219)', 4326),
        ST_GeomFromText('POINT(-1.2820 36.8170)', 4326)
    ) as distance_degrees;
"
```

Expected: Returns a decimal value (distance in degrees)

### Test 4: FastAPI Health Endpoints

Start the FastAPI server:

```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Test endpoints:

```bash
# Basic health check
curl http://localhost:8000/api/v1/health

# Database health check
curl http://localhost:8000/api/v1/health/db

# System status with record counts
curl http://localhost:8000/api/v1/status
```

Expected `/health/db` response:

```json
{
  "status": "healthy",
  "database": "connected",
  "postgis_version": "3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1",
  "table_count": 8,
  "timestamp": "2026-02-09T15:53:42.484458"
}
```

### Test 5: Python SQLAlchemy Connection

```bash
cd backend
source venv/bin/activate
python
```

In Python:

```python
from src.database import SessionLocal
from src.models import Project

# Create a session
db = SessionLocal()

# Test query
count = db.query(Project).count()
print(f"Projects in database: {count}")

db.close()
```

---

## Troubleshooting

### Issue 1: Password Authentication Failed

**Error:**

```
FATAL: password authentication failed for user "oneka_user"
```

**Solution:**
Check PostgreSQL authentication configuration in `/etc/postgresql/16/main/pg_hba.conf`:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Ensure there's a line for local connections:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

### Issue 2: PostGIS Extension Not Available

**Error:**

```
ERROR: extension "postgis" is not available
```

**Solution:**
Install PostGIS package for your PostgreSQL version:

```bash
sudo apt install postgresql-16-postgis-3
```

### Issue 3: Permission Denied on Schema

**Error:**

```
ERROR: permission denied for schema public
```

**Solution:**
Grant schema permissions:

```sql
sudo -u postgres psql -d oneka_dev -c "GRANT ALL ON SCHEMA public TO oneka_user;"
sudo -u postgres psql -d oneka_dev -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO oneka_user;"
sudo -u postgres psql -d oneka_dev -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO oneka_user;"
```

### Issue 4: Import Error - geoalchemy2 Not Found

**Error:**

```
NameError: name 'geoalchemy2' is not defined
```

**Solution:**
Add `import geoalchemy2` to:

- `alembic/env.py`
- Any Alembic migration files that use Geometry types

### Issue 5: Duplicate Base Declaration

**Error:**

```
Tables not registering with Base.metadata
```

**Solution:**
Ensure Base is only declared once. Import from `src/database.py`:

```python
# In src/models/base.py
from src.database import Base  # Import from database.py

# NOT:
# Base = declarative_base()  # Don't create a new Base
```

### Issue 6: Connection Pool Exhausted

**Error:**

```
sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached
```

**Solution:**
Increase pool size in `src/database.py`:

```python
engine = create_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)
```

### Issue 7: PostGIS System Tables in Migrations

**Error:**

```
Detected removed table 'spatial_ref_sys'
```

**Solution:**
Use `include_object` function in `alembic/env.py` to exclude PostGIS system tables (see Alembic setup section).

---

## Environment Configuration

### Development Environment

```env
# .env file for development
DATABASE_URL=postgresql://oneka_user:password@localhost:5432/oneka_dev
DATABASE_TEST_URL=postgresql://oneka_user:password@localhost:5432/oneka_test
ENVIRONMENT=development
DEBUG=True
```

### Production Environment (Future)

```env
# .env file for production
DATABASE_URL=postgresql://oneka_prod_user:strong_password@prod-db-host:5432/oneka_prod
ENVIRONMENT=production
DEBUG=False

# Additional production settings
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
DATABASE_POOL_TIMEOUT=30
```

### Testing Environment

For running tests:

```python
# tests/conftest.py
TEST_DATABASE_URL = "postgresql://oneka_user:password@localhost:5432/oneka_test"

@pytest.fixture(scope="session")
def test_engine():
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
```

---

## Useful Commands Cheat Sheet

### PostgreSQL Commands

```bash
# Connect to database
psql -U oneka_user -d oneka_dev -h localhost

# List databases
\l

# List tables
\dt

# Describe table structure
\d table_name

# List indexes
\di

# View PostGIS version
SELECT PostGIS_version();

# Check PostGIS functions available
SELECT * FROM pg_proc WHERE proname LIKE 'st_%' LIMIT 20;

# Exit psql
\q
```

### Alembic Commands

```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show migration history
alembic history

# Show current version
alembic current

# View SQL that would be executed (without applying)
alembic upgrade head --sql
```

### Database Maintenance

```bash
# Backup database
pg_dump -U oneka_user -h localhost oneka_dev > backup.sql

# Restore database
psql -U oneka_user -h localhost oneka_dev < backup.sql

# Vacuum database (cleanup)
VACUUM ANALYZE;

# Check database size
SELECT pg_size_pretty(pg_database_size('oneka_dev'));
```

---

## Summary Checklist

For new team members setting up the database:

- [ ] PostgreSQL 16+ installed and running
- [ ] PostGIS 3.4+ extension installed
- [ ] `oneka_user` database user created
- [ ] `oneka_dev` and `oneka_test` databases created
- [ ] PostGIS extension enabled on both databases
- [ ] Schema permissions granted to `oneka_user`
- [ ] Backend `.env` file configured with correct database URL
- [ ] Python dependencies installed (`psycopg2-binary`, `geoalchemy2`, etc.)
- [ ] Database tables created using SQLAlchemy or Alembic
- [ ] Alembic configured with models imported
- [ ] FastAPI server connects successfully to database
- [ ] `/health/db` endpoint returns healthy status
- [ ] Spatial queries tested and working

---

## Additional Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/16/
- **PostGIS Documentation:** https://postgis.net/documentation/
- **SQLAlchemy Documentation:** https://docs.sqlalchemy.org/
- **GeoAlchemy2 Documentation:** https://geoalchemy-2.readthedocs.io/
- **Alembic Documentation:** https://alembic.sqlalchemy.org/

---

## Support

For issues with database setup:

1. Check the Troubleshooting section above
2. Review logs: `sudo journalctl -u postgresql -n 50`
3. Check PostgreSQL logs: `/var/log/postgresql/postgresql-16-main.log`
4. Ask in `#oneka-backend` Slack channel

---

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Maintained By:** ONEKA Backend Team
