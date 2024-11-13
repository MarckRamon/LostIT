import { useState, useEffect } from 'react';
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
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Devices as ElectronicsIcon,
  Checkroom as ClothingIcon,
  Watch as AccessoriesIcon,
  MenuBook as BooksIcon,
  Build as ToolsIcon,
  ShoppingBag as BagsIcon,
  SportsBasketball as SportsIcon,
  Restaurant as FoodIcon,
  Inventory as MiscIcon,
  Inventory2 as ProductIcon,
  Warning as LowStockIcon,
  RemoveShoppingCart as OutOfStockIcon,
  LocalShipping as SupplierIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosInstance';

function Dashboard() {
  const { user, updateUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    suppliers: 5,
    stockValue: 0,
    unfulfilled: 0,
    received: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample category data
  const categoryData = [
    { name: 'Electronics', value: 30, icon: ElectronicsIcon },
    { name: 'Clothing', value: 25, icon: ClothingIcon },
    { name: 'Accessories', value: 20, icon: AccessoriesIcon },
    { name: 'Books', value: 15, icon: BooksIcon },
    { name: 'Tools', value: 10, icon: ToolsIcon },
  ];

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/items/getAllItems');
      const items = response.data;
      
      // Calculate stats from items
      const totalItems = items.length;
      const lowStock = items.filter(item => item.quantity < 10).length;
      const outOfStock = items.filter(item => item.quantity === 0).length;
      const stockValue = items.reduce((total, item) => total + (item.price * item.quantity), 0);

      setStats({
        totalItems,
        lowStock,
        outOfStock,
        suppliers: 5,
        stockValue,
        unfulfilled: 4,
        received: 1,
      });
      setError('');
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
      setError("Failed to fetch inventory statistics");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card sx={{ height: '100%', bgcolor: 'white', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ 
              bgcolor: `${color}.light`, 
              borderRadius: '50%', 
              width: 40, 
              height: 40, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 1
            }}>
              <Icon sx={{ color: `${color}.main` }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {loading ? '...' : value}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
          </Box>
          <IconButton size="small">
            <ArrowIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Inventory Management
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={ProductIcon}
            title="Total Items"
            value={stats.totalItems}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={LowStockIcon}
            title="Low Stock"
            value={stats.lowStock}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={OutOfStockIcon}
            title="Out of Stock"
            value={stats.outOfStock}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={SupplierIcon}
            title="Suppliers"
            value={stats.suppliers}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Stock Value and Categories Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.dark', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Value of Stock
              </Typography>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                ${stats.stockValue.toLocaleString()}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Stock Purchases
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Unfulfilled</Typography>
                <Typography>{stats.unfulfilled}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Received</Typography>
                <Typography>{stats.received}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Category Distribution
              </Typography>
              <Box sx={{ width: '100%' }}>
                {categoryData.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Icon sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 'auto' }}>
                          {category.value}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={category.value} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Message */}
      {error && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          {error}
        </Box>
      )}

      {/* Profile Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            updateUser({ ...user, ...userInfo });
            setOpenDialog(false);
          }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;