from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.database import Base, engine
from app.core.config import settings
from app.models import Inventory, Product, Sale, Store, User


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)

frontend_dir = Path(__file__).resolve().parents[2] / "frontend"
public_dir = Path(__file__).resolve().parents[2] / "public"
static_root = public_dir if public_dir.exists() else frontend_dir

for section in ("pages", "styles", "scripts"):
    section_dir = static_root / section
    if section_dir.exists():
        app.mount(f"/{section}", StaticFiles(directory=section_dir), name=section)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["health"])
def root() -> RedirectResponse:
    return RedirectResponse(url="/pages/index.html")


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
