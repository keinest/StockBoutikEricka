from pydantic import BaseModel, Field


class InventoryBase(BaseModel):
    quantity: int = Field(ge=0)
    alert_threshold: int = Field(ge=0, default=5)
    product_id: int
    store_id: int


class InventoryCreate(InventoryBase):
    pass


class InventoryRead(InventoryBase):
    id: int

    model_config = {"from_attributes": True}
