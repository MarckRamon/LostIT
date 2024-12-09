import React, { useState, useEffect } from 'react';
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
import axiosInstance from '../axiosInstance';

function UserLostItemReport() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories/getAllCategories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories.");
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get('/api/locations/getAllLocations');
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Failed to fetch locations.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemName || !category || !location) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const reportData = {
        itemName: itemName.trim(),
        description: description.trim(),
        status: 'Reported',
        date: date || new Date().toISOString().split('T')[0],
        category: { categoryId: parseInt(category) },
        location: { locationId: parseInt(location) }
      };

      await axiosInstance.post('/api/items/addReportedItem', reportData);
      
      setSuccessMessage('Lost item reported successfully!');
      
      // Reset form fields after submission
      setItemName('');
      setCategory('');
      setLocation('');
      setDescription('');
      setDate('');
    } catch (error) {
      console.error('Error reporting lost item:', error);
      setError(error.response?.data?.message || "Error reporting item. Please try again.");
    } finally {
      setLoading(false);
    }
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
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center' 
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
          backgroundImage: 'url(/cat.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
          width: '100%',
          display: 'flex', 
          alignItems: 'center', 
          px: 2, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'absolute',
          top: 0,
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 96px)', // Subtract taskbar and footer heights
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            width: '100%',
            maxWidth: '1200px',
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
                backdropFilter: 'blur(10px)',
              }}
            >
              {error && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                  {error}
                </Box>
              )}

              {successMessage && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1 }}>
                  {successMessage}
                </Box>
              )}

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
                      <MenuItem 
                        key={cat.id || cat.categoryId} 
                        value={cat.id || cat.categoryId}
                      >
                        {cat.name || cat.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    label="Location"
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  >
                    {locations.map((loc) => (
                      <MenuItem 
                        key={loc.id || loc.locationId} 
                        value={loc.id || loc.locationId}
                      >
                        {loc.name || `${loc.locationBuilding} - ${loc.locationFloor}` || loc.locationName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Provide additional details about the lost item, where it's found or what it is about."
                />
                
                <TextField
                  fullWidth
                  label="Date Found"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    backgroundColor: '#0078D7',
                    '&:hover': {
                      backgroundColor: '#005A9C'
                    }
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Lost Item Report'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Windows 11 Style Footer */}
      <Box 
        sx={{ 
          backgroundColor: 'transparent', 
          height: '48px', 
          width: '100%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'absolute',
          bottom: 0,
          zIndex: 1 
        }}
      >
        <Typography variant="body2" color="black" fontStyle="bold" fontSize={18}>
          © 2024 LostIT. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default UserLostItemReport;