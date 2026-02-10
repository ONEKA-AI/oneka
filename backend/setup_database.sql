-- ONEKA Database Setup Script
-- This script creates the required databases, user, and enables PostGIS

-- Create user (ignore error if exists)
-- Update the password as needed for security
CREATE USER oneka_user WITH PASSWORD 'password';

-- Create development database
CREATE DATABASE oneka_dev OWNER oneka_user;

-- Create test database
CREATE DATABASE oneka_test OWNER oneka_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE oneka_dev TO oneka_user;
GRANT ALL PRIVILEGES ON DATABASE oneka_test TO oneka_user;

-- Connect to oneka_dev and enable PostGIS
\c oneka_dev
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO oneka_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO oneka_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO oneka_user;

-- Connect to oneka_test and enable PostGIS
\c oneka_test
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO oneka_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO oneka_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO oneka_user;

-- Verify PostGIS installation
\c oneka_dev
SELECT PostGIS_version();
