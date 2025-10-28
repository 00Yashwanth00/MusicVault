from db_connection import db
import bcrypt
import mysql.connector
from mysql.connector import Error

class UserQueries:
    def create_user(self, username, email, password):
        connection = db.connect()

        if not connection:
            return ({'success': False, 'error': 'Database connection failed'})
        
        try:
            cursor = connection.cursor()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            query = "INSERT INTO Users (username, email, password_hash) VALUES (%s, %s, %s)"
            cursor.execute(query, (username, email, password_hash))
            user_id = cursor.lastrowid
            connection.commit()
            return ({'success': True, 'user_id': user_id})
        except Error as e:
            connection.rollback()
            return ({'success': False, 'error': str(e)})
        finally:
            cursor.close()
            connection.close()

    def create_admin(self, admin_id, username, email, password):
        connection = db.connect()

        if not connection:
            return ({'success': False, 'error': 'Database connection failed'})
        
        try:
            cursor = connection.cursor()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            query = "INSERT INTO Admins (admin_id, username, email, password_hash) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (admin_id, username, email, password_hash))
            admin_id = cursor.lastrowid
            connection.commit()
            return ({'success': True, 'admin_id': admin_id})
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
            query = "SELECT * FROM Users WHERE email = %s"
            cursor.execute(query, (email,))
            user = cursor.fetchone()
            
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                user_data = {
                    'user_id': user['user_id'],
                    'username': user['username'],
                    'email': user['email']
                }
                print("User authenticated successfully")
                return ({'success':True, 'user': user_data})
            print("Authentication failed")
            return ({'success': False, 'error': 'Invalid credentials'})
        
        except Error as e:
            return ({'success': False, 'error': str(e)})
        finally:
            cursor.close()
            connection.close()

    def authenticate_admin(self, admin_id, email, password):
        connection = db.connect()
        if not connection:
            return ({'success': False, 'error': 'Database connection failed'})
        try:
            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM Admins WHERE email = %s AND admin_id = %s"
            cursor.execute(query, (email, admin_id))
            admin = cursor.fetchone()

            if admin and bcrypt.checkpw(password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
                admin_data = {
                    'admin_id': admin['admin_id'],
                    'username': admin['username'],
                    'email': admin['email']
                }
                return ({'success':True, 'user': admin_data})

            return ({'success': False, 'error': 'Invalid credentials'})
        
        except Error as e:
            return ({'success': False, 'error': str(e)})
        finally:
            cursor.close()
            connection.close()

user_queries = UserQueries()