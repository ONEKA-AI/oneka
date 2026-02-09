"""
Base model class for SQLAlchemy models with common functionality.
"""

from sqlalchemy import Column, DateTime, func
from src.database import Base  # Import Base from database.py


class TimestampMixin:
    """
    Mixin to add created_at and updated_at timestamps to models.
    """

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
