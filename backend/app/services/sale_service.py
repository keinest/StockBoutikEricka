from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.Product import Product
from app.models.Sale import Sale
from app.schemas.sale import SaleCreate


def list_sales(db: Session) -> list[Sale]:
    return db.query(Sale).order_by(Sale.sold_at.desc()).all()


def create_sale(db: Session, payload: SaleCreate) -> Sale:
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    unit_price = float(product.sale_price)
    total_amount = unit_price * payload.quantity

    sale = Sale(
        **payload.model_dump(),
        unit_price=unit_price,
        total_amount=total_amount,
    )
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale
