import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import UserLogin from './components/auth/UserLogin';
import UserRegister from './components/auth/UserRegister';
import AdminLogin from './components/auth/AdminLogin';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AddArtist from './components/admin/AddArtist';
import AddSong from './components/admin/AddSong';
import AddAlbum from './components/admin/AddAlbum';
import SearchSongs from './components/user/SearchSongs';
import SongsByArtist from './components/user/SongsByArtist'; // Add this import
import Home from './components/Home';
import CreatePlaylist from './components/user/CreatePlaylist';
import UserPlaylists from './components/user/UserPlaylists';
import PlaylistSongs from './components/user/PlaylistsSongs';
import AddToPlaylist from './components/user/AddToPlaylist';
import AdminRegister from './components/auth/AdminRegister';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-artist" element={<AddArtist />} />
              <Route path="/admin/add-song" element={<AddSong />} />
              <Route path="/admin/add-album" element={<AddAlbum />} />
              <Route path="/user/search-songs" element={<SearchSongs />} />
              <Route path="/user/songs-by-artist" element={<SongsByArtist />} />
              <Route path="/user/create-playlist" element={<CreatePlaylist />} />
              <Route path="/user/playlists" element={<UserPlaylists />} />
              <Route path="/user/playlist/:playlistId" element={<PlaylistSongs />} />
              <Route path="/user/add-to-playlist/:playlistId" element={<AddToPlaylist />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;