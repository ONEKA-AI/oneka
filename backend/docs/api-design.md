# ONEKA AI API Design

**Version:** 1.0  
**Date:** February 9, 2026  
**Framework:** FastAPI 0.109.0

---

## API Architecture

### Design Principles

1. **RESTful** - Follow REST architectural style with resource-based URLs
2. **Versioned** - All endpoints prefixed with `/api/v1` for future compatibility
3. **Stateless** - Each request contains all information needed
4. **JSON** - All request/response bodies use JSON format
5. **HATEOAS** - Include navigation links in responses where applicable

### Base URL

```
Development: http://localhost:8000
Production: https://api.oneka.ai
```

---

## API Structure

### URL Conventions

```
/api/v1/<resource>/<action>/<id>

Examples:
GET    /api/v1/projects              # List all projects
GET    /api/v1/projects/{uuid}       # Get single project
POST   /api/v1/projects              # Create project
PUT    /api/v1/projects/{uuid}       # Update project
DELETE /api/v1/projects/{uuid}       # Delete project

GET    /api/v1/projects/{uuid}/satellite-analyses  # Nested resource
```

### HTTP Methods

| Method | Purpose                | Idempotent | Safe |
| ------ | ---------------------- | ---------- | ---- |
| GET    | Retrieve resource(s)   | Yes        | Yes  |
| POST   | Create new resource    | No         | No   |
| PUT    | Update entire resource | Yes        | No   |
| PATCH  | Partial update         | No         | No   |
| DELETE | Remove resource        | Yes        | No   |

---

## Sprint 1 Endpoints (Implemented)

### Health & Status

#### 1. Basic Health Check

```http
GET /api/v1/health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "ONEKA AI API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-02-09T10:30:00Z"
}
```

#### 2. Database Health Check

```http
GET /api/v1/health/db
```

**Response (Success):**

```json
{
  "status": "healthy",
  "database": "connected",
  "postgis_version": "3.3.2",
  "table_count": 5,
  "timestamp": "2026-02-09T10:30:00Z"
}
```

**Response (Error - 503):**

```json
{
  "error": "Service Unavailable",
  "detail": "Database connection failed: connection refused"
}
```

#### 3. System Status

```http
GET /api/v1/status
```

**Response:**

```json
{
  "status": "operational",
  "service": "ONEKA AI API",
  "version": "1.0.0",
  "environment": "development",
  "database": {
    "connected": true,
    "records": {
      "projects": 0,
      "tenders": 0,
      "geolocation_records": 0,
      "geolocated_verified": 0,
      "satellite_analyses": 0,
      "high_risk_projects": 0
    }
  },
  "timestamp": "2026-02-09T10:30:00Z"
}
```

#### 4. Ping

```http
GET /api/v1/ping
```

**Response:**

```json
{
  "ping": "pong",
  "timestamp": 1707475800.123
}
```

---

## Sprint 2+ Endpoints (Planned)

### Projects

#### List Projects

```http
GET /api/v1/projects?page=1&limit=20&risk_level=HIGH&county=Nairobi
```

**Query Parameters:**

| Parameter      | Type    | Default | Description                           |
| -------------- | ------- | ------- | ------------------------------------- |
| `page`         | integer | 1       | Page number                           |
| `limit`        | integer | 20      | Items per page (max 100)              |
| `risk_level`   | enum    | -       | Filter by LOW, MEDIUM, HIGH, CRITICAL |
| `county`       | string  | -       | Filter by county                      |
| `status`       | enum    | -       | Filter by project status              |
| `project_type` | enum    | -       | Filter by type                        |
| `search`       | string  | -       | Full-text search on name              |

**Response:**

```json
{
  "data": [
    {
      "project_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "project_name": "Githurai Level 4 Hospital",
      "project_type": "health",
      "county": "Kiambu",
      "status": "ongoing",
      "risk_level": "HIGH",
      "risk_score": 85,
      "estimated_value_kes": 450000000.0,
      "has_geolocation": true,
      "created_at": "2026-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "links": {
    "self": "/api/v1/projects?page=1&limit=20",
    "next": "/api/v1/projects?page=2&limit=20",
    "prev": null
  }
}
```

#### Get Project Details

```http
GET /api/v1/projects/{project_uuid}
```

**Response:**

```json
{
  "project_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "project_name": "Githurai Level 4 Hospital",
  "project_type": "health",
  "county": "Kiambu",
  "ward": "Githurai",
  "status": "ongoing",
  "risk_level": "HIGH",
  "risk_score": 85,
  "estimated_value_kes": 450000000.0,
  "procurement": {
    "tender_number": "MOH/NCPD/2023/0089",
    "contractor_name": "ABC Construction Ltd",
    "award_date": "2023-03-15",
    "contract_sum_kes": 450000000.0
  },
  "financial": {
    "budget_allocated": 450000000.0,
    "budget_absorbed": 270000000.0,
    "absorption_rate": 60.0
  },
  "geolocation": {
    "latitude": -1.1875,
    "longitude": 36.8967,
    "verified": true,
    "match_confidence": 85
  },
  "satellite": {
    "latest_analysis": "2026-02-05",
    "ndvi_change": 0.05,
    "change_detected": false,
    "interpretation": "No construction detected"
  },
  "links": {
    "self": "/api/v1/projects/550e8400-e29b-41d4-a716-446655440000",
    "satellite_analyses": "/api/v1/projects/550e8400-e29b-41d4-a716-446655440000/satellite-analyses",
    "financial_records": "/api/v1/projects/550e8400-e29b-41d4-a716-446655440000/financial-records"
  }
}
```

#### Create Project

```http
POST /api/v1/projects
Content-Type: application/json
```

**Request Body:**

```json
{
  "project_name": "New Hospital Project",
  "project_type": "health",
  "county": "Nairobi",
  "ward": "Westlands",
  "estimated_value_kes": 500000000.0
}
```

**Response (201 Created):**

```json
{
  "project_uuid": "new-uuid-here",
  "project_name": "New Hospital Project",
  "project_type": "health",
  "status": "awarded",
  "created_at": "2026-02-09T10:30:00Z",
  "links": {
    "self": "/api/v1/projects/new-uuid-here"
  }
}
```

### Procurement

#### List Tender Records

```http
GET /api/v1/procurement/tenders?page=1&limit=20
```

#### Trigger PPIP Scraper

```http
POST /api/v1/procurement/scrape
Content-Type: application/json
```

**Request Body:**

```json
{
  "start_date": "2026-02-01",
  "end_date": "2026-02-09",
  "category": "Construction"
}
```

### Geolocation

#### Resolve Project Location

```http
POST /api/v1/geolocation/resolve
Content-Type: application/json
```

**Request Body:**

```json
{
  "project_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "project_name": "Githurai Hospital",
  "county": "Kiambu",
  "ward": "Githurai"
}
```

### Satellite Analyses

#### Get Satellite Time Series

```http
GET /api/v1/projects/{uuid}/satellite-analyses?sensor=Sentinel-2&from=2023-01-01&to=2026-02-09
```

---

## Authentication (Sprint 6+)

### JWT Bearer Token

All protected endpoints require authentication header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request:**

```json
{
  "username": "auditor@oag.go.ke",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": "ErrorType",
  "detail": "Human-readable error message",
  "status_code": 400,
  "path": "/api/v1/projects/invalid-uuid",
  "timestamp": "2026-02-09T10:30:00Z"
}
```

### Common Error Codes

| Code | Name                  | Description                          |
| ---- | --------------------- | ------------------------------------ |
| 400  | Bad Request           | Invalid request format or parameters |
| 401  | Unauthorized          | Authentication required              |
| 403  | Forbidden             | Insufficient permissions             |
| 404  | Not Found             | Resource doesn't exist               |
| 422  | Unprocessable Entity  | Validation error                     |
| 429  | Too Many Requests     | Rate limit exceeded                  |
| 500  | Internal Server Error | Server error (logged)                |
| 503  | Service Unavailable   | Service temporarily down             |

### Validation Error Example

```json
{
  "error": "Validation Error",
  "detail": [
    {
      "loc": ["body", "project_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ],
  "status_code": 422
}
```

---

## Pagination

### Standard Pagination

All list endpoints support pagination:

```
?page=1&limit=20
```

**Response Structure:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "links": {
    "self": "current page URL",
    "next": "next page URL or null",
    "prev": "previous page URL or null",
    "first": "first page URL",
    "last": "last page URL"
  }
}
```

---

## Filtering & Sorting

### Filter Syntax

```
GET /api/v1/projects?risk_level=HIGH&county=Nairobi&status=ongoing
```

### Sort Syntax

```
GET /api/v1/projects?sort=-risk_score,created_at
```

- `-` prefix for descending order
- Multiple fields comma-separated

---

## Rate Limiting (Production)

| Endpoint Type      | Rate Limit           |
| ------------------ | -------------------- |
| Public (no auth)   | 100 requests/minute  |
| Authenticated      | 1000 requests/minute |
| Scraping endpoints | 10 requests/minute   |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707475860
```

---

## CORS Configuration

**Allowed Origins:**

- `http://localhost:3000` (development)
- `https://oneka.ai` (production)

**Allowed Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS

**Allowed Headers:** \*, including `Authorization`, `Content-Type`

---

## API Documentation

### Interactive Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI Schema:** http://localhost:8000/openapi.json

### Auto-Generated

FastAPI automatically generates:

- API documentation with request/response examples
- Schema validation documentation
- Try-it-out functionality

---

## Versioning Strategy

### Current: v1

All endpoints: `/api/v1/*`

### Future Versions

- Breaking changes: `/api/v2/*`
- v1 maintained for 12 months after v2 release
- Deprecation warnings in response headers:
  ```
  Deprecation: true
  Sunset: 2027-02-09T00:00:00Z
  Link: </api/v2/projects>; rel="successor-version"
  ```

---

## Development Guidelines

### Adding New Endpoints

1. Create Pydantic schema in `src/schemas/`
2. Implement router in `src/routers/`
3. Add business logic in `src/services/` (if complex)
4. Include router in `src/main.py`
5. Update this documentation

### Example Router

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.schemas.project import ProjectResponse
from src.models import Project

router = APIRouter()

@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects
```

---

## Testing

### Test Endpoints

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Database health
curl http://localhost:8000/api/v1/health/db

# System status
curl http://localhost:8000/api/v1/status

# With authentication (future)
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/v1/projects
```

---

## Version History

| Version | Date       | Changes                          |
| ------- | ---------- | -------------------------------- |
| 1.0     | 2026-02-09 | Initial API design documentation |

---

**Document Status:** Final v1.0  
**Last Updated:** February 9, 2026  
**Maintained By:** ONEKA Backend Team
