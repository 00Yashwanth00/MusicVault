from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from user_queries import user_queries
from song_queries import song_queries

app = Flask(__name__)
CORS(app)

    
@app.route('/register', methods=['POST'])
def register():
    print("Inside regiter")
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin')

    result = user_queries.create_user(username, email, password, is_admin)

    return jsonify(result)


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin')

    result = user_queries.authenticate_user(email, password, is_admin)

    return jsonify(result)


# Search Songs by Title 
@app.route('/search/songs', methods=['GET'])
def search_songs():
    title_keyword = request.args.get('title')

    result = song_queries.get_song_by_title(title_keyword)
    return jsonify(result)


@app.route('/songs/artist', methods=['GET'])
def get_songs_by_artist():
    artist_name = request.args.get('artist')

    result = song_queries.get_songs_by_artist(artist_name)
    return jsonify(result)


@app.route('/songs/album', methods=['GET'])
def get_songs_by_album():
    album_title = request.args.get('album')

    result = song_queries.get_songs_by_album(album_title)
    return jsonify(result)


@app.route('/songs/playlist', methods=['GET'])
def get_songs_by_playlist():
    playlist_name = request.args.get('playlist')
    user_id = request.args.get('user_id')

    result = song_queries.get_songs_by_playlist(playlist_name, user_id)

    return jsonify(result)


@app.route('/play-history', methods=['POST'])
def add_play_history():
    data = request.json
    user_id = data.get('user_id')
    song_id = data.get('song_id')

    result = song_queries.add_to_play_history(user_id, song_id)
    return jsonify(result)


@app.route('/admin/songs', methods=['POST'])
def add_song():
    data = request.json
    title = data.get('title')
    duration = data.get('duration')
    genre = data.get('genre')
    file_path = data.get('file_path')
    artist_name = data.get('artist_name')

    result = song_queries.add_song(title, duration, genre, file_path, artist_name)   
    return jsonify(result)

@app.route('/admin/artists', methods=['POST'])
def add_artist():
    data = request.json
    artistname = data.get('artistname')
    bio = data.get('bio', '')

    result = song_queries.add_artist(artistname, bio)
    return jsonify(result)

@app.route('/admin/albums', methods=['POST'])
def add_album():
    data = request.json
    title = data.get('title')
    artist_id = data.get('artist_id')
    songs = data.get('songs', [])

    result = song_queries.add_album(title, artist_id, songs)
    return jsonify(result)



if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=True)
