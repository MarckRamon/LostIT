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
  TaskAltOutlined as ProductIcon,
  Cancel as TrendingIcon,
  ArrowForward as ArrowIcon,
  Window as Windows,
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
    claimed: 5,
    totalItems: 0,
    unclaimed: 3,
    stockValue: 0,
    unfulfilled: 0,
    received: 0,
  });
  const [categoryData, setCategoryData] = useState([
    { name: 'Electronics', count: 0, icon: ElectronicsIcon },
    { name: 'Clothing', count: 0, icon: ClothingIcon },
    { name: 'Accessories', count: 0, icon: AccessoriesIcon },
    { name: 'Books', count: 0, icon: BooksIcon },
    { name: 'Tools', count: 0, icon: ToolsIcon },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      setLoading(true);
  
      // Fetch items data from API
      const itemsResponse = await axiosInstance.get('/api/items/getAllItems');
      const items = itemsResponse.data;
  
      // Calculate claimed, unclaimed, total items, and stock value
      const claimed = items.filter(item => item.status === 'Claimed').length;
      const totalItems = items.length;
      const unclaimed = items.filter(item => item.status === 'Unclaimed').length;
      const stockValue = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
      // Update stats with the calculated values
      setStats({
        claimed,
        totalItems,
        unclaimed,
        stockValue,
        unfulfilled: 4, // Assuming static values for these two
        received: 1,
      });
  
      const categoryCounts = {
        'Electronics': 0,
        'Clothing': 0,
        'Accessories': 0,
        'Books': 0,
        'Tools': 0
      };
  
      let maxItemCount = 0;
  
      // Count items per category
      items.forEach(item => {
        const categoryName = item.category ? 
          (item.category.categoryName || item.category.name) : 
          'Uncategorized';
        
        if (categoryCounts.hasOwnProperty(categoryName)) {
          categoryCounts[categoryName]++;
          maxItemCount = Math.max(maxItemCount, categoryCounts[categoryName]);
        }
      });
  
      // Update category data state
      const updatedCategoryData = categoryData.map(category => ({
        ...category,
        count: categoryCounts[category.name] || 0
      }));
  
      setCategoryData(updatedCategoryData);
      setMaxCount(maxItemCount);
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
        Dashboard Analytics
      </Typography>
    

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard 
            icon={ProductIcon}
            title="Claimed"
            value={stats.claimed}
            color="stop"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            icon={TrendingIcon}
            title="Unclaimed"
            value={stats.unclaimed}
            color="stop"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            icon={Windows}
            title="Total Items"
            value={stats.totalItems}
            color="stop"
          />
        </Grid>
      </Grid>

      {/* Stock Value and Categories Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.dark', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Recently Added Item
              </Typography>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                One Piece Chapter 1015
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Manga
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
                  const progressValue = maxCount > 0 ? (category.count / maxCount) * 100 : 0;
                  
                  return (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Icon sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 'auto' }}>
                          {loading ? '...' : `${category.count} items`}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressValue} 
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs">
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Full Name" value={userInfo.fullName} onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })} />
          <TextField fullWidth label="Email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="Username" value={userInfo.username} onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => updateUser(userInfo)} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
