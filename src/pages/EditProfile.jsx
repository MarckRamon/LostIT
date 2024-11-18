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
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [editState, setEditState] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
  });

  // Fetch user details when component mounts
  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        password: user.password || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  // Update admin details
  const updateAdminDetails = async () => {
    try {
      // Send a PUT request with the user's ID in the URL
      const response = await axios.put(`/updateAdminDetails/${user.id}`, userInfo);
  
      if (response.status === 200) {
        updateUser(response.data); // Update context with new user data
        alert('Profile updated successfully!');
        setEditState({
          firstName: false,
          lastName: false,
          email: false,
          phoneNumber: false,
        });
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
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
          <Typography variant="h5">{userInfo.firstName}</Typography>
          <Typography variant="body2" color="text.secondary">{userInfo.bio}</Typography>
          <Typography variant="body2" color="text.secondary">sample, sample </Typography>
        </Box>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Card>
      <Card sx={{ p: 2, boxShadow: 2 }}>
        <Grid container spacing={2}>
          {['firstName', 'lastName', 'email', 'phoneNumber'].map((field) => (
            <Grid item xs={12} md={6} key={field}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
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
