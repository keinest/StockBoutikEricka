from fastapi import APIRouter

from app.api.routes import auth, inventories, products, sales, stores, users


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/utilisateurs", tags=["utilisateurs"])
api_router.include_router(products.router, prefix="/produits", tags=["produits"])
api_router.include_router(sales.router, prefix="/ventes", tags=["ventes"])
api_router.include_router(inventories.router, prefix="/stocks", tags=["stocks"])
api_router.include_router(stores.router, prefix="/boutiques", tags=["boutiques"])
