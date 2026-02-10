"""
Geolocation Record model - GPS coordinates with PostGIS spatial types.
"""

from sqlalchemy import Column, String, Integer, DECIMAL, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

from src.models.base import Base, TimestampMixin


class GeolocationRecord(Base, TimestampMixin):
    """
    Geolocation records with GPS coordinates and PostGIS geometry.

    Links projects to physical locations using fuzzy matching against
    facility registries (KMHFL, MOE, etc.) or manual geocoding.
    """

    __tablename__ = "geolocation_records"

    # Primary Key
    geolocation_id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign Key to Project
    project_uuid = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.project_uuid", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to parent project",
    )

    # Source Information
    source_system = Column(
        String(50),
        nullable=True,
        comment="Source: 'KMHFL', 'MOE', 'IEBC_Ward', 'Manual', 'OSM'",
    )

    facility_code = Column(
        String(50),
        nullable=True,
        comment="External facility code (e.g., KMHFL facility ID)",
    )

    facility_name = Column(
        String, nullable=True, comment="Name of matched facility from registry"
    )

    # Coordinates
    latitude = Column(
        DECIMAL(10, 7), nullable=False, comment="Latitude in decimal degrees (WGS84)"
    )

    longitude = Column(
        DECIMAL(10, 7), nullable=False, comment="Longitude in decimal degrees (WGS84)"
    )

    # PostGIS Spatial Column
    geom = Column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=True,
        comment="PostGIS Point geometry for spatial queries (SRID 4326 = WGS84)",
    )

    # Matching Quality
    match_confidence = Column(
        Integer, nullable=True, comment="Fuzzy match confidence score 0-100"
    )

    match_method = Column(
        String(50),
        nullable=True,
        comment="Method: 'exact', 'fuzzy', 'ward_fallback', 'manual', 'geocoding'",
    )

    match_score = Column(
        Integer, nullable=True, comment="Algorithm-specific match score"
    )

    # Verification
    verified = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether location has been manually verified",
    )

    verified_by = Column(
        String(100), nullable=True, comment="User who verified location"
    )

    verified_at = Column(
        DateTime(timezone=True), nullable=True, comment="Timestamp of verification"
    )

    # Address Information
    address = Column(String, nullable=True, comment="Text address if available")

    # Relationship
    project = relationship("Project", back_populates="geolocation_records")

    def __repr__(self):
        return f"<GeolocationRecord(lat={self.latitude}, lon={self.longitude}, source={self.source_system})>"

    def set_geom_from_coordinates(self):
        """
        Set PostGIS geometry from latitude and longitude.
        Call this after setting lat/lon to populate the geom column.
        """
        if self.latitude and self.longitude:
            # WKT (Well-Known Text) format for PostGIS
            # SRID=4326 is WGS84 (standard GPS coordinate system)
            from geoalchemy2.shape import from_shape
            from shapely.geometry import Point

            point = Point(float(self.longitude), float(self.latitude))
            self.geom = from_shape(point, srid=4326)
