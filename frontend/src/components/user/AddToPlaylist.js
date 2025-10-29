import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playService } from '../../services/playService';
import { songService } from '../../services/songService';
import '../../styles/Playlist.css';

const AddToPlaylist = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { playlistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available songs - you can implement search functionality here
    const fetchSongs = async () => {
      try {
        // TODO: Implement API call to get available songs
        // const mockSongs = [
        //   { song_id: 1, title: 'TestSong', artistname: 'Yashwanth R' },
        //   { song_id: 2, title: 'Song Two', artistname: 'Artist B' },
        //   { song_id: 3, title: 'Song Three', artistname: 'Artist C' },
        //   { song_id: 4, title: 'Song Four', artistname: 'Artist D' },
        //   { song_id: 5, title: 'Song Five', artistname: 'Artist E' }
        // ];
        const response = await songService.getAllSongs();
        if (response.success) {
          setSongs(response.songs || []);
        } else {
          setError(response.error || 'Failed to load songs');
        }
      } catch (err) {
        setError('Failed to load songs');
      }
    };

    fetchSongs();
  }, []);

  const handleSongSelect = (songId) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleAddSongs = async () => {
    if (selectedSongs.length === 0) {
      setError('Please select at least one song');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Add each selected song to the playlist
      for (const songId of selectedSongs) {
        const result = await playService.addSongToPlaylist({
            playlistId,
            songId
            });

        if (!result.success) {
          throw new Error(result.error || 'Failed to add song');
        }
      }

      setSuccess(`Successfully added ${selectedSongs.length} songs to playlist!`);
      setSelectedSongs([]);
      setTimeout(() => {
        navigate(`/user/playlist/${playlistId}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-playlist-container">
      <div className="add-to-playlist-header">
        <h1>Add Songs to Playlist</h1>
        <p>Select songs to add to your playlist</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="songs-selection">
        <div className="selection-header">
          <h3>Available Songs</h3>
          <span>{selectedSongs.length} selected</span>
        </div>

        <div className="songs-list">
          {songs.map(song => (
            <div key={song.song_id} className="song-selection-item">
              <label className="song-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song.song_id)}
                  onChange={() => handleSongSelect(song.song_id)}
                />
                <div className="song-info">
                  <h4>{song.title}</h4>
                  <p>{song.artistname}</p>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button 
            onClick={handleAddSongs}
            disabled={loading || selectedSongs.length === 0}
            className="add-songs-btn"
          >
            {loading ? 'Adding...' : `Add ${selectedSongs.length} Songs`}
          </button>
          <button 
            onClick={() => navigate(`/user/playlist/${playlistId}`)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylist;