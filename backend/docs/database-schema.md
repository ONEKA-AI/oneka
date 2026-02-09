# ONEKA AI Database Schema

**Version:** 1.0  
**Date:** February 9, 2026  
**Database:** PostgreSQL 15 with PostGIS Extension

---

## Overview

The ONEKA AI database implements an interoperability architecture that links procurement data, financial records, geolocation information, and satellite analyses through a universal `project_uuid` identifier.

## Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECTS (Master)                        │
│  project_uuid (PK) | project_name | type | county | risk_level  │
└─────────────────────────────────────────────────────────────────┘
              │
              ├──────────────┬──────────────┬──────────────┐
              │              │              │              │
              ▼              ▼              ▼              ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PROCUREMENT      │ │ FINANCIAL    │ │ GEOLOCATION  │ │ SATELLITE    │
│ RECORDS          │ │ RECORDS      │ │ RECORDS      │ │ ANALYSES     │
│                  │ │              │ │              │ │              │
│ tender_number    │ │ vote_head    │ │ latitude     │ │ sensor       │
│ contractor_name  │ │ ministry     │ │ longitude    │ │ ndvi_mean    │
│ contract_sum_kes │ │ absorbed_kes │ │ geom (PostGIS)│ │ sar_vv_mean  │
└──────────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Core Tables

### 1. projects

**Purpose:** Master registry linking all project data through universal UUID

**Columns:**

| Column                | Type          | Constraints     | Description                                     |
| --------------------- | ------------- | --------------- | ----------------------------------------------- |
| `project_uuid`        | UUID          | PK, NOT NULL    | Universal unique identifier                     |
| `project_name`        | VARCHAR       | NOT NULL, INDEX | Official project name                           |
| `project_type`        | ENUM          | INDEX           | health, education, roads, water, markets, other |
| `county`              | VARCHAR(50)   | INDEX           | County location                                 |
| `constituency`        | VARCHAR(100)  |                 | Constituency within county                      |
| `ward`                | VARCHAR(100)  |                 | Ward within constituency                        |
| `estimated_value_kes` | DECIMAL(15,2) |                 | Contract value in Kenya Shillings               |
| `status`              | ENUM          | NOT NULL, INDEX | awarded, ongoing, completed, abandoned, stalled |
| `risk_level`          | ENUM          | INDEX           | LOW, MEDIUM, HIGH, CRITICAL                     |
| `risk_score`          | INTEGER       |                 | ML prediction score 0-100                       |
| `confidence_score`    | INTEGER       |                 | Data quality score 0-100                        |
| `geolocation_status`  | VARCHAR(50)   | NOT NULL        | geolocated, not_geolocated, failed              |
| `created_at`          | TIMESTAMP     | NOT NULL        | Creation timestamp                              |
| `updated_at`          | TIMESTAMP     | NOT NULL        | Last update timestamp                           |

**Indexes:**

- Primary: `project_uuid`
- Secondary: `project_name`, `project_type`, `county`, `status`, `risk_level`

**Relationships:**

- One-to-Many: `procurement_records`
- One-to-Many: `financial_records`
- One-to-Many: `geolocation_records`
- One-to-Many: `satellite_analyses`

---

### 2. procurement_records

**Purpose:** Store tender awards and contract data from PPIP and other sources

**Columns:**

| Column                     | Type          | Constraints             | Description                    |
| -------------------------- | ------------- | ----------------------- | ------------------------------ |
| `procurement_id`           | SERIAL        | PK                      | Auto-increment ID              |
| `project_uuid`             | UUID          | FK, NOT NULL, INDEX     | Reference to projects table    |
| `source_system`            | VARCHAR(50)   | NOT NULL                | PPIP, eGP, KeNHA, KURA         |
| `tender_number`            | VARCHAR       | UNIQUE, NOT NULL, INDEX | Unique tender identifier       |
| `tender_title`             | VARCHAR       |                         | Official tender title          |
| `procuring_entity`         | VARCHAR       | INDEX                   | Ministry/department/agency     |
| `contract_sum_kes`         | DECIMAL(15,2) |                         | Contract award amount          |
| `award_date`               | DATE          | INDEX                   | Date contract was awarded      |
| `expected_completion_date` | DATE          |                         | Expected completion date       |
| `contract_duration_months` | INTEGER       |                         | Contract duration              |
| `contractor_name`          | VARCHAR       | INDEX                   | Awarded contractor name        |
| `contractor_pin`           | VARCHAR(20)   |                         | Contractor PIN                 |
| `contractor_nca_license`   | VARCHAR(50)   |                         | NCA license number             |
| `document_url`             | VARCHAR       |                         | URL to tender PDF              |
| `document_s3_key`          | VARCHAR       |                         | S3 storage key                 |
| `raw_ocr_text`             | TEXT          |                         | Full extracted text for search |
| `data_quality`             | INTEGER       |                         | OCR quality score 0-100        |
| `extraction_method`        | VARCHAR(50)   |                         | api, scraping, ocr, manual     |
| `created_at`               | TIMESTAMP     | NOT NULL                | Creation timestamp             |
| `updated_at`               | TIMESTAMP     | NOT NULL                | Last update timestamp          |

**Indexes:**

- Primary: `procurement_id`
- Secondary: `project_uuid`, `tender_number`, `procuring_entity`, `contractor_name`, `award_date`
- Unique: `tender_number`

**Foreign Keys:**

- `project_uuid` → `projects.project_uuid` (CASCADE DELETE)

---

### 3. geolocation_records

**Purpose:** Store GPS coordinates with PostGIS spatial types for location-based queries

**Columns:**

| Column             | Type                  | Constraints             | Description                         |
| ------------------ | --------------------- | ----------------------- | ----------------------------------- |
| `geolocation_id`   | SERIAL                | PK                      | Auto-increment ID                   |
| `project_uuid`     | UUID                  | FK, NOT NULL, INDEX     | Reference to projects table         |
| `source_system`    | VARCHAR(50)           |                         | KMHFL, MOE, IEBC_Ward, Manual, OSM  |
| `facility_code`    | VARCHAR(50)           |                         | External facility ID                |
| `facility_name`    | VARCHAR               |                         | Matched facility name               |
| `latitude`         | DECIMAL(10,7)         | NOT NULL                | Latitude WGS84                      |
| `longitude`        | DECIMAL(10,7)         | NOT NULL                | Longitude WGS84                     |
| `geom`             | GEOMETRY(POINT, 4326) |                         | PostGIS Point geometry              |
| `match_confidence` | INTEGER               |                         | Fuzzy match score 0-100             |
| `match_method`     | VARCHAR(50)           |                         | exact, fuzzy, ward_fallback, manual |
| `match_score`      | INTEGER               |                         | Algorithm-specific score            |
| `verified`         | BOOLEAN               | NOT NULL, DEFAULT FALSE | Manual verification flag            |
| `verified_by`      | VARCHAR(100)          |                         | User who verified                   |
| `verified_at`      | TIMESTAMP             |                         | Verification timestamp              |
| `address`          | VARCHAR               |                         | Text address                        |
| `created_at`       | TIMESTAMP             | NOT NULL                | Creation timestamp                  |
| `updated_at`       | TIMESTAMP             | NOT NULL                | Last update timestamp               |

**Spatial Index:**

- GIST: `geom` (for spatial queries like ST_Distance, ST_DWithin)

**Common Spatial Queries:**

```sql
-- Find projects within 1km radius
SELECT * FROM geolocation_records
WHERE ST_DWithin(
    geom::geography,
    ST_MakePoint(36.8219, -1.2921)::geography,
    1000  -- meters
);

-- Calculate distance between two projects
SELECT ST_Distance(
    g1.geom::geography,
    g2.geom::geography
) / 1000 AS distance_km
FROM geolocation_records g1, geolocation_records g2
WHERE g1.project_uuid = 'uuid1' AND g2.project_uuid = 'uuid2';
```

**Foreign Keys:**

- `project_uuid` → `projects.project_uuid` (CASCADE DELETE)

---

### 4. financial_records

**Purpose:** Store budget allocation and disbursement data from COB, Treasury, IFMIS

**Columns:**

| Column                 | Type          | Constraints         | Description                  |
| ---------------------- | ------------- | ------------------- | ---------------------------- |
| `financial_id`         | SERIAL        | PK                  | Auto-increment ID            |
| `project_uuid`         | UUID          | FK, NOT NULL, INDEX | Reference to projects table  |
| `source_system`        | VARCHAR(50)   | NOT NULL            | COB, Treasury, IFMIS, County |
| `fiscal_year`          | VARCHAR(10)   | INDEX               | e.g., '2023/2024'            |
| `vote_head`            | INTEGER       | INDEX               | Government vote head number  |
| `sub_vote`             | INTEGER       |                     | Sub-vote number              |
| `ministry`             | VARCHAR       | INDEX               | Ministry name                |
| `department`           | VARCHAR       |                     | Department name              |
| `programme`            | VARCHAR       |                     | Budget programme             |
| `budget_allocated_kes` | DECIMAL(15,2) |                     | Total allocated              |
| `budget_released_kes`  | DECIMAL(15,2) |                     | Amount released              |
| `budget_absorbed_kes`  | DECIMAL(15,2) |                     | Amount spent                 |
| `absorption_rate`      | DECIMAL(5,2)  |                     | Percentage 0-100             |
| `reporting_period`     | VARCHAR(20)   | INDEX               | Q1 2024, FY 2023/24          |
| `period_start_date`    | DATE          |                     | Period start                 |
| `period_end_date`      | DATE          |                     | Period end                   |
| `document_source`      | VARCHAR       |                     | Source document URL          |
| `match_method`         | VARCHAR(50)   |                     | direct, inference, manual    |
| `confidence_score`     | INTEGER       |                     | Link confidence 0-100        |
| `created_at`           | TIMESTAMP     | NOT NULL            | Creation timestamp           |
| `updated_at`           | TIMESTAMP     | NOT NULL            | Last update timestamp        |

**Indexes:**

- Primary: `financial_id`
- Secondary: `project_uuid`, `fiscal_year`, `vote_head`, `ministry`, `reporting_period`

**Foreign Keys:**

- `project_uuid` → `projects.project_uuid` (CASCADE DELETE)

---

### 5. satellite_analyses

**Purpose:** Store satellite metrics (NDVI, SAR) and ML predictions

**Columns:**

| Column                   | Type          | Constraints             | Description                       |
| ------------------------ | ------------- | ----------------------- | --------------------------------- |
| `analysis_id`            | SERIAL        | PK                      | Auto-increment ID                 |
| `project_uuid`           | UUID          | FK, NOT NULL, INDEX     | Reference to projects table       |
| `sensor`                 | VARCHAR(20)   | NOT NULL                | Sentinel-1, Sentinel-2, SkySat    |
| `acquisition_date`       | DATE          | NOT NULL, INDEX         | Image capture date                |
| `scene_id`               | VARCHAR       |                         | Satellite scene ID                |
| `cloud_cover_percentage` | INTEGER       |                         | Cloud cover 0-100                 |
| `analysis_type`          | VARCHAR(50)   | NOT NULL                | NDVI_change, SAR_backscatter, etc |
| `baseline_value`         | DECIMAL(10,4) |                         | Pre-construction baseline         |
| `current_value`          | DECIMAL(10,4) |                         | Current metric value              |
| `change_magnitude`       | DECIMAL(10,4) |                         | Change detected                   |
| `change_detected`        | BOOLEAN       | NOT NULL, DEFAULT FALSE | Significant change flag           |
| `ndvi_mean`              | DECIMAL(6,4)  |                         | Mean NDVI (-1 to 1)               |
| `ndvi_std`               | DECIMAL(6,4)  |                         | NDVI standard deviation           |
| `ndvi_min`               | DECIMAL(6,4)  |                         | Minimum NDVI                      |
| `ndvi_max`               | DECIMAL(6,4)  |                         | Maximum NDVI                      |
| `sar_vv_mean`            | DECIMAL(8,4)  |                         | VV backscatter (dB)               |
| `sar_vh_mean`            | DECIMAL(8,4)  |                         | VH backscatter (dB)               |
| `interpretation`         | TEXT          |                         | Human-readable analysis           |
| `construction_phase`     | VARCHAR(50)   |                         | Detected phase                    |
| `image_url`              | VARCHAR       |                         | URL to GeoTIFF                    |
| `thumbnail_url`          | VARCHAR       |                         | Preview image URL                 |
| `tile_url_template`      | VARCHAR       |                         | XYZ tile template                 |
| `processing_algorithm`   | VARCHAR(50)   |                         | satpy, pyrosar, snap              |
| `processing_date`        | DATE          |                         | Analysis date                     |
| `created_at`             | TIMESTAMP     | NOT NULL                | Creation timestamp                |
| `updated_at`             | TIMESTAMP     | NOT NULL                | Last update timestamp             |

**Indexes:**

- Primary: `analysis_id`
- Secondary: `project_uuid`, `acquisition_date`

**Foreign Keys:**

- `project_uuid` → `projects.project_uuid` (CASCADE DELETE)

---

## Database Setup

### Prerequisites

```bash
# Install PostgreSQL 15 and PostGIS
sudo apt install postgresql-15 postgresql-15-postgis-3
```

### Create Database

```sql
-- Create database
CREATE DATABASE oneka_dev;
CREATE DATABASE oneka_test;

-- Create user
CREATE USER oneka_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE oneka_dev TO oneka_user;
GRANT ALL PRIVILEGES ON DATABASE oneka_test TO oneka_user;

-- Connect and enable PostGIS
\c oneka_dev
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

-- Verify PostGIS
SELECT PostGIS_version();
```

### Connection String

```
postgresql://oneka_user:password@localhost:5432/oneka_dev
```

---

## Sample Queries

### Find Projects by Risk Level

```sql
SELECT
    p.project_uuid,
    p.project_name,
    p.risk_level,
    p.risk_score,
    pr.contractor_name,
    pr.contract_sum_kes
FROM projects p
LEFT JOIN procurement_records pr ON p.project_uuid = pr.project_uuid
WHERE p.risk_level IN ('HIGH', 'CRITICAL')
ORDER BY p.risk_score DESC
LIMIT 10;
```

### Projects with Geolocation Data

```sql
SELECT
    p.project_name,
    p.county,
    g.latitude,
    g.longitude,
    g.match_confidence,
    g.verified
FROM projects p
INNER JOIN geolocation_records g ON p.project_uuid = g.project_uuid
WHERE g.verified = true
ORDER BY g.match_confidence DESC;
```

### Financial vs Physical Progress Gap

```sql
SELECT
    p.project_name,
    f.budget_absorbed_kes,
    f.absorption_rate,
    s.ndvi_mean,
    s.change_detected,
    p.risk_score
FROM projects p
LEFT JOIN financial_records f ON p.project_uuid = f.project_uuid
LEFT JOIN satellite_analyses s ON p.project_uuid = s.project_uuid
WHERE f.absorption_rate > 50 AND s.change_detected = false
ORDER BY p.risk_score DESC;
```

### Spatial Query - Projects Near Location

```sql
-- Find projects within 5km of Nairobi city center
SELECT
    p.project_name,
    p.county,
    ST_Distance(g.geom::geography, ST_MakePoint(36.8219, -1.2921)::geography) / 1000 AS distance_km
FROM projects p
INNER JOIN geolocation_records g ON p.project_uuid = g.project_uuid
WHERE ST_DWithin(
    g.geom::geography,
    ST_MakePoint(36.8219, -1.2921)::geography,
    5000
)
ORDER BY distance_km;
```

---

## Maintenance

### Backup Database

```bash
pg_dump -U oneka_user -d oneka_dev -F c -f oneka_backup_$(date +%Y%m%d).dump
```

### Restore Database

```bash
pg_restore -U oneka_user -d oneka_dev oneka_backup_20260209.dump
```

### Vacuum and Analyze

```sql
VACUUM ANALYZE;
```

---

## Version History

| Version | Date       | Changes               |
| ------- | ---------- | --------------------- |
| 1.0     | 2026-02-09 | Initial schema design |

---

**Document Status:** Final v1.0  
**Last Updated:** February 9, 2026  
**Maintained By:** ONEKA Backend Team
