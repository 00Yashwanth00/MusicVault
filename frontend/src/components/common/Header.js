
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>🎵 MusicVault</h1>
        </Link>
        
        <nav className="nav">
          {isAuthenticated ? (
            <div className="nav-auth">
              <span className="user-info">
                Welcome, {user.username} {user.is_admin ? '(Admin)' : ''}
              </span>
              <Link 
                to={user.is_admin ? '/admin/dashboard' : '/user/dashboard'} 
                className="nav-link"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-guest">
              <Link to="/user/login" className="nav-link">User Login</Link>
              <Link to="/admin/login" className="nav-link">Admin Login</Link>
              <Link to="/user/register" className="nav-link">User Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;