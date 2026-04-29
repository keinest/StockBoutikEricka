import os
from dataclasses import dataclass

from sqlalchemy.engine import URL


@dataclass(slots=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "StockBoutik")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    api_v1_prefix: str = os.getenv("API_V1_PREFIX", "/api/v1")
    mysql_user: str = os.getenv("MYSQL_USER", "ericka")
    mysql_password: str = os.getenv("MYSQL_PASSWORD", "Ericka12@3")
    mysql_host: str = os.getenv("MYSQL_HOST", "127.0.0.1")
    mysql_port: int = int(os.getenv("MYSQL_PORT", "3306"))
    mysql_db: str = os.getenv("MYSQL_DB", "stockboutik")
    database_echo: bool = os.getenv("DATABASE_ECHO", "false").lower() == "true"

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername="mysql+pymysql",
            username=self.mysql_user,
            password=self.mysql_password,
            host=self.mysql_host,
            port=self.mysql_port,
            database=self.mysql_db,
        )


settings = Settings()
