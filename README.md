🎵 Music Vault – A Full-Stack Music Management System

Music Vault is a comprehensive, full-stack music management platform that enables users to explore, organize, and enjoy a rich music collection. The system supports seamless audio playback, playlist creation, advanced song search, user authentication, and robust catalog management powered by a dual-backend architecture (Python + Node.js).

⭐ Key Features
👤 User Features

User Authentication: Secure registration & login with JWT-based sessions

Browse Music Catalog: View all songs with metadata & artist info

Advanced Search: Search by song title (keyword/pattern match)

Artist-Based Filtering: Discover songs grouped by artists

Playlist Management: Create playlists, add/remove songs

Play History Tracking: Automatic capture of recently played songs

Audio Playback: In-browser streaming with a custom audio player

👨‍💼 Admin Features

Artist Management: Add/manage artist profiles

Song Management: Upload and categorize songs

Album Management: Create albums and associate multiple songs

Full CRUD Support: Manage artists, songs, albums, playlists

Catalog Integrity: Enforced through constraints, triggers, and validations

🛠️ Tech Stack Overview
Frontend

Framework: React.js

State Management: React Hooks

HTTP Client: Axios

Backend
Python (Flask) Backend

Primary music data API

MySQL database interactions

Password hashing with bcrypt

CORS support via Flask-CORS

Node.js (Express) Backend

Handles audio file uploads

Processes and stores multimedia files

Database

MySQL 8.0+

mysql-connector-python for querying

Constraints, triggers, functions, stored procedures for data integrity

⚙️ Installation & Setup Guide
✅ Prerequisites

Node.js v14+

Python 3.8+

MySQL 8.0+

🐍 1. Setup Python/Flask Backend

Navigate to the database backend:

cd database


Install dependencies:

pip install -r requirements.txt


Configure database connection inside:

db_connection.py


Run the Flask server:

python app.py


Default URL:

http://localhost:5001
🟦 2. Setup Node.js Backend (File Upload Service)
Navigate to:

bash
Copy code
cd backend
Install dependencies:

bash
Copy code
npm install
Start server:

bash
Copy code
npm start
Runs on:

arduino
Copy code
http://localhost:5000
🌐 3. Setup Frontend (React App)
Navigate to frontend:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start development server:

bash
Copy code
npm run dev
App opens at:

arduino
Copy code
http://localhost:3000
📁 Project Folder Structure
A high-level view of the project architecture:
.
├── AdminSchema.sql
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── server.js
├── database
│   ├── app.py
│   ├── db_connection.py
│   ├── generate_audio.py
│   ├── song_queries.py
│   ├── user_queries.py
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── services
│   │   └── styles
├── SampleData.sql
├── SchemaCreation.sql
└── README.md

🗄️ Database Schema Overview
Core Tables

Users

Admins

Artists

Songs

Albums

Playlists

PlaylistSongs (junction table)

Collections (album-song mapping)

PlayHistory

Key Relationships

Song → Artist: Many-to-One

Song ↔ Playlist: Many-to-Many

Song ↔ Album: Many-to-Many

User → Playlist: One-to-Many

🔧 Database Programming Components
Stored Procedures

RegisterUser

RegisterAdmin

Functions

check_duplicate_song

Triggers

prevent_duplicate_playlist_songs

Complex Queries

Multi-table JOINs

Full-text search queries

Aggregations (song counts, listening stats)

📡 API Endpoints Overview
Authentication

POST /api/auth/users/register

POST /api/auth/users/login

POST /api/auth/admin/register

POST /api/auth/admin/login

Search

GET /api/search/songs

GET /api/search/artist

GET /api/search/album

GET /api/search/all-songs

Playlist Management

POST /api/play/playlist

POST /api/play/playlist/add-song

GET /api/play/playlists

GET /api/search/playlist

Admin Operations

POST /api/admin/songs

POST /api/admin/artists

POST /api/admin/albums

🔐 Security & Integrity Features

Password hashing with bcrypt

JWT-based authentication

Unique constraint checks

File validation before upload

Duplicate-prevention via triggers

Enforced foreign-key relationships

🎯 Project Goals

Provide a smooth, Spotify-like user experience

Offer powerful admin tools for catalog management

Maintain strong data integrity across a complex schema

Enable fast search and reliable audio streaming
