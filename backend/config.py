import os
import logging

logger = logging.getLogger(__name__)

class Config:
    """Application configuration with safe defaults"""
    
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
    
    # JWT Configuration
    JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret-key-change-in-production')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', JWT_SECRET)
    
    # Server Configuration
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '0.0.0.0')
    
    # Environment
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV != 'production'
    
    # CORS Origins
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://easyxpense.netlify.app'
    ]
    
    @classmethod
    def validate(cls):
        """Validate critical configuration"""
        warnings = []
        
        if cls.JWT_SECRET == 'dev-secret-key-change-in-production':
            warnings.append("Using default JWT secret - change in production!")
        
        if not cls.MONGO_URI or cls.MONGO_URI == 'mongodb://localhost:27017':
            if cls.FLASK_ENV == 'production':
                warnings.append("Using localhost MongoDB in production!")
        
        for warning in warnings:
            logger.warning(f"⚠️ Config Warning: {warning}")
        
        return len(warnings) == 0
    
    @classmethod
    def log_config(cls):
        """Log current configuration (safe for production)"""
        logger.info("📋 Application Configuration:")
        logger.info(f"  Environment: {cls.FLASK_ENV}")
        logger.info(f"  Debug Mode: {cls.DEBUG}")
        logger.info(f"  Port: {cls.PORT}")
        logger.info(f"  MongoDB: {'Connected' if cls.MONGO_URI else 'Not configured'}")
        logger.info(f"  JWT: {'Configured' if cls.JWT_SECRET else 'Not configured'}")

# Initialize and validate configuration
config = Config()
config.validate()

if __name__ == '__main__':
    config.log_config()