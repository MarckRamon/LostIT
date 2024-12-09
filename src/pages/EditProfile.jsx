import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Avatar,
  TextField,
  IconButton,
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function EditProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [userInfo, setUserInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    profilePicture: null,
  });

  const [editState, setEditState] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Fetch user details when component mounts
  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        password: '',
        confirmPassword: '',
        phoneNumber: user.phoneNumber || '',
        profilePicture: user.profilePicture || null,
      });

      // Fetch and set profile picture
      fetchProfilePicture();
    }
  }, [user]);

  const fetchProfilePicture = async () => {
    try {
      if (user && user.adminId) {
        const response = await axios.get(`http://localhost:8080/api/admins/getProfilePicture/${user.adminId}`);
        setProfilePicturePreview(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post(
          `http://localhost:8080/api/admins/uploadProfilePicture/${user.adminId}`, 
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Read and preview the uploaded image
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicturePreview(reader.result);
        };
        reader.readAsDataURL(file);

        alert('Profile picture uploaded successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture');
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      if (user && user.adminId) {
        await axios.delete(`http://localhost:8080/api/admins/removeProfilePicture/${user.adminId}`);
        
        // Removes profile pic
        setProfilePicturePreview(null);
        
        // Update the user context
        const updatedUser = { ...user, profilePicture: null };
        updateUser(updatedUser);
        
        alert('Profile picture removed successfully!');
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture');
    }
  };
  
  const updateAdminDetails = async () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      if (!user || !user.adminId) {
        alert('Admin ID is missing!');
        return;
      }
  
      const response = await axios.put(
        `http://localhost:8080/api/admins/updateAdminDetails/${user.adminId}`,
        userInfo
      );
  
      if (response.status === 200) {
        updateUser(response.data);
        alert('Profile updated successfully!');
        setEditState({
          firstName: false,
          lastName: false,
          email: false,
          phoneNumber: false,
          password: false,
        });
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const toggleEditState = (field) => {
    setEditState({ ...editState, [field]: !editState[field] });
  };

  return (
    <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? '#121212' : 'f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>  
        My Profile
      </Typography>
      {/* Profile Header */}
      <Card sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center', boxShadow: 2 }}>
        <Box sx={{ position: 'relative', mr: 3 }}>
          <Avatar
            alt="Profile Picture"
            src={profilePicturePreview || "/path/to/default-avatar.jpg"}
            sx={{ width: 80, height: 80 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-picture-upload"
            type="file"
            onChange={handleProfilePictureUpload}
          />
          <label htmlFor="profile-picture-upload">
            <IconButton 
              component="span" 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                bgcolor: 'primary.main', 
                color: 'white', 
                '&:hover': { bgcolor: 'primary.dark' },
                width: 30,
                height: 30 
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </label>

          {profilePicturePreview && (
            <IconButton 
              onClick={handleRemoveProfilePicture}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' },
                width: 30,
                height: 30
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}

        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">{userInfo.firstName} {userInfo.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">{userInfo.username}</Typography>
        </Box>
      </Card>
      <Card sx={{ p: 2, boxShadow: 2 }}>
        <Grid container spacing={2}>
          {['firstName', 'lastName', 'email', 'phoneNumber', 'password'].map((field) => (
            <Grid item xs={12} md={6} key={field}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  type={field.includes('password') ? 'password' : 'text'}
                  label={field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={userInfo[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  disabled={!editState[field]}
                />
                <IconButton onClick={() => toggleEditState(field)} sx={{ ml: 1 }}>
                  {editState[field] ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>
              {field === 'password' && editState[field] && (
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  value={userInfo.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={updateAdminDetails}
            sx={{ px: 4 }}
          >
            Save Changes
          </Button>
        </Box>
      </Card>

      {/* New Navigation Box */}
      <Card sx={{ 
        mt: 3, 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: 2 
      }}>
        <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>
          Need to add a new admin?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/register')}
          >
            Register New Admin
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default EditProfile;