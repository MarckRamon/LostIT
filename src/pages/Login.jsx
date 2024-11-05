import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [adminList, setAdminList] = useState([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Fetch admin accounts from backend
    axios.get('http://localhost:8080/api/admins/getAllAdmins')
      .then(response => setAdminList(response.data))
      .catch(error => console.error("Error fetching admin accounts:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = adminList.find(user => user.username === formData.username);
    if (!user) {
      setError('Email not found');
      return;
    }
    if (user.password !== formData.password) {
      setError('Invalid password');
      return;
    }

    login({ username: user.username });
    document.getElementById('bgMusic').play();
    navigate('/');
  };

  const toggleMusic = () => {
    const audio = document.getElementById('bgMusic');
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const toggleVideo = () => {
    const video = document.getElementById('bgVideo');
    if (video.paused) video.play();
    else video.pause();
  };

  return (
    <div className="login-container">
      <video className="video-background" autoPlay muted loop id="bgVideo">
        <source src="/livebg.mp4" type="video/mp4" />
      </video>
      <div className="background-overlay"></div>

      <div className="login-box">
        <div className="logo">Login</div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">Login</button>

          <div className="links">
            <Link to="/register">Register now</Link>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </form>
      </div>

      <div className="audio-controls" onClick={toggleMusic} title="Toggle music">
        🎵
      </div>

      <div className="video-controls" onClick={toggleVideo} title="Toggle video">
        🎬
      </div>

      <audio id="bgMusic" loop>
        <source src="/you.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Login;
