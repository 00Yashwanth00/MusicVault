import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumService } from '../../services/albumService';
import { artistService } from '../../services/artistService';
import { songService } from '../../services/songService';
import '../../styles/AdminForms.css';

const AddAlbum = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    songs: []
  });
  const [artists, setArtists] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [songsLoading, setSongsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch artists and songs on component mount
  // Fetch artists on component mount
  useEffect(() => {
    fetchArtists();
  }, []);

  // Fetch songs only when artist is selected
// Fetch songs only when artist is selected
  useEffect(() => {
    if (!formData.artist_id) {
      setAvailableSongs([]);
      setFilteredSongs([]);
      return;
    }

    const selectedArtist = artists.find(
      a => a.artist_id === parseInt(formData.artist_id)
    );

    if (selectedArtist) {
      fetchSongs(selectedArtist.artistname);
    }

  }, [formData.artist_id, artists]);


const fetchSongs = async (artistId) => {
  setSongsLoading(true);
  try {
    const response = await songService.getSongsByArtist(artistId);

    const songs = response.songs || [];

    setAvailableSongs(songs);
    setFilteredSongs(songs);

  } catch (error) {
    console.error('Failed to fetch songs:', error);
    setError('Failed to load songs');
  }
  setSongsLoading(false);
};


  const fetchArtists = async () => {
    setArtistsLoading(true);
    try {
      const result = await artistService.getArtists();
      if (result.success) {
        setArtists(result.artists);
      }
    } catch (error) {
      console.error('Failed to fetch artists:', error);
      setError('Failed to load artists');
    }
    setArtistsLoading(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSongSelection = (songId) => {
    const songIdNum = parseInt(songId);
    setFormData(prev => {
      const isSelected = prev.songs.includes(songIdNum);
      if (isSelected) {
        return {
          ...prev,
          songs: prev.songs.filter(id => id !== songIdNum)
        };
      } else {
        return {
          ...prev,
          songs: [...prev.songs, songIdNum]
        };
      }
    });
  };

  const handleSelectAllSongs = () => {
    if (formData.artist_id) {
      const allArtistSongIds = filteredSongs.map(song => song.song_id);
      setFormData(prev => ({
        ...prev,
        songs: allArtistSongIds
      }));
    }
  };

  const handleDeselectAllSongs = () => {
    setFormData(prev => ({
      ...prev,
      songs: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Album title is required');
      setLoading(false);
      return;
    }

    if (!formData.artist_id) {
      setError('Please select an artist');
      setLoading(false);
      return;
    }

    if (formData.songs.length === 0) {
      setError('Please select at least one song for the album');
      setLoading(false);
      return;
    }

    try {
      // Prepare songs data in the format expected by backend
      const songsData = formData.songs.map(songId => {
        const song = availableSongs.find(s => s.song_id === songId);
        return {
          title: song.title,
          duration: song.duration || 180, // Default duration if not available
          genre: song.genre || 'Unknown',
          file_path: song.file_path || `/songs/${song.title.toLowerCase().replace(/\s+/g, '-')}.mp3`
        };
      });

      const albumData = {
        title: formData.title,
        artist_id: parseInt(formData.artist_id),
        songs: songsData
      };

      const result = await albumService.addAlbum(albumData);
      
      if (result.success) {
        setSuccess('Album created successfully!');
        // Reset form
        setFormData({ 
          title: '', 
          artist_id: '', 
          songs: [] 
        });
        
        setTimeout(() => {
          // navigate('/admin/albums'); // Uncomment if you want to redirect
        }, 2000);
      } else {
        setError(result.error || 'Failed to create album');
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const getSelectedSongsCount = () => {
    return formData.songs.length;
  };

  const getTotalSongsCount = () => {
    return filteredSongs.length;
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form">
        <div className="form-header">
          <h2>Create New Album</h2>
          <button onClick={handleBack} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Album Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter album title"
              maxLength="200"
            />
            <span className="char-count">{formData.title.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="artist_id">Artist *</label>
            <select
              id="artist_id"
              name="artist_id"
              value={formData.artist_id}
              onChange={handleChange}
              required
              disabled={artistsLoading}
            >
              <option value="">Select an artist</option>
              {artists.map(artist => (
                <option key={artist.artist_id} value={artist.artist_id}>
                  {artist.artistname}
                </option>
              ))}
            </select>
            {artistsLoading && <small className="form-help">Loading artists...</small>}
            {artists.length === 0 && !artistsLoading && (
              <small className="form-help">
                No artists found. <a href="/admin/add-artist">Add an artist first</a>.
              </small>
            )}
          </div>

          <div className="form-group">
            <div className="songs-selection-header">
              <label>Select Songs for Album *</label>
              <div className="selection-actions">
                <button 
                  type="button" 
                  onClick={handleSelectAllSongs}
                  disabled={!formData.artist_id || filteredSongs.length === 0}
                  className="action-btn"
                >
                  Select All
                </button>
                <button 
                  type="button" 
                  onClick={handleDeselectAllSongs}
                  className="action-btn"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="songs-selection-info">
              <span>
                {getSelectedSongsCount()} of {getTotalSongsCount()} songs selected
                {formData.artist_id && ` (Artist: ${artists.find(a => a.artist_id === parseInt(formData.artist_id))?.artistname})`}
              </span>
            </div>

            <div className="songs-list">
              {songsLoading ? (
                <div className="loading-message">Loading songs...</div>
              ) : filteredSongs.length === 0 ? (
                <div className="no-songs-message">
                  {formData.artist_id 
                    ? 'No songs available for this artist' 
                    : 'Select an artist to see available songs'
                  }
                </div>
              ) : (
                filteredSongs.map(song => (
                  <div key={song.song_id} className="song-checkbox-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.songs.includes(song.song_id)}
                        onChange={() => handleSongSelection(song.song_id)}
                      />
                      <span className="song-title">{song.title}</span>
                      {!formData.artist_id && (
                        <span className="song-artist"> - {song.artistname}</span>
                      )}
                    </label>
                  </div>
                ))
              )}
            </div>
            
            {!formData.artist_id && (
              <small className="form-help">
                Tip: Select an artist first to see only their songs
              </small>
            )}
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
              disabled={loading || !formData.title.trim() || !formData.artist_id || formData.songs.length === 0}
              className="btn primary"
            >
              {loading ? 'Creating Album...' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlbum;