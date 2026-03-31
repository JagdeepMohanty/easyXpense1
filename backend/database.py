import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger(__name__)

class DatabaseConnection:
    """Singleton database connection manager"""
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
        return cls._instance
    
    def connect(self):
        """Establish database connection"""
        if self._client is not None:
            return self._db
        
        try:
            mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
            self._client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            
            # Test connection
            self._client.admin.command('ping')
            self._db = self._client["easyxpense"]
            
            logger.info("Database connected successfully")
            return self._db
            
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            return None
    
    def get_db(self):
        """Get database instance"""
        if self._db is None:
            return self.connect()
        return self._db
    
    def close(self):
        """Close database connection"""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None

# Global database instance
db_connection = DatabaseConnection()

def get_database():
    """Get database connection"""
    return db_connection.get_db()