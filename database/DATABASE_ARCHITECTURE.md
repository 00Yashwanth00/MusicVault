# Database Architecture Documentation

## Overview

This document covers the MySQL database schema and Flask API backend for the MusicVault application.

## Database Schema

### Tables Structure

#### 1. Users Table

Purpose: Stores user authentication and profile information.

#### 2. Artists Table

Purpose: Stores artist information with full-text search capability.

#### 3. Songs Table

Purpose: Stores song metadata with artist relationship.

#### 4. Albums Table

Purpose: Stores album information with artist relationship.

#### 5. Playlists Table

Purpose: User-created playlists with full-text search.

#### 6. Supporting Tables

PlaylistSongs: Many-to-many relationship between playlists and songs

Collections: Many-to-many relationship between albums and songs

PlayHistory: Tracks user listening history

Admins: Admin users mapping

#### Flask API Endpoints (app.py)

Authentication Endpoints
POST /register - User registration

POST /login - User authentication

# Search Endpoints

GET /search/songs?title=keyword - Search songs by title

GET /songs/artist?artist=name - Get songs by artist

GET /songs/album?album=title - Get songs by album

GET /songs/playlist?playlist=name&user_id=id - Get playlist songs

# Play History Endpoints

POST /play-history - Add song to play history

# Admin Endpoints

POST /admin/songs - Add new song

POST /admin/artists - Add new artist

POST /admin/albums - Add new album

#### Key Features

# Database Relationships

Songs belong to Artists (One-to-Many)

Albums belong to Artists (One-to-Many)

Playlists belong to Users (One-to-Many)

Many-to-Many: PlaylistSongs, Collections

# Search Optimization

Full-text search indexes on:

Artists.artistname

Songs.title

Albums.title

Playlists.name

#### Data Flow

User authentication via /register and /login

Song/artist/album management via admin endpoints

Search functionality via search endpoints

Play history tracking for user analytics

#### API Response Format

{
"success": true/false,
"data": { ... }, // On success
"error": "message" // On failure
}

#### Setup Instructions

Run SchemaCreation.sql to create database and tables

Start Flask server: python app.py

Server runs on http://localhost:5001
