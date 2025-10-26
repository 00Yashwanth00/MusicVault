from db_connection import db
import bcrypt
import mysql.connector
from mysql.connector import Error

class UserQueries:
    def create_user(self, username, email, password, is_admin = False):
        connection = db.connect()

        if not connection:
            return ({'success': False, 'error': 'Database connection failed'})
        
        try:
            cursor = connection.cursor()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            table_name = "Admins" if is_admin else "Users"
            query = "INSERT INTO %s (username, email, password_hash) VALUES (%s, %s, %s)"
            cursor.execute(query, (table_name, username, email, password_hash))
            user_id = cursor.lastrowid
            connection.commit()
            return ({'success': True, 'user_id': user_id})
        except Error as e:
            connection.rollback()
            return ({'success': False, 'error': str(e)})
        finally:
            cursor.close()
            connection.close()


    
    def authenticate_user(self, email, password, is_admin = False):
        connection = db.connect()
        if not connection:
            return ({'success': False, 'error': 'Database connection failed'})
        try:
            cursor = connection.cursor(dictionary=True)
            table_name = "Admins" if is_admin else "Users"
            query = "SELECT * FROM %s WHERE email = %s"
            cursor.execute(query, (table_name, email,))
            user = cursor.fetchone()
            
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                user_data = {
                    'user_id': user['user_id'],
                    'username': user['username'],
                    'email': user['email']
                }
                return ({'success':True, 'user': user_data})
            
            return ({'success': False, 'error': 'Invalid credentials'})
        
        except Error as e:
            return ({'success': False, 'error': str(e)})
        finally:
            cursor.close()
            connection.close()

user_queries = UserQueries()