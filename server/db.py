"""
MongoDB Database Connection Module
Provides singleton connection to MongoDB Atlas
"""
import os
from datetime import datetime
from typing import Optional, Dict, Any, List
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Singleton connection
_client: Optional[MongoClient] = None
_db: Optional[Database] = None


def get_db() -> Optional[Database]:
    """Get MongoDB database connection (singleton)"""
    global _client, _db
    
    if _db is not None:
        return _db
    
    uri = os.getenv('MONGODB_URI')
    db_name = os.getenv('MONGODB_DB_NAME', 'portfolio')
    
    if not uri:
        print("Warning: MONGODB_URI not set, database features disabled")
        return None
    
    try:
        _client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Test connection
        _client.admin.command('ping')
        _db = _client[db_name]
        print(f"Connected to MongoDB: {db_name}")
        return _db
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None


def close_db():
    """Close MongoDB connection"""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None


def get_collection(name: str) -> Optional[Collection]:
    """Get a collection from the database"""
    db = get_db()
    if db is not None:
        return db[name]
    return None


# ============== Contact Messages ==============

def save_contact_message(data: Dict[str, Any]) -> Optional[str]:
    """Save contact form submission to database"""
    collection = get_collection('contacts')
    if collection is None:
        return None
    
    document = {
        'name': data.get('name'),
        'email': data.get('email'),
        'subject': data.get('subject'),
        'message': data.get('message'),
        'created_at': datetime.utcnow(),
        'read': False,
        'replied': False,
        'ip_address': data.get('ip_address'),
        'user_agent': data.get('user_agent'),
    }
    
    result = collection.insert_one(document)
    return str(result.inserted_id)


def get_contact_messages(limit: int = 50, skip: int = 0, unread_only: bool = False) -> List[Dict]:
    """Get contact messages with pagination"""
    collection = get_collection('contacts')
    if collection is None:
        return []
    
    query = {'read': False} if unread_only else {}
    
    cursor = collection.find(query).sort('created_at', -1).skip(skip).limit(limit)
    return list(cursor)


def mark_message_read(message_id: str) -> bool:
    """Mark a message as read"""
    from bson import ObjectId
    collection = get_collection('contacts')
    if collection is None:
        return False
    
    result = collection.update_one(
        {'_id': ObjectId(message_id)},
        {'$set': {'read': True, 'read_at': datetime.utcnow()}}
    )
    return result.modified_count > 0


def get_unread_count() -> int:
    """Get count of unread messages"""
    collection = get_collection('contacts')
    if collection is None:
        return 0
    return collection.count_documents({'read': False})


# ============== Analytics ==============

def log_page_view(data: Dict[str, Any]) -> Optional[str]:
    """Log a page view for analytics"""
    collection = get_collection('analytics')
    if collection is None:
        return None
    
    document = {
        'type': 'page_view',
        'page': data.get('page'),
        'path': data.get('path'),
        'referrer': data.get('referrer'),
        'user_agent': data.get('user_agent'),
        'ip_address': data.get('ip_address'),
        'timestamp': datetime.utcnow(),
    }
    
    result = collection.insert_one(document)
    return str(result.inserted_id)


def get_analytics_summary() -> Dict[str, Any]:
    """Get analytics summary"""
    collection = get_collection('analytics')
    contacts = get_collection('contacts')
    
    summary = {
        'total_page_views': 0,
        'total_messages': 0,
        'unread_messages': 0,
        'views_by_page': {},
    }
    
    if collection is not None:
        summary['total_page_views'] = collection.count_documents({'type': 'page_view'})
        
        # Views by page (last 30 days)
        pipeline = [
            {'$match': {'type': 'page_view'}},
            {'$group': {'_id': '$page', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 10}
        ]
        results = list(collection.aggregate(pipeline))
        summary['views_by_page'] = {r['_id']: r['count'] for r in results if r['_id']}
    
    if contacts is not None:
        summary['total_messages'] = contacts.count_documents({})
        summary['unread_messages'] = contacts.count_documents({'read': False})
    
    return summary


# ============== Database Info ==============

def is_connected() -> bool:
    """Check if database is connected"""
    global _client
    # Try to establish connection if not already done
    if _client is None:
        get_db()
    if _client is None:
        return False
    try:
        _client.admin.command('ping')
        return True
    except:
        return False


def get_db_stats() -> Dict[str, Any]:
    """Get database statistics"""
    db = get_db()
    if db is None:
        return {'connected': False}
    
    try:
        stats = db.command('dbstats')
        return {
            'connected': True,
            'database': db.name,
            'collections': db.list_collection_names(),
            'storage_size': stats.get('storageSize', 0),
            'data_size': stats.get('dataSize', 0),
        }
    except Exception as e:
        return {'connected': False, 'error': str(e)}
