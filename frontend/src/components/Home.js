
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to MusicVault</h1>
        <p>Your ultimate music management system</p>
        
        {!isAuthenticated ? (
          <div className="auth-options">
            <div className="option-card">
              <h3>🎵 For Users</h3>
              <p>Discover music, create playlists, and enjoy your favorite tracks</p>
              <div className="option-actions">
                <Link to="/user/login" className="btn primary">User Login</Link>
                <Link to="/user/register" className="btn secondary">User Register</Link>
              </div>
            </div>
            
            <div className="option-card admin-card">
              <h3>⚙️ For Admins</h3>
              <p>Manage music library, artists, albums, and system content</p>
              <div className="option-actions">
                <Link to="/admin/login" className="btn primary">Admin Login</Link>
                <Link to="/admin/register" className="btn secondary">Admin Register</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-back">
            <h2>Welcome back, {user.username}! 🎵</h2>
            <p>You are logged in as {user.admin_id ? 'an Administrator' : 'a User'}</p>
            <Link 
              to={user.admin_id ? '/admin/dashboard' : '/user/dashboard'} 
              className="btn primary"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;