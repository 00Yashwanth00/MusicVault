// UserDashboard.js
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated or user is null
  if (!isAuthenticated || !user) {
    return <Navigate to="/user/login" replace />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p>Welcome back, {user.username}! Explore your music world.</p>
      </div>
      
      <div className="dashboard-content">
        <div className="feature-grid">
          <Link to="/user/search-songs" className="feature-card">
            <h3>🔍 Search Songs</h3>
            <p>Find your favorite tracks by title</p>
          </Link>
          
          <Link to="/user/songs-by-artist" className="feature-card">
            <h3>🎤 Songs by Artist</h3>
            <p>Discover all songs from your favorite artists</p>
          </Link>
          
          <div className="feature-card">
            <h3>📊 Play History</h3>
            <p>View your recently played songs</p>
          </div>
          
          <div className="feature-card">
            <h3>🎶 Create Playlists</h3>
            <p>Organize your music collection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;