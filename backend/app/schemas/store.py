from pydantic import BaseModel, Field


class StoreBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    town: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=4, max_length=255)
    status: str = Field(default="active", min_length=2, max_length=50)


class StoreCreate(StoreBase):
    pass


class StoreRead(StoreBase):
    id: int

    model_config = {"from_attributes": True}
