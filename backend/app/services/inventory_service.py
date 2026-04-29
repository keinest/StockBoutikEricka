from sqlalchemy.orm import Session

from app.models.Inventory import Inventory
from app.schemas.inventory import InventoryCreate


def list_inventories(db: Session) -> list[Inventory]:
    return db.query(Inventory).order_by(Inventory.id.desc()).all()


def list_inventory_alerts(db: Session) -> list[Inventory]:
    return db.query(Inventory).filter(Inventory.quantity <= Inventory.alert_threshold).all()


def create_inventory(db: Session, payload: InventoryCreate) -> Inventory:
    inventory = Inventory(**payload.model_dump())
    db.add(inventory)
    db.commit()
    db.refresh(inventory)
    return inventory
