import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Container, 
  Paper,
  Grid,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LostITLogo from '/LostITbg.png';
import { IconButton } from '@mui/material';

const categories = [
  'Electronics', 
  'Clothing', 
  'Accessories', 
  'Books', 
  'Tools'
];

function UserLostItemReport() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reportData = {
      itemName,
      category,
      location,
      description
    };

    console.log('Lost Item Report Submitted:', reportData);
    
    // Reset form fields after submission
    setItemName('');
    setCategory('');
    setLocation('');
    setDescription('');
  };

  const handleUserIconClick = () => {
    navigate('/login');
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: '#f3f3f3', 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden' 
      }}
    >
      {/* Fullscreen Blurred Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/win11.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)', 
          zIndex: 0,
          opacity: 0.7,
          backgroundColor: '#f0f0f0'
        }}
      />

      {/* Windows 11 Style Taskbar */}
      <Box 
        sx={{ 
          backgroundColor: 'white', 
          height: '48px', 
          display: 'flex', 
          alignItems: 'center', 
          px: 2, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 1 
        }}
      >
        <img 
          src={LostITLogo} 
          alt="LostIT Logo" 
          style={{ height: '40px', marginRight: '16px' }} 
        />
        <Box sx={{ flexGrow: 1 }}></Box>
        <IconButton 
          onClick={handleUserIconClick}
          sx={{ 
            color: '#0078D7',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)'
            }
          }}
        >
          <AccountCircleIcon />
        </IconButton>
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          flexGrow: 1, 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            position: 'relative', 
            zIndex: 1 
          }}
        >
          {/* Information Section */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                backgroundColor: 'rgba(255,255,255,0.9)',
                height: '100%',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3, 
                  color: '#0078D7', 
                  fontWeight: 'bold' 
                }}
              >
                LostIT: Reconnecting Students with Lost Items
              </Typography>
              
              <Typography variant="body1" paragraph>
                LostIT is a community-driven platform designed to help you recover lost items quickly and easily. Our mission is to reunite people with their valuable possessions through a simple, user-friendly reporting system.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ color: '#0078D7', mb: 2 }}>
                How It Works
              </Typography>
              
              <Typography variant="body2">
                1. Report a lost or found item with detailed information
              </Typography>
              <Typography variant="body2">
                2. Our system matches and notifies potential owners
              </Typography>
              <Typography variant="body2">
                3. Safely connect and recover your lost belongings
              </Typography>
            </Paper>
          </Grid>

          {/* Report Form Section */}
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  textAlign: 'center', 
                  color: '#0078D7' 
                }}
              >
                Report a Lost Item
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Item Name"
                  variant="outlined"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Location Found"
                  variant="outlined"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Provide additional details about the found item..."
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    backgroundColor: '#0078D7',
                    '&:hover': {
                      backgroundColor: '#005A9C'
                    }
                  }}
                >
                  Submit Lost Item Report
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Windows 11 Style Footer */}
      <Box 
        sx={{ 
          backgroundColor: 'white', 
          height: '48px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 -1px 3px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 1 
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2024 LostIT. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default UserLostItemReport;