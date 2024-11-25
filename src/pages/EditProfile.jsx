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
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you use an AuthContext

function EditProfile() {
  const { user, updateUser } = useAuth(); // Access current user and updateUser from AuthContext
  const [userInfo, setUserInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [editState, setEditState] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  // Fetch user details when component mounts
  useEffect(() => {
    console.log("Current user in EditProfile:", user); // Debug log
    
    if (user) {
      console.log("Setting user info with:", user); // Debug log
      setUserInfo({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        password: '',
        confirmPassword: '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  
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
  
      
      console.log("Current user:", user);
      console.log("User info being sent:", userInfo);
      console.log("Admin ID being used:", user.adminId);
  
      const response = await axios.put(
        `http://localhost:8080/api/admins/updateAdminDetails/${user.adminId}`,  // added full URL kay di mogana basta di
        userInfo
      );
  
      console.log("Response received:", response);  
  
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
      // More detailed error logging
      console.error('Full error object:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
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
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
        My Profile
      </Typography>
      {/* Profile Header */}
      <Card sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center', boxShadow: 2 }}>
        <Avatar
          alt="Anzy"
          src="/path/to/avatar.jpg"
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">{userInfo.firstName} {userInfo.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">{userInfo.bio}</Typography>
        </Box>
        <IconButton>
          <EditIcon />
        </IconButton>
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
            </Grid>
          ))}
          {/* Confirm Password Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={userInfo.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={updateAdminDetails}
            disabled={
              !Object.values(editState).some((isEditing) => isEditing) // Enable Save Changes only if any field is editable
            }
          >
            Save Changes
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default EditProfile;