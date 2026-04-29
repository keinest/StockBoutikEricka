from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductRead
from app.services.product_service import create_product, list_products


router = APIRouter()


@router.get("", response_model=list[ProductRead])
def read_products(db: Session = Depends(get_db)) -> list[ProductRead]:
    return list_products(db)


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(
    payload: ProductCreate,
    db: Session = Depends(get_db),
) -> ProductRead:
    return create_product(db, payload)
