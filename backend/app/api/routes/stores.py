from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.store import StoreCreate, StoreRead
from app.services.store_service import create_store, list_stores


router = APIRouter()


@router.get("", response_model=list[StoreRead])
def read_stores(db: Session = Depends(get_db)) -> list[StoreRead]:
    return list_stores(db)


@router.post("", response_model=StoreRead, status_code=status.HTTP_201_CREATED)
def create_store_endpoint(payload: StoreCreate, db: Session = Depends(get_db)) -> StoreRead:
    return create_store(db, payload)
