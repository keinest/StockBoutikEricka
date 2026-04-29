from datetime import datetime

from pydantic import BaseModel, Field


class SaleBase(BaseModel):
    quantity: int = Field(gt=0)
    customer_name: str | None = Field(default=None, max_length=150)
    product_id: int
    store_id: int
    user_id: int


class SaleCreate(SaleBase):
    pass


class SaleRead(SaleBase):
    id: int
    sold_at: datetime
    unit_price: float
    total_amount: float

    model_config = {"from_attributes": True}
