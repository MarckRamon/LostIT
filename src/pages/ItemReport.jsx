import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip
} from '@mui/material';
import axiosInstance from '../axiosInstance';

function ItemReport() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchLocations();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/items/getAllItems');
      const reportedItems = response.data.filter(item => item.isReported);
      setItems(transformedItems);
      setError('');
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await axiosInstance.delete(`/api/items/deleteItem/${itemToDelete.itemId}`);
      setItems(items.filter(item => item.itemId !== itemToDelete.itemId));
      setOpenDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleTransferToInventory = async (item) => {
    try {
      await axiosInstance.post(`/api/items/transferToInventory/${item.itemId}`);
      // Refresh the items list
      fetchItems();
    } catch (error) {
      console.error("Error transferring item:", error);
      setError("Failed to transfer item to inventory. Please try again.");
    }
  };

  
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

  const getCategoryName = (item) => {
    if (!item.category) return 'N/A';
    return item.category.categoryName || 'N/A';
  };

  const getLocationName = (item) => {
    if (!item.location) return 'N/A';
    return item.location.locationBuilding && item.location.locationFloor
      ? `${item.location.locationBuilding} - ${item.location.locationFloor}`
      : 'N/A';
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value === '' ? null : value);
  };

  const handleLocationChange = (event) => {
    const value = event.target.value;
    setSelectedLocation(value === '' ? null : value);
  };

  const filteredItems = items.filter(item => {
    const matchesSearchTerm =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === null || selectedCategory === ''
      ? true
      : Number(item.categoryId) === Number(selectedCategory);

    const matchesLocation = selectedLocation === null || selectedLocation === ''
      ? true
      : Number(item.locationId) === Number(selectedLocation);

    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;

    return matchesSearchTerm && matchesCategory && matchesLocation && matchesStatus;
  });

  const generateReportSummary = () => {
    const totalItems = filteredItems.length;
    const turnedInItems = filteredItems.filter(item => item.status === 'Turned In').length;
    const notTurnedInItems = filteredItems.filter(item => item.status === 'Not Turned In').length;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Chip 
          label={`Total Items: ${totalItems}`} 
          color="primary" 
          variant="outlined" 
          sx={{ mr: 2 }} 
        />
        <Chip 
          label={`Claimed Items: ${turnedInItems}`} 
          color="success" 
          variant="outlined" 
          sx={{ mr: 2 }} 
        />
        <Chip 
          label={`Unclaimed Items: ${notTurnedInItems}`} 
          color="warning" 
          variant="outlined" 
        />
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Item Report</Typography>

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          {error}
        </Box>
      )}

      {generateReportSummary()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search items"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <FormControl sx={{ minWidth: 120, mx: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory || null}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id || category.categoryId}
                value={category.id || category.categoryId}
              >
                {category.name || category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, mx: 1 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={selectedLocation || null}
            onChange={handleLocationChange}
            label="Location"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {locations.map((location) => (
              <MenuItem
                key={location.id || location.locationId}
                value={location.id || location.locationId}
              >
                {location.name || `${location.locationBuilding} - ${location.locationFloor}` || location.locationName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, mx: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Unclaimed">Unclaimed</MenuItem>
            <MenuItem value="Claimed">Claimed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item ID</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {loading ? 'Loading...' : 'No items found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.itemName || 'N/A'}</TableCell>
                  <TableCell>{getCategoryName(item)}</TableCell>
                  <TableCell>
                    {item.location 
                      ? `${item.location.locationBuilding} - ${item.location.locationFloor}` 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                  <TableCell>{item.status || 'N/A'}</TableCell>
                  <TableCell>{item.date || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleTransferToInventory(item)}
                      title="Transfer to Inventory"
                    >
                      <AddCircle />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => {
                        setItemToDelete(item);
                        setOpenDeleteDialog(true);
                      }}
                      title="Delete Item"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
    </Box>
  );
}

export default ItemReport;