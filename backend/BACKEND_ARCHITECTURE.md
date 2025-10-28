## **Documentation File 2: BACKEND_ARCHITECTURE.md**

````markdown
# Backend Architecture Documentation

## Overview

Node.js/Express backend providing RESTful APIs for MusicVault application with JWT authentication and file upload capabilities.

## Server Configuration

### Main Server (server.js)

- **Port**: 5000 (configurable via environment variable)
- **CORS**: Enabled for cross-origin requests
- **Static Files**: Serves songs from `../songs` directory
- **Health Check**: `GET /api/health`

### Architecture

server.js
├── /api/auth/_ → authRoutes.js
├── /api/search/_ → searchRoutes.js
├── /api/play/_ → playRoutes.js
├── /api/admin/_ → adminRoutes.js
└── /songs/\* → Static file serving

## Routes Documentation

### 1. Authentication Routes (`/api/auth`)

**File**: `authRoutes.js`

#### Endpoints:

- `POST /api/auth/register` - User and admin registration
- `POST /api/auth/login` - User and admin authentication
- `GET /api/auth/profile` - Get user and admin profile (protected)


### 2. Search Routes (`/api/search`)

**File**: `searchRoutes.js`

#### Endpoints (All require authentication):

- `GET /api/search/songs?title=keyword` - Search songs by title
- `GET /api/search/artist?artist=name` - Get songs by artist
- `GET /api/search/album?album=title` - Get songs by album
- `GET /api/search/playlist?playlist=name` - Get playlist songs

### 3. Play Routes (`/api/play`)

**File**: `playRoutes.js`

#### Endpoints:

- `POST /api/play/history` - Add to play history (protected)

### 4. Admin Routes (`/api/admin`)

**File**: `adminRoutes.js`

#### Endpoints (All require admin privileges):

- `POST /api/admin/songs` - Add new song with file upload
- `POST /api/admin/artists` - Add new artist
- `POST /api/admin/albums` - Add new album

## Middleware Architecture

### 1. Authentication Middleware (`authMiddleware.js`)

#### Functions:

- `authenticateToken` - Verifies JWT tokens
- `requireAdmin` - Ensures user has admin privileges

#### Flow:

Request → Extract JWT from Authorization header → Verify token → Attach user to req → Next middleware

### 2. File Upload Middleware (`uploadMiddleware.js`)

#### Functions:

- `handleFileUpload(fieldName)` - Handles file uploads using Multer

#### Configuration:

- Field name: `'audio'` for song uploads
- File validation and error handling
- Automatic file saving to configured directory

## Security Implementation

### JWT Authentication

- Tokens required for protected routes
- Token format: `Bearer <token>`
- Automatic token verification for protected endpoints

### Admin Protection

- Double-layer protection: Authentication + Admin check
- Prevents unauthorized access to admin functionalities

### File Upload Security

- Controlled file upload via Multer middleware
- Field-specific upload handling
- Error handling for upload failures

## API Flow Examples

### User Registration Flow

POST /api/auth/register
↓
authController.register()
↓
Return JWT token

### Song Upload Flow (Admin)

POST /api/admin/songs (with audio file)
↓
authenticateToken → requireAdmin → handleFileUpload('audio')
↓
adminController.addSong()
↓
Return success/error response

### Search Flow

GET /api/search/songs?title=query
↓
authenticateToken
↓
searchController.searchSongs()
↓
Return search results

## Error Handling

### Standard Error Response

```json
{
    "success": false,
    "error": "Descriptive error message"
}

Common HTTP Status Codes
200 - Success

400 - Bad Request (validation errors)

401 - Unauthorized (missing/invalid token)

403 - Forbidden (admin access required)

404 - Not Found

500 - Internal Server Error


### Environment Setup
Install dependencies: npm install

Configure environment variables in .env

Start server: npm start or node server.js

Server runs on http://localhost:5000

### Dependencies
express: Web framework

cors: Cross-origin resource sharing

dotenv: Environment variable management

Multer: File upload handling

JWT: Authentication tokens
```
````
