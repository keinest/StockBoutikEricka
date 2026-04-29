from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.sale import SaleCreate, SaleRead
from app.services.sale_service import create_sale, list_sales


router = APIRouter()


@router.get("", response_model=list[SaleRead])
def read_sales(db: Session = Depends(get_db)) -> list[SaleRead]:
    return list_sales(db)


@router.post("", response_model=SaleRead, status_code=status.HTTP_201_CREATED)
def create_sale_endpoint(payload: SaleCreate, db: Session = Depends(get_db)) -> SaleRead:
    return create_sale(db, payload)
