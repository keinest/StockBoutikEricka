from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.inventory import InventoryCreate, InventoryRead
from app.services.inventory_service import (
    create_inventory,
    list_inventory_alerts,
    list_inventories,
)


router = APIRouter()


@router.get("", response_model=list[InventoryRead])
def read_inventories(db: Session = Depends(get_db)) -> list[InventoryRead]:
    return list_inventories(db)


@router.get("/alertes", response_model=list[InventoryRead])
def read_inventory_alerts(db: Session = Depends(get_db)) -> list[InventoryRead]:
    return list_inventory_alerts(db)


@router.post("", response_model=InventoryRead, status_code=status.HTTP_201_CREATED)
def create_inventory_endpoint(
    payload: InventoryCreate,
    db: Session = Depends(get_db),
) -> InventoryRead:
    return create_inventory(db, payload)
