import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Person,
  Wifi,
  VolumeUp,
  Battery90,
  NavigateNext,
  NavigateBefore,
  AccessibilityNew,
  Email,
  Phone,
  Lock,
} from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/admins/createAdmin', {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const steps = [
    {
      label: 'Personal Info',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          icon: <Person />,
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          icon: <Person />,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          icon: <Email />,
        },
      ],
    },
    {
      label: 'Account Details',
      fields: [
        {
          name: 'username',
          label: 'Username',
          type: 'text',
          icon: <Person />,
        },
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          type: 'tel',
          icon: <Phone />,
        },
      ],
    },
    {
      label: 'Security',
      fields: [
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          icon: <Lock />,
        },
        {
          name: 'confirmPassword',
          label: 'Confirm Password',
          type: 'password',
          icon: <Lock />,
        },
      ],
    },
  ];

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
        id="bgVideo"
      >
        <source src="/win11.mp4" type="video/mp4" />
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
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
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
              mb: 3,
            }}
          >
            Create Account
          </Typography>

          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              width: '100%',
              mb: 3,
              '& .MuiStepLabel-label': {
                color: 'white',
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.3)',
                '&.Mui-active': {
                  color: 'white',
                },
                '&.Mui-completed': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

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

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
            <Stack spacing={3}>
              {steps[activeStep].fields.map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  label={field.label}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) => 
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  required
                  variant="standard"
                  InputProps={{
                    startAdornment: field.icon,
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
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      mr: 1,
                    },
                  }}
                />
              ))}

              <Stack direction="row" spacing={2}>
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    variant="contained"
                    startIcon={<NavigateBefore />}
                    sx={{
                      flex: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    Back
                  </Button>
                )}
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth={activeStep === 0}
                    endIcon={<NavigateNext />}
                    sx={{
                      flex: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    Create Account
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    fullWidth={activeStep === 0}
                    endIcon={<NavigateNext />}
                    sx={{
                      flex: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Stack>

              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Already have an account? Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
        
        <Stack
          direction="row"
          spacing={2}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
          }}
        >
        </Stack>
      </Container>
    </Box>
  );
};

export default Register;