USE music_system;

CREATE TABLE IF NOT EXISTS Artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    artistname VARCHAR(50) NOT NULL,
    bio TEXT
);


CREATE TABLE IF NOT EXISTS Songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    duration INT NOT NULL,                    
    genre VARCHAR(50),
    file_path VARCHAR(200) NOT NULL UNIQUE,
    artist_id INT NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL UNIQUE,
    release_date DATE DEFAULT (CURRENT_DATE),
    artist_id INT NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE CASCADE
);

ALTER TABLE Artists
ADD FULLTEXT (artistname);

ALTER TABLE Songs
ADD FULLTEXT (title);

ALTER TABLE Albums
ADD FULLTEXT (title);

-- Fix the RegisterAdmin procedure
DELIMITER //
CREATE PROCEDURE RegisterAdmin(
    IN p_admin_id INT,
    IN p_username VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE id_count INT;
    DECLARE user_count INT;
    DECLARE email_count INT;
    
    -- Check if admin_id already exists
    SELECT COUNT(*) INTO id_count FROM Admins WHERE admin_id = p_admin_id;
    IF id_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Admin Id already exists';
    END IF;
    
    -- Check if username already exists
    SELECT COUNT(*) INTO user_count FROM Admins WHERE username = p_username;
    IF user_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username already exists';
    END IF;
    
    -- Check if email already exists
    SELECT COUNT(*) INTO email_count FROM Admins WHERE email = p_email;
    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists';
    END IF;
    
    -- Insert new admin (use password_hash column)
    INSERT INTO Admins (admin_id, username, email, password_hash) 
    VALUES (p_admin_id, p_username, p_email, p_password);
    
    -- Return the provided admin_id, not LAST_INSERT_ID()
    SELECT p_admin_id as admin_id;
END//
DELIMITER ;



CREATE TABLE IF NOT EXISTS Admins (
    admin_id INT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
