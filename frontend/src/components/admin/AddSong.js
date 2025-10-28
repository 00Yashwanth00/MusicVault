import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { songService } from '../../services/songService';
import '../../styles/AdminForms.css';

const AddSong = () => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    genre: '',
    artist_name: '',
    audio_file: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        audio_file: file
      });
      setFileName(file.name);
      setError(''); // Clear any previous errors
    }
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    // Only allow numbers for duration
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({
        ...formData,
        duration: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation (backend will handle file validation)
    if (!formData.title.trim()) {
      setError('Song title is required');
      setLoading(false);
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Duration must be a positive number (in seconds)');
      setLoading(false);
      return;
    }

    if (!formData.artist_name.trim()) {
      setError('Artist name is required');
      setLoading(false);
      return;
    }

    if (!formData.audio_file) {
      setError('Please select an audio file');
      setLoading(false);
      return;
    }

    try {
      const songData = {
        ...formData,
        duration: parseInt(formData.duration)
      };

      const result = await songService.addSong(songData);
      
      if (result.success) {
        setSuccess('Song uploaded successfully!');
        // Reset form
        setFormData({ 
          title: '', 
          duration: '', 
          genre: '', 
          artist_name: '', 
          audio_file: null 
        });
        setFileName('');
        
        // Clear file input
        const fileInput = document.getElementById('audio_file');
        if (fileInput) fileInput.value = '';
        
      } else {
        setError(result.error || 'Failed to upload song');
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form">
        <div className="form-header">
          <h2>Upload New Song</h2>
          <button onClick={handleBack} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Song Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter song title"
              maxLength="100"
            />
            <span className="char-count">{formData.title.length}/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="artist_name">Artist Name *</label>
            <input
              type="text"
              id="artist_name"
              name="artist_name"
              value={formData.artist_name}
              onChange={handleChange}
              required
              placeholder="Enter artist name"
              maxLength="50"
            />
            <small className="form-help">
              Make sure the artist exists in the system. If not, <a href="/admin/add-artist">add the artist first</a>.
            </small>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (seconds) *</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleDurationChange}
                required
                placeholder="Enter duration in seconds"
              />
              {formData.duration && (
                <small className="form-help">
                  Formatted: {formatDuration(parseInt(formData.duration))}
                </small>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Enter genre"
                maxLength="50"
              />
              <span className="char-count">{formData.genre.length}/50</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="audio_file">Audio File *</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="audio_file"
                name="audio_file"
                onChange={handleFileChange}
                accept="audio/*"
                required
                className="file-input"
              />
              <div className="file-upload-display">
                {fileName ? (
                  <div className="file-info">
                    <span className="file-name">{fileName}</span>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <span>Click to choose audio file</span>
                    <small>Supported formats: MP3, WAV, FLAC, AAC</small>
                  </div>
                )}
              </div>
            </div>
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
              disabled={loading || !formData.title.trim() || !formData.duration || !formData.artist_name.trim() || !formData.audio_file}
              className="btn primary"
            >
              {loading ? 'Uploading Song...' : 'Upload Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSong;