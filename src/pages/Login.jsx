import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Avatar,
  InputAdornment,
  Stack,
  Fade,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, NavigateNext } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [adminList, setAdminList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/admins/getAllAdmins')
      .then((response) => setAdminList(response.data))
      .catch((error) => console.error('Error fetching admin accounts:', error));
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!showPasswordField) {
      const user = adminList.find((user) => user.username === formData.username);
      if (!user) {
        setError('User not found');
        return;
      }
      setShowPasswordField(true);
      return;
    }

    const user = adminList.find((user) => user.username === formData.username);
    if (user.password !== formData.password) {
      setError('Wrong password');
      return;
    }

    login({ username: user.username });
    navigate('/');
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setFormData({ ...formData, username });
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        minHeight: '100vh',
        bgcolor: '#000',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Background Video */}
      <video
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/ph.mp4" type="video/mp4" />
      </video>

      {/* Blur Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
      />

      <Container maxWidth="sm" sx={{ height: '100vh', position: 'relative' }}>
        {/* Time and Date Display */}
        <Fade in={!showLoginForm} timeout={800}>
          <Stack
            spacing={1}
            alignItems="center"
            sx={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              display: showLoginForm ? 'none' : 'flex',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '4rem', sm: '6rem' },
                fontWeight: 600,
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.3)',
                fontFamily: 'Segoe UI Light, sans-serif',
              }}
            >
              {formatTime()}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 300,
                textShadow: '0 0 10px rgba(0,0,0,0.3)',
                fontFamily: 'Segoe UI, sans-serif',
              }}
            >
              {formatDate()}
            </Typography>
          </Stack>
        </Fade>

        {/* Login Form */}
        <Fade in={showLoginForm} timeout={800}>
          <Stack
            spacing={3}
            alignItems="center"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '400px',
              p: 3,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
              display: showLoginForm ? 'flex' : 'none',
            }}
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: 'transparent',
                border: '2px solid white',
                mb: 2,
              }}
            >
              <Person sx={{ fontSize: 48, color: 'white' }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 300,
                fontFamily: 'Segoe UI, sans-serif',
              }}
            >
              {formData.username || 'Welcome'}
            </Typography>

            {error && (
              <Typography
                color="error"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                {error}
              </Typography>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  required
                  disabled={showPasswordField}
                  variant="standard"
                  sx={{
                    '& .MuiInput-root': {
                      color: 'white',
                      '&:before': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1,
                      },
                    },
                  }}
                />

                {showPasswordField && (
                  <TextField
                    fullWidth
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    variant="standard"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInput-root': {
                        color: 'white',
                        '&:before': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover:not(.Mui-disabled):before': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<NavigateNext />}
                  sx={{
                    mt: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {showPasswordField ? 'Sign in' : 'Next'}
                </Button>
              </Stack>
            </form>

            <Stack 
              direction="row" 
              justifyContent="space-between" 
              sx={{ width: '100%', mt: 2 }}
            >
              <Button
                component={RouterLink}
                to="/register"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Sign up
              </Button>
              <Button
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Forgot Password
              </Button>
            </Stack>
          </Stack>
        </Fade>

        {/* Click to unlock */}
        {!showLoginForm && (
          <Typography
            onClick={() => setShowLoginForm(true)}
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 300,
              textAlign: 'center',
              width: '100%',
              fontFamily: 'Segoe UI, sans-serif',
            }}
          >
            Click to unlock or press space
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Login;