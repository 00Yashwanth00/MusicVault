// AdminDashboard.js
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated or user is null or not admin
  if (!isAuthenticated || !user || !user.admin_id) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}! Manage your music library.</p>
      </div>
      
      <div className="dashboard-content">
        <div className="feature-grid">
          <Link to="/admin/add-artist" className="feature-card admin-card">
            <h3>🎤 Add Artist</h3>
            <p>Add new artists to the system</p>
          </Link>
          
          <Link to="/admin/add-song" className="feature-card admin-card">
            <h3>➕ Add Song</h3>
            <p>Upload new songs to the library</p>
          </Link>
          
          <Link to="/admin/add-album" className="feature-card admin-card">
            <h3>💿 Create Album</h3>
            <p>Create and organize albums</p>
          </Link>
          
          <div className="feature-card admin-card">
            <h3>📈 Analytics</h3>
            <p>View system usage statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;