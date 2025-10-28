import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { songService } from '../../services/songService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Search.css';

const SongsByArtist = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artistSongs, setArtistSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch artists on component mount
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setArtistsLoading(true);
    try {
      const result = await songService.getArtists();
      if (result.success) {
        setArtists(result.data);
      } else {
        setError('Failed to load artists');
      }
    } catch (error) {
      console.error('Failed to fetch artists:', error);
      setError('Failed to load artists list');
    }
    setArtistsLoading(false);
  };

  const handleArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!selectedArtist) {
      setError('Please select an artist');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const result = await songService.getSongsByArtist(selectedArtist);
      console.log('Songs by artist result:', result);
      if (result.success) {
        setArtistSongs(result.songs || []);
        if (result.songs.length === 0) {
          setError(`No songs found for artist "${selectedArtist}"`);
        }
      } else {
        setError(result.error || 'Failed to fetch songs');
        setArtistSongs([]);
      }
    } catch (error) {
      setError(error.message);
      setArtistSongs([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSelectedArtist('');
    setArtistSongs([]);
    setError('');
    setHasSearched(false);
  };

  const handlePlaySong = (song) => {
    // For now, just log the play action
    console.log('Playing song:', song);
    // You can add play history tracking here
    // songService.addToPlayHistory(user.user_id, song.song_id);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate('/user/dashboard');
  };

  const getSelectedArtistName = () => {
    if (!selectedArtist) return '';
    const artist = artists.find(a => a.artistname === selectedArtist);
    return artist ? artist.artistname : selectedArtist;
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Songs by Artist</h1>
        <p>Discover all songs from your favorite artists</p>
      </div>

      <div className="search-content">
        {/* Artist Selection Form */}
        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <select
                value={selectedArtist}
                onChange={handleArtistChange}
                className="search-input"
                disabled={loading || artistsLoading}
                style={{ borderRadius: '25px', padding: '0.75rem 1rem' }}
              >
                <option value="">Select an artist...</option>
                {artists.map(artist => (
                  <option key={artist.artist_id} value={artist.artistname}>
                    {artist.artistname}
                  </option>
                ))}
              </select>
              <button 
                type="submit" 
                disabled={loading || !selectedArtist}
                className="search-btn"
              >
                {loading ? 'Loading...' : 'Get Songs'}
              </button>
            </div>
            {selectedArtist && (
              <button 
                type="button" 
                onClick={handleClearSearch}
                className="clear-btn"
              >
                Clear
              </button>
            )}
          </form>
          {artistsLoading && (
            <div className="loading-message">Loading artists...</div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className={`message ${artistSongs.length === 0 ? 'error' : 'warning'}`}>
            {error}
          </div>
        )}

        {/* Artist Songs Results */}
        {hasSearched && !loading && selectedArtist && (
          <div className="search-results">
            <div className="results-header">
              <h2>
                {artistSongs.length > 0 
                  ? `Songs by ${getSelectedArtistName()}`
                  : `No Songs by ${getSelectedArtistName()}`
                }
              </h2>
              {artistSongs.length > 0 && (
                <span className="results-count">
                  {artistSongs.length} song{artistSongs.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {artistSongs.length > 0 && (
              <div className="songs-list">
                {artistSongs.map((song) => (
                  <div key={song.song_id} className="song-card">
                    <div className="song-info">
                      <h3 className="song-title">{song.title}</h3>
                      <p className="song-artist">{song.artistname}</p>
                      <div className="song-meta">
                        <span className="song-duration">
                          {formatDuration(song.duration)}
                        </span>
                        {song.genre && (
                          <span className="song-genre">{song.genre}</span>
                        )}
                      </div>
                    </div>
                    <div className="song-actions">
                      <button 
                        onClick={() => handlePlaySong(song)}
                        className="play-btn"
                        title="Play song"
                      >
                        ▶ Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {artistSongs.length === 0 && !error && (
              <div className="no-results">
                <div className="no-results-icon">🎤</div>
                <h3>No songs found</h3>
                <p>This artist doesn't have any songs in the library yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading songs by {getSelectedArtistName()}...</p>
          </div>
        )}

        {/* Initial State - Before Search */}
        {!hasSearched && !loading && (
          <div className="initial-state">
            <div className="search-tips">
              <h3>How to Use</h3>
              <ul>
                <li>Select an artist from the dropdown</li>
                <li>Click "Get Songs" to view all their songs</li>
                <li>Browse through the artist's complete discography</li>
                <li>Play any song directly from the list</li>
              </ul>
              
              {artists.length > 0 && (
                <div className="artists-preview">
                  <h4>Available Artists ({artists.length})</h4>
                  <div className="artists-grid">
                    {artists.slice(0, 6).map(artist => (
                      <span key={artist.artist_id} className="artist-tag">
                        {artist.artistname}
                      </span>
                    ))}
                    {artists.length > 6 && (
                      <span className="artist-tag more">
                        +{artists.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsByArtist;