from sqlalchemy.orm import Session

from app.models.Store import Store
from app.schemas.store import StoreCreate


def list_stores(db: Session) -> list[Store]:
    return db.query(Store).order_by(Store.name.asc()).all()


def create_store(db: Session, payload: StoreCreate) -> Store:
    store = Store(**payload.model_dump())
    db.add(store)
    db.commit()
    db.refresh(store)
    return store
