import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playService } from '../../services/playService';
import '../../styles/Auth.css';

const CreatePlaylist = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Creating playlist with data:', {
        user_id: user.userId,
        name: formData.name,
        description: formData.description
      });

      const result = await playService.createPlaylist({
        user_id: user.user_id,
        name: formData.name,
        description: formData.description
      });

      console.log('Server response:', result);

      if (result.success) {
        setSuccess('Playlist created successfully!');
        setFormData({ name: '', description: '' });
        setTimeout(() => {
          navigate('/user/playlists');
        }, 1500);
      } else {
        setError(result.error || 'Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create New Playlist</h2>
        <p className="auth-subtitle">Organize your favorite songs</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Playlist Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter playlist name"
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter playlist description (optional)"
              rows="3"
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating...' : 'Create Playlist'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            <a href="/user/playlists" className="link">View My Playlists</a>
          </p>
          <p>
            <a href="/user/dashboard" className="link">Back to Dashboard</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;