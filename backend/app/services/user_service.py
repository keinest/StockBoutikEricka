from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.User import User
from app.schemas.user import UserCreate


def list_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.name.asc(), User.surname.asc()).all()


def create_user(db: Session, payload: UserCreate) -> User:
    user_data = payload.model_dump(exclude={"password"})
    user = User(**user_data, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
