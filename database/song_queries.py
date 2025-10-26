from db_connection import db
import mysql.connector
from mysql.connector import Error

class SongQueries:
    def add_song(self, title, duration, genre, file_path, artist_name):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor()
            
            # First, get the artist_id properly
            query = "SELECT artist_id FROM Artists WHERE artistname = %s"
            cursor.execute(query, (artist_name,))
            result = cursor.fetchone()
            
            if not result:
                return {'success': False, 'error': f'Artist "{artist_name}" not found'}
            
            artist_id = result[0]
            
            # Then insert the song
            query = """INSERT INTO Songs (title, duration, genre, file_path, artist_id) 
                    VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(query, (title, duration, genre, file_path, artist_id))
            connection.commit()
            return {'success': True, 'song_id': cursor.lastrowid}
            
        except Error as e:
            connection.rollback()
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def add_artist(self, artistname, bio):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor()
            query = "INSERT INTO Artists (artistname, bio) VALUES (%s, %s)"
            cursor.execute(query, (artistname, bio))
            connection.commit()
            return {'success': True, 'artist_id': cursor.lastrowid}
        except Error as e:
            connection.rollback()
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def add_album(self, title, artist_id, songs):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor()
            
            # Verify artist exists
            cursor.execute("SELECT artist_id FROM Artists WHERE artist_id = %s", (artist_id,))
            if not cursor.fetchone():
                return {'success': False, 'error': 'Artist not found'}
            
            # Insert album
            cursor.execute("INSERT INTO Albums (title, artist_id) VALUES (%s, %s)", (title, artist_id))
            album_id = cursor.lastrowid
            
            # Add songs to the album
            for song in songs:
                song_title = song['title']
                duration = song['duration']
                genre = song['genre']
                file_path = song['file_path']
                
                # Insert song only if title not exists
                song_query = """
                    INSERT INTO Songs (title, duration, genre, file_path, artist_id)
                    SELECT %s, %s, %s, %s, %s
                    WHERE NOT EXISTS (
                        SELECT 1 FROM Songs WHERE title = %s
                    )
                """
                cursor.execute(song_query, (song_title, duration, genre, file_path, artist_id, song_title))
                
                # If song already existed, fetch its ID
                if cursor.rowcount == 0:
                    cursor.execute("SELECT song_id FROM Songs WHERE title = %s", (song_title,))
                    song_id = cursor.fetchone()[0]
                else:
                    song_id = cursor.lastrowid
                
                # Always add to Collections table
                collection_query = "INSERT INTO Collections (album_id, song_id) VALUES (%s, %s)"
                cursor.execute(collection_query, (album_id, song_id))
            
            connection.commit()
            return {'success': True, 'album_id': album_id}
            
        except Error as e:
            connection.rollback()
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()


    def get_songs_by_artist(self, artistname):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)
            query = """SELECT s.song_id, s.title, s.duration, s.genre, s.file_path, a.artistname 
                    FROM Songs s 
                    JOIN Artists a ON s.artist_id = a.artist_id 
                    WHERE a.artistname = %s"""
            cursor.execute(query, (artistname,))
            songs = cursor.fetchall()
            return {'success': True, 'songs': songs}
            
        except Error as e:
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def get_song_by_title(self, title_keyword):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)
            # Using LIKE for broader compatibility (MATCH requires full-text index)
            query = """SELECT s.song_id, s.title, s.duration, s.genre, s.file_path, a.artistname 
                    FROM Songs s 
                    JOIN Artists a ON s.artist_id = a.artist_id 
                    WHERE s.title LIKE %s"""
            cursor.execute(query, (f'%{title_keyword}%',))
            songs = cursor.fetchall()
            return {'success': True, 'songs': songs}
        except Error as e:
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def get_songs_by_playlist(self, playlist_name, user_id):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}

        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)
            query = """SELECT s.song_id, s.title, s.duration, s.genre, s.file_path, a.artistname, p.name as playlist_name
                   FROM Playlists p 
                   JOIN PlaylistSongs ps ON p.playlist_id = ps.playlist_id 
                   JOIN Songs s ON s.song_id = ps.song_id 
                   JOIN Artists a ON s.artist_id = a.artist_id
                   WHERE p.name = %s AND p.user_id = %s"""
            
            cursor.execute(query, (playlist_name, user_id))
            songs = cursor.fetchall()
            return {'success': True, 'songs': songs}
        except Error as e:
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def get_songs_by_album(self, title):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)
            query = """SELECT s.song_id, s.title, s.duration, s.genre, s.file_path, a.artistname, alb.title as album_title
                    FROM Albums alb 
                    JOIN Collections c ON alb.album_id = c.album_id 
                    JOIN Songs s ON s.song_id = c.song_id 
                    JOIN Artists a ON s.artist_id = a.artist_id
                    WHERE alb.title = %s"""
            cursor.execute(query, (title,))
            songs = cursor.fetchall()
            return {'success': True, 'songs': songs}
        except Error as e:
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def add_to_play_history(self, user_id, song_id):
        connection = db.connect()
        if not connection:
            return {'success': False, 'error': 'Database connection failed'}
        
        cursor = None
        try:
            cursor = connection.cursor()
            query = "INSERT INTO PlayHistory (user_id, song_id) VALUES (%s, %s)"
            cursor.execute(query, (user_id, song_id))
            connection.commit()
            return {'success': True, 'message': 'Play history recorded'}
        except Error as e:
            connection.rollback()
            return {'success': False, 'error': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()


song_queries = SongQueries()