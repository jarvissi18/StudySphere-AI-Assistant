from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


# ==========================================================
# User Model
# ==========================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    full_name = Column(
        String,
        nullable=False,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    password = Column(
        String,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    documents = relationship(
        "Document",
        back_populates="user",
        cascade="all, delete-orphan",
    )

   


# ==========================================================
# Document Model
# ==========================================================

class Document(Base):
    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    filename = Column(
        String,
        nullable=False,
    )

    filepath = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        nullable=False,
        default="ready",
    )

    processing_error = Column(
        Text,
        nullable=True,
    )

    processed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="documents",
    )
