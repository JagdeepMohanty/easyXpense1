from config.config import Config

if not Config.JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is not set")

JWT_SECRET = Config.JWT_SECRET
