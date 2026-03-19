import os


def env(key: str, default: str | None = None) -> str | None:
    return os.getenv(key, default)
