# ONEKA AI - Backend API

**Kenya's First Autonomous Infrastructure Auditing Platform - Backend Services**

## Overview

ONEKA AI backend provides RESTful API services for infrastructure project monitoring, combining procurement data, financial records, satellite imagery analysis, and machine learning predictions to detect ghost projects.

## Tech Stack

- **Framework**: FastAPI 0.109.0
- **Database**: PostgreSQL 15 with PostGIS extension
- **ORM**: SQLAlchemy 2.0.25
- **Migrations**: Alembic 1.13.1
- **Task Queue**: Celery + Redis
- **Python**: 3.11+

## Project Structure

```
backend/
├── src/
│   ├── models/           # SQLAlchemy database models
│   ├── schemas/          # Pydantic validation schemas
│   ├── routers/          # API route handlers
│   ├── services/         # Business logic layer
│   ├── database.py       # Database connection
│   ├── config.py         # Application settings
│   └── main.py           # FastAPI application entry
├── alembic/              # Database migrations
├── tests/                # Unit and integration tests
├── docs/                 # Backend documentation
└── requirements.txt      # Python dependencies
```

## Setup Instructions

### Prerequisites

- Python 3.11 or higher
- PostgreSQL 15
- PostGIS extension
- Redis (for Celery tasks)

### 1. Install PostgreSQL with PostGIS

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15
sudo apt install postgis postgresql-15-postgis-3
```

#### macOS

```bash
brew install postgresql@15
brew install postgis
```

### 2. Create Database

```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS

# Create database and user
sudo -u postgres psql
```

```sql
-- In PostgreSQL shell
CREATE DATABASE oneka_dev;
CREATE DATABASE oneka_test;
CREATE USER oneka_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE oneka_dev TO oneka_user;
GRANT ALL PRIVILEGES ON DATABASE oneka_test TO oneka_user;

-- Connect to database and enable PostGIS
\c oneka_dev
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

-- Verify PostGIS installation
SELECT PostGIS_version();

-- Exit
\q
```

### 3. Python Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate  # Windows

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configurations
nano .env  # or use your preferred editor
```

Update the `DATABASE_URL` with your actual credentials:

```
DATABASE_URL=postgresql://oneka_user:your_password@localhost:5432/oneka_dev
```

### 5. Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Run migrations
alembic upgrade head

# Verify tables created
psql -U oneka_user -d oneka_dev -c "\dt"
```

### 6. Run Development Server

```bash
# Start FastAPI development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Alternative using Python
python -m uvicorn src.main:app --reload
```

Server will be available at:

- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health & Status

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/db` - Database connectivity check
- `GET /api/v1/status` - System status with record counts

### Projects (Sprint 2+)

- `GET /api/v1/projects` - List all projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/{uuid}` - Get project details
- `PUT /api/v1/projects/{uuid}` - Update project
- `DELETE /api/v1/projects/{uuid}` - Delete project

### Procurement (Sprint 2+)

- `GET /api/v1/procurement/tenders` - List tender records
- `GET /api/v1/procurement/scrape` - Trigger PPIP scraper

## Database Schema

### Core Tables

#### projects

Master registry for all infrastructure projects with universal UUID.

#### procurement_records

Tender data scraped from PPIP (Public Procurement Information Portal).

#### financial_records

Budget allocation and disbursement data from Controller of Budget.

#### geolocation_records

GPS coordinates with PostGIS geometry for spatial queries.

#### satellite_analyses

NDVI, SAR, and other satellite metrics for change detection.

See [docs/database-schema.md](docs/database-schema.md) for complete schema documentation.

## Development Workflow

### Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/backend/sprint1-database-setup
```

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_models.py
```

### Code Quality

```bash
# Format code with Black
black src/

# Lint with flake8
flake8 src/

# Type checking with mypy
mypy src/
```

### Create Migration

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Add new column to projects table"

# Review generated migration in alembic/versions/
# Edit if needed, then apply
alembic upgrade head
```

## Environment Variables

| Variable       | Description                  | Default                  |
| -------------- | ---------------------------- | ------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | -                        |
| `DEBUG`        | Enable debug mode            | True                     |
| `API_HOST`     | Server host                  | 0.0.0.0                  |
| `API_PORT`     | Server port                  | 8000                     |
| `REDIS_URL`    | Redis connection for Celery  | redis://localhost:6379/0 |

## Testing

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test class
pytest tests/test_models.py::TestProjectModel

# Generate coverage report
pytest --cov=src --cov-report=term-missing
```

## Troubleshooting

### PostGIS Extension Not Found

```sql
-- Manually create extension
sudo -u postgres psql -d oneka_dev
CREATE EXTENSION postgis;
```

### Database Connection Refused

```bash
# Check PostgreSQL service status
sudo systemctl status postgresql

# Start service if stopped
sudo systemctl start postgresql
```

### Alembic Migration Conflicts

```bash
# Check current revision
alembic current

# View migration history
alembic history

# Downgrade one revision
alembic downgrade -1
```

## Sprint 1 Status

- [x] Backend folder structure created
- [x] Requirements and dependencies defined
- [ ] Database schema designed
- [ ] PostgreSQL with PostGIS configured
- [ ] Alembic migrations created
- [ ] SQLAlchemy models implemented
- [ ] FastAPI application structure set up
- [ ] Health check endpoints implemented
- [ ] API documentation completed

## Documentation

- [Database Schema](docs/database-schema.md)
- [API Design](docs/api-design.md)
- [Development Guide](docs/development-guide.md)

## Contributing

See main project [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - See [LICENSE](../LICENSE) for details.

## Contact

**ONEKA AI Development Team**

- Technical Issues: Create issue on GitHub
- Email: dev@oneka.ai

---

**ONEKA AI**: _Making the Invisible, Actionable_
