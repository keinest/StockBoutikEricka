from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserRead
from app.services.user_service import create_user, list_users


router = APIRouter()


@router.get("", response_model=list[UserRead])
def read_users(db: Session = Depends(get_db)) -> list[UserRead]:
    return list_users(db)


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    return create_user(db, payload)
