from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int]                   = mapped_column(primary_key = True, index = True)
    sold_at: Mapped[datetime]         = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    quantity: Mapped[int]             = mapped_column(nullable=False)
    unit_price: Mapped[float]         = mapped_column(Numeric(10, 2), nullable=False)
    total_amount: Mapped[float]       = mapped_column(Numeric(10, 2), nullable=False)
    customer_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    product_id: Mapped[int]           = mapped_column(ForeignKey("products.id"), nullable=False)
    store_id: Mapped[int]             = mapped_column(ForeignKey("stores.id"), nullable=False)
    user_id: Mapped[int]              = mapped_column(ForeignKey("users.id"), nullable=False)
    product: Mapped["Product"]        = relationship(back_populates="sales")
    store: Mapped["Store"]            = relationship(back_populates="sales")
    user: Mapped["User"]              = relationship(back_populates="sales")
