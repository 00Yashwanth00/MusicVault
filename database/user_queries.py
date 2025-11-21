from db_connection import db
import bcrypt
import mysql.connector
from mysql.connector import Error

class UserQueries:
    def create_user(self, username, email, password):
        connection = db.connect()
        cursor = None
        try:
            cursor = connection.cursor()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Call procedure without multi=True
            cursor.callproc('RegisterUser', [username, email, password_hash])
            
            # Get the result
            user_id = None
            for result in cursor.stored_results():
                rows = result.fetchall()
                if rows:
                    user_id = rows[0][0]  # Get the first column of first row
            
            connection.commit()
            print(f"User registered successfully with ID: {user_id}")
            return {'success': True, 'user_id': user_id}

        except Error as e:
            connection.rollback()
            error_msg = str(e)
            print(f"User registration error: {error_msg}")
            
            if 'Username already exists' in error_msg:
                return {'success': False, 'error': 'Username already exists'}
            elif 'Email already exists' in error_msg:
                return {'success': False, 'error': 'Email already exists'}
            else:
                return {'success': False, 'error': f'Registration failed: {error_msg}'}

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def create_admin(self, admin_id, username, email, password):
        connection = db.connect()
        cursor = None
        try:
            cursor = connection.cursor()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            print(f"Calling RegisterAdmin with: {admin_id}, {username}, {email}")
            
            # Call procedure without multi=True
            cursor.callproc('RegisterAdmin', [admin_id, username, email, password_hash])
            
            # Get the result
            returned_admin_id = None
            for result in cursor.stored_results():
                rows = result.fetchall()
                if rows:
                    returned_admin_id = rows[0][0]  # Get the first column of first row
            
            connection.commit()
            print(f"Admin registered successfully with ID: {returned_admin_id}")
            return {'success': True, 'admin_id': returned_admin_id}

        except Error as e:
            connection.rollback()
            error_msg = str(e)
            print(f"Admin registration error: {error_msg}")
            
            if 'Admin Id already exists' in error_msg:
                return {'success': False, 'error': 'Admin ID already exists'}
            elif 'Username already exists' in error_msg:
                return {'success': False, 'error': 'Username already exists'}
            elif 'Email already exists' in error_msg:
                return {'success': False, 'error': 'Email already exists'}
            else:
                return {'success': False, 'error': f'Admin registration failed: {error_msg}'}

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    # ... rest of your methods remain the same
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
            print("Admin fetched from DB:", admin)
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