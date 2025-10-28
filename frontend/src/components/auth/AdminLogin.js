import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    admin_id: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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
    setLoading(true);

    const result = await login(formData, true);
    
    if (result.success) {
      console.log('Admin logged in successfully');
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Admin Login</h2>
        <p className="auth-subtitle">Manage music library and system</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin ID:</label>
            <input
              type="text"
              name="admin_id"
              value={formData.admin_id}
              onChange={handleChange}
              required
              placeholder="Enter your admin ID"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-btn admin-btn">
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Are you a user? <Link to="/user/login">User Login</Link>
          </p>
          <p>
            Don't have an admin account? <Link to="/admin/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;