from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    surname: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(min_length=8, max_length=30)
    role: str = Field(default="admin", min_length=2, max_length=50)
    town: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=4, max_length=255)
    password: str = Field(min_length=6, max_length=128)
    store_name: str = Field(min_length=2, max_length=150)
    store_status: str = Field(default="active", min_length=2, max_length=50)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class AuthResponse(BaseModel):
    message: str
    user_id: int
    store_id: int
