import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Avatar,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function EditProfile() {
  const { user, updateUser } = useAuth();
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    profilePicture: "", // Base64 string for the profile picture
  });

  const [editState, setEditState] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        password: "",
        confirmPassword: "",
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const updateAdminDetails = async () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      if (!user || !user.adminId) {
        alert("Admin ID is missing!");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/admins/updateAdminDetails/${user.adminId}`,
        userInfo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        updateUser(response.data);
        alert("Profile updated successfully!");
        setEditState({
          firstName: false,
          lastName: false,
          email: false,
          phoneNumber: false,
          password: false,
        });
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(
        `Error updating profile: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.replace(/^data:image\/[a-z]+;base64,/, ""); // Remove metadata
      setUserInfo({ ...userInfo, profilePicture: base64String });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const toggleEditState = (field) => {
    setEditState({ ...editState, [field]: !editState[field] });
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "black" }}>
        My Profile
      </Typography>
      <Card sx={{ mb: 3, p: 2, display: "flex", alignItems: "center", boxShadow: 2 }}>
        <Avatar
          alt="Profile Picture"
          src={
            userInfo.profilePicture
              ? `data:image/jpeg;base64,${userInfo.profilePicture}`
              : "/path/to/default/avatar.jpg"
          }
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">
            {userInfo.firstName} {userInfo.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo.bio}
          </Typography>
        </Box>
        <Button variant="contained" component="label">
          Upload Picture
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Card>
      <Card sx={{ p: 2, boxShadow: 2 }}>
        <Grid container spacing={2}>
          {["firstName", "lastName", "email", "phoneNumber", "password"].map((field) => (
            <Grid item xs={12} md={6} key={field}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  type={field.includes("password") ? "password" : "text"}
                  label={field
                    .replace(/([A-Z])/g, " $1")
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={userInfo.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={updateAdminDetails}
            disabled={
              !Object.values(editState).some((isEditing) => isEditing) &&
              !userInfo.profilePicture
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
