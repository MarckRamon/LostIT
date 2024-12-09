import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminList, setAdminList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admins/getAllAdmins')
      .then(response => setAdminList(response.data))
      .catch(error => console.error("Error fetching admin accounts:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const user = adminList.find(user => user.email === email);
    if (!user) {
      setError('Email not found');
      return;
    }
    setSuccess(`Your password is: ${user.password}`);
  };

  const toggleMusic = () => {
    const audio = document.getElementById('bgMusic');
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="login-container" style={{
      backgroundImage: 'url("/loginbg.jpg")', // Replace with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="background-overlay"></div>
      <div className="login-box">
        <div className="logo">Forgot Password</div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="login-button">Retrieve Password</button>
          <div className="links">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
      <div className="audio-controls" onClick={toggleMusic} title="Toggle music">
        🎵
      </div>
      <audio id="bgMusic" loop>
        <source src="/you.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
}

export default ForgotPassword;