from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.Store import Store
from app.models.User import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest


def register_user(db: Session, payload: RegisterRequest) -> AuthResponse:
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )

    store = Store(
        name=payload.store_name,
        town=payload.town,
        address=payload.address,
        status=payload.store_status,
    )
    db.add(store)
    db.flush()

    user = User(
        name=payload.name,
        surname=payload.surname,
        email=payload.email,
        phone_number=payload.phone_number,
        role=payload.role,
        town=payload.town,
        address=payload.address,
        password_hash=hash_password(payload.password),
        store_id=store.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return AuthResponse(
        message="Registration completed successfully.",
        user_id=user.id,
        store_id=store.id,
    )


def login_user(db: Session, payload: LoginRequest) -> AuthResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    return AuthResponse(
        message="Login successful.",
        user_id=user.id,
        store_id=user.store_id,
    )
