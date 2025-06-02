import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from .config import settings
import logging

logger = logging.getLogger(__name__)

def get_db_connection():
    os.makedirs(os.path.dirname(settings.database_path), exist_ok=True)
    conn = sqlite3.connect(settings.database_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tool_executions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                tool_name TEXT NOT NULL,
                input_data TEXT,
                output_data TEXT,
                execution_time REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN DEFAULT TRUE
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_logs (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                user_query TEXT NOT NULL,
                final_response TEXT NOT NULL,
                tools_used TEXT,
                modal_actions TEXT,
                suggestions TEXT,
                response_time REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_ip TEXT,
                user_agent TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_conversations_session 
            ON conversations(session_id)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_tool_executions_session 
            ON tool_executions(session_id)
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_chat_logs_session 
            ON chat_logs(session_id)
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp 
            ON chat_logs(timestamp)
        ''')
        
        conn.commit()
        logger.info("database tables created successfully")
        
    except Exception as e:
        logger.error(f"failed to initialize database: {e}")
        raise
    finally:
        conn.close()

class ConversationManager:
    @staticmethod
    def save_message(session_id: str, message_id: str, role: str, content: str, metadata: Optional[Dict] = None):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            metadata_json = json.dumps(metadata) if metadata else None
            
            cursor.execute('''
                INSERT INTO conversations (session_id, message_id, role, content, metadata)
                VALUES (?, ?, ?, ?, ?)
            ''', (session_id, message_id, role, content, metadata_json))
            
            conn.commit()
            logger.debug(f"saved message {message_id} for session {session_id}")
            
        except Exception as e:
            logger.error(f"failed to save message: {e}")
            raise
        finally:
            conn.close()
    
    @staticmethod
    def get_conversation_history(session_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT message_id, role, content, timestamp, metadata
                FROM conversations
                WHERE session_id = ?
                ORDER BY timestamp ASC
                LIMIT ?
            ''', (session_id, limit))
            
            rows = cursor.fetchall()
            messages = []
            
            for row in rows:
                metadata = json.loads(row['metadata']) if row['metadata'] else {}
                messages.append({
                    'id': row['message_id'],
                    'role': row['role'],
                    'content': row['content'],
                    'timestamp': datetime.fromisoformat(row['timestamp']),
                    'metadata': metadata
                })
            
            return messages
            
        except Exception as e:
            logger.error(f"failed to get conversation history: {e}")
            return []
        finally:
            conn.close()
    
    @staticmethod
    def clear_conversation(session_id: str):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM conversations WHERE session_id = ?', (session_id,))
            cursor.execute('DELETE FROM tool_executions WHERE session_id = ?', (session_id,))
            conn.commit()
            logger.info(f"cleared conversation for session {session_id}")
            
        except Exception as e:
            logger.error(f"failed to clear conversation: {e}")
            raise
        finally:
            conn.close()

class ToolExecutionManager:
    @staticmethod
    def log_execution(session_id: str, tool_name: str, input_data: Any, output_data: Any, 
                     execution_time: float, success: bool = True):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO tool_executions 
                (session_id, tool_name, input_data, output_data, execution_time, success)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                session_id, 
                tool_name, 
                json.dumps(input_data) if input_data else None,
                json.dumps(output_data) if output_data else None,
                execution_time,
                success
            ))
            
            conn.commit()
            logger.debug(f"logged tool execution: {tool_name} for session {session_id}")
            
        except Exception as e:
            logger.error(f"failed to log tool execution: {e}")
        finally:
            conn.close()
    
    @staticmethod
    def get_tool_analytics(session_id: Optional[str] = None, tool_name: Optional[str] = None) -> List[Dict]:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            query = 'SELECT * FROM tool_executions WHERE 1=1'
            params = []
            
            if session_id:
                query += ' AND session_id = ?'
                params.append(session_id)
                
            if tool_name:
                query += ' AND tool_name = ?'
                params.append(tool_name)
                
            query += ' ORDER BY timestamp DESC'
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [dict(row) for row in rows]
            
        except Exception as e:
            logger.error(f"failed to get tool analytics: {e}")
            return []
        finally:
            conn.close()

class ChatLogManager:
    @staticmethod
    def save_chat_log(log_id: str, session_id: str, user_query: str, final_response: str,
                     tools_used: List[Dict] = None, modal_actions: List[Dict] = None,
                     suggestions: List[str] = None, response_time: float = 0.0,
                     user_ip: str = None, user_agent: str = None):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO chat_logs 
                (id, session_id, user_query, final_response, tools_used, modal_actions, 
                 suggestions, response_time, user_ip, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                log_id,
                session_id,
                user_query,
                final_response,
                json.dumps(tools_used) if tools_used else None,
                json.dumps(modal_actions) if modal_actions else None,
                json.dumps(suggestions) if suggestions else None,
                response_time,
                user_ip,
                user_agent
            ))
            
            conn.commit()
            logger.info(f"saved chat log {log_id} for session {session_id}")
            
        except Exception as e:
            logger.error(f"failed to save chat log: {e}")
            raise
        finally:
            conn.close()
    
    @staticmethod
    def get_chat_logs(session_id: str = None, limit: int = 100) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            if session_id:
                cursor.execute('''
                    SELECT * FROM chat_logs
                    WHERE session_id = ?
                    ORDER BY timestamp DESC
                    LIMIT ?
                ''', (session_id, limit))
            else:
                cursor.execute('''
                    SELECT * FROM chat_logs
                    ORDER BY timestamp DESC
                    LIMIT ?
                ''', (limit,))
            
            rows = cursor.fetchall()
            logs = []
            
            for row in rows:
                logs.append({
                    'id': row['id'],
                    'session_id': row['session_id'],
                    'user_query': row['user_query'],
                    'final_response': row['final_response'],
                    'tools_used': json.loads(row['tools_used']) if row['tools_used'] else [],
                    'modal_actions': json.loads(row['modal_actions']) if row['modal_actions'] else [],
                    'suggestions': json.loads(row['suggestions']) if row['suggestions'] else [],
                    'response_time': row['response_time'],
                    'timestamp': datetime.fromisoformat(row['timestamp']),
                    'user_ip': row['user_ip'],
                    'user_agent': row['user_agent']
                })
            
            return logs
            
        except Exception as e:
            logger.error(f"failed to get chat logs: {e}")
            return []
        finally:
            conn.close()
    
    @staticmethod
    def get_chat_analytics(days: int = 30) -> Dict[str, Any]:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT 
                    COUNT(*) as total_queries,
                    AVG(response_time) as avg_response_time,
                    COUNT(DISTINCT session_id) as unique_sessions,
                    MIN(timestamp) as first_query,
                    MAX(timestamp) as last_query
                FROM chat_logs
                WHERE timestamp >= datetime('now', '-{} days')
            '''.format(days))
            
            stats = cursor.fetchone()
            
            cursor.execute('''
                SELECT user_query, COUNT(*) as count
                FROM chat_logs
                WHERE timestamp >= datetime('now', '-{} days')
                GROUP BY user_query
                ORDER BY count DESC
                LIMIT 10
            '''.format(days))
            
            popular_queries = [{'query': row['user_query'], 'count': row['count']} 
                             for row in cursor.fetchall()]
            
            return {
                'total_queries': stats['total_queries'],
                'avg_response_time': round(stats['avg_response_time'] or 0, 3),
                'unique_sessions': stats['unique_sessions'],
                'first_query': stats['first_query'],
                'last_query': stats['last_query'],
                'popular_queries': popular_queries
            }
            
        except Exception as e:
            logger.error(f"failed to get chat analytics: {e}")
            return {}
        finally:
            conn.close()
    
    @staticmethod
    def clear_chat_logs(session_id: str = None):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            if session_id:
                cursor.execute('DELETE FROM chat_logs WHERE session_id = ?', (session_id,))
                logger.info(f"cleared chat logs for session {session_id}")
            else:
                cursor.execute('DELETE FROM chat_logs')
                logger.info("cleared all chat logs")
                
            conn.commit()
            
        except Exception as e:
            logger.error(f"failed to clear chat logs: {e}")
            raise
        finally:
            conn.close() 