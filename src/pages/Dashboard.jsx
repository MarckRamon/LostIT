import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, updateUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  // Mock data for dashboard
  const stats = {
    totalItems: 150,
    categories: 6,
    lowStock: 8,
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateProfile = () => {
    updateUser({ ...user, ...userInfo });
    handleCloseDialog();
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Welcome, {user?.fullName || user?.username}
                </Typography>
                <Typography color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={handleOpenDialog}>
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalItems}</Typography>
                  <Typography color="text.secondary">Total Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.categories}</Typography>
                  <Typography color="text.secondary">Categories</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.lowStock}</Typography>
                  <Typography color="text.secondary">Low Stock Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={userInfo.fullName}
              onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <TextField
              label="Username"
              fullWidth
              value={userInfo.username}
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;