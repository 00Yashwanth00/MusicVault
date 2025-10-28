import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { songService } from '../../services/songService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Search.css';

const SearchSongs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const result = await songService.searchSongs(searchTerm.trim());
      
      if (result.success) {
        setSearchResults(result.songs || []);
        if (result.songs.length === 0) {
          setError('No songs found matching your search');
        }
      } else {
        setError(result.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError('');
    setHasSearched(false);
  };

  const handlePlaySong = (song) => {
    // For now, just log the play action
    // In future, this would integrate with audio player
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

  return (
    <div className="search-container">
      <div className="search-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Search Songs</h1>
        <p>Find your favorite tracks by title</p>
      </div>

      <div className="search-content">
        {/* Search Form */}
        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter song title to search..."
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !searchTerm.trim()}
                className="search-btn"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleClearSearch}
                className="clear-btn"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`message ${searchResults.length === 0 ? 'error' : 'warning'}`}>
            {error}
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <div className="search-results">
            <div className="results-header">
              <h2>
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} song${searchResults.length !== 1 ? 's' : ''}`
                  : 'No Results'
                }
              </h2>
              {searchResults.length > 0 && (
                <span className="results-count">{searchResults.length} items</span>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="songs-list">
                {searchResults.map((song) => (
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

            {searchResults.length === 0 && !error && (
              <div className="no-results">
                <div className="no-results-icon">🎵</div>
                <h3>No songs found</h3>
                <p>Try different keywords or check the spelling</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Searching for songs...</p>
          </div>
        )}

        {/* Initial State - Before Search */}
        {!hasSearched && !loading && (
          <div className="initial-state">
            <div className="search-tips">
              <h3>Search Tips</h3>
              <ul>
                <li>Search by song title</li>
                <li>Try partial titles (e.g., "love" for "Love Story")</li>
                <li>Search is case-insensitive</li>
                <li>You can search by any word in the title</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSongs;