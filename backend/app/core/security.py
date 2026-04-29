import hashlib
import hmac
import os


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or os.urandom(16).hex()
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000,
    ).hex()
    return f"{salt}${password_hash}"


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        salt, current_hash = hashed_password.split("$", maxsplit=1)
    except ValueError:
        return False

    candidate = hash_password(password, salt).split("$", maxsplit=1)[1]
    return hmac.compare_digest(candidate, current_hash)
