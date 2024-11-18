import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
  const [showLoginForm, setShowLoginForm] = useState(false); // Initially starts with the lock screen
  const [showPasswordField, setShowPasswordField] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/admins/getAllAdmins')
      .then((response) => setAdminList(response.data))
      .catch((error) => console.error('Error fetching admin accounts:', error));
  }, []);

  const unlockLoginForm = () => setShowLoginForm(true); // Unlocks the login screen

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!showPasswordField) {
      const user = adminList.find((user) => user.username === formData.username);
      if (!user) {
        setError('User not found');
        return;
      }
      setShowPasswordField(true); // Show password field once username is valid
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
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#000', overflow: 'hidden' }}>
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
        {!showLoginForm ? (
          // Lock screen view
          <Fade in={!showLoginForm}>
            <Stack
              spacing={1}
              alignItems="center"
              sx={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '4rem', sm: '6rem' },
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 3, bgcolor: 'white', color: '#000' }}
                onClick={unlockLoginForm}
              >
                Unlock
              </Button>
            </Stack>
          </Fade>
        ) : (
          // Login form view
          <Fade in={showLoginForm}>
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

              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  mt: 2,
                  textAlign: 'center',
                  fontFamily: 'Segoe UI, sans-serif',
                }}
              >
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ color: 'lightblue' }}>
                  Sign up
                </RouterLink>
              </Typography>
            </Stack>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default Login;