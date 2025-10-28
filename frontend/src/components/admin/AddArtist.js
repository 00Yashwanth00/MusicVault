import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistService } from '../../services/artistService';
import '../../styles/AdminForms.css';

const AddArtist = () => {
  const [formData, setFormData] = useState({
    artistname: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
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

    // Validation
    if (!formData.artistname.trim()) {
      setError('Artist name is required');
      setLoading(false);
      return;
    }

    try {
      const result = await artistService.addArtist(formData);
      
      if (result.success) {
        setSuccess('Artist added successfully!');
        setFormData({ artistname: '', bio: '' });
        
        // Redirect to artists list or stay on page for adding more
        setTimeout(() => {
          // navigate('/admin/artists'); // Uncomment if you want to redirect
          handleBack();
        }, 2000);
      } else {
        setError(result.error || 'Failed to add artist');
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form">
        <div className="form-header">
          <h2>Add New Artist</h2>
          <button onClick={handleBack} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="artistname">Artist Name *</label>
            <input
              type="text"
              id="artistname"
              name="artistname"
              value={formData.artistname}
              onChange={handleChange}
              required
              placeholder="Enter artist name"
              maxLength="50"
            />
            <span className="char-count">{formData.artistname.length}/50</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter artist biography (optional)"
              rows="4"
            />
            <span className="char-count">{formData.bio.length}</span>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleBack}
              className="btn secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !formData.artistname.trim()}
              className="btn primary"
            >
              {loading ? 'Adding Artist...' : 'Add Artist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArtist;