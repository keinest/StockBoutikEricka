from sqlalchemy.orm import Session

from app.models.Product import Product
from app.schemas.product import ProductCreate


def list_products(db: Session) -> list[Product]:
    return db.query(Product).order_by(Product.name.asc()).all()


def create_product(db: Session, payload: ProductCreate) -> Product:
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
