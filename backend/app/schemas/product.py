from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    category: str = Field(min_length=2, max_length=100)
    description: str | None = None
    sku: str | None = Field(default=None, max_length=80)
    purchase_price: float = Field(gt=0)
    sale_price: float = Field(gt=0)
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int

    model_config = {"from_attributes": True}
