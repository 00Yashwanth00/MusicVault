
CREATE DATABASE IF NOT EXISTS music_system;
USE music_system;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at DATE DEFAULT (CURRENT_DATE),
    description TEXT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS PlaylistSongs (
    playlist_song_id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES Songs(song_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Collections (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    song_id INT NOT NULL,
    FOREIGN KEY (album_id) REFERENCES Albums(album_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES Songs(song_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS PlayHistory (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES Songs(song_id) ON DELETE CASCADE
);

ALTER TABLE Playlists
ADD FULLTEXT(name);

DELIMITER $$

CREATE FUNCTION check_duplicate_song(p_playlist_id INT, p_song_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE cnt INT;
    SELECT COUNT(*) INTO cnt
    FROM PlaylistSongs 
    WHERE playlist_id = p_playlist_id AND song_id = p_song_id;
    RETURN cnt;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER prevent_duplicate_playlist_songs
BEFORE INSERT ON PlaylistSongs
FOR EACH ROW
BEGIN
    IF check_duplicate_song(NEW.playlist_id, NEW.song_id) > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This song already exists in the playlist';
    END IF;
END$$

DELIMITER ;


-- Fix the RegisterUser procedure (remove duplicate code)
DELIMITER //
CREATE PROCEDURE RegisterUser(
    IN p_username VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_count INT;
    DECLARE email_count INT;
    
    -- Check if username already exists
    SELECT COUNT(*) INTO user_count FROM Users WHERE username = p_username;
    IF user_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username already exists';
    END IF;
    
    -- Check if email already exists
    SELECT COUNT(*) INTO email_count FROM Users WHERE email = p_email;
    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists';
    END IF;
    
    -- Insert new user (use password_hash column)
    INSERT INTO Users (username, email, password_hash) 
    VALUES (p_username, p_email, p_password);
    
    SELECT LAST_INSERT_ID() as user_id;
END//
DELIMITER ;

SELECT s.song_id, s.title, s.duration, s.genre, s.file_path, a.artistname, p.name as playlist_name
                   FROM Playlists p 
                   JOIN PlaylistSongs ps ON p.playlist_id = ps.playlist_id 
                   JOIN Songs s ON s.song_id = ps.song_id 
                   JOIN Artists a ON s.artist_id = a.artist_id
                   WHERE p.playlist_id = 1 AND p.user_id = 1;


SELECT * FROM PlayHistory;



