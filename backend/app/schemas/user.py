from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    surname: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(min_length=8, max_length=30)
    role: str = Field(min_length=2, max_length=50)
    town: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=4, max_length=255)
    store_id: int


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserRead(UserBase):
    id: int

    model_config = {"from_attributes": True}
