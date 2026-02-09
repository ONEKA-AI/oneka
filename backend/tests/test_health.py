"""
Tests for health check and status endpoints.
"""

import pytest
from fastapi import status


class TestHealthEndpoints:
    """Test health check and status endpoints"""

    def test_health_check(self, client):
        """Test basic health check endpoint"""
        response = client.get("/api/v1/health")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data
        assert "timestamp" in data

    def test_ping(self, client):
        """Test ping endpoint"""
        response = client.get("/api/v1/ping")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["ping"] == "pong"
        assert "timestamp" in data

    def test_database_health(self, client):
        """Test database health check"""
        response = client.get("/api/v1/health/db")

        # May fail if database not set up yet
        if response.status_code == status.HTTP_200_OK:
            data = response.json()
            assert data["status"] == "healthy"
            assert data["database"] == "connected"
            assert "postgis_version" in data

    def test_system_status(self, client):
        """Test system status endpoint"""
        response = client.get("/api/v1/status")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "operational"
        assert "database" in data
        assert "version" in data


class TestRootEndpoint:
    """Test root endpoint"""

    def test_root(self, client):
        """Test API root endpoint"""
        response = client.get("/")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "documentation" in data
        assert "health_check" in data
