import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { IconButton } from '@mui/material';
import { AddCircle, Delete, Check, Close } from '@mui/icons-material';
import axiosInstance from '../axiosInstance';

function ItemReport() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    item: null,
    action: null
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchLocations();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/items/getAllItems');
      setItems(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferItem = async (item) => {
    try {
      await axiosInstance.post(`/api/items/transferToInventory/${item.itemId}`, {
        status: 'Unclaimed'
      });
      // Refresh the items list
      fetchItems();
      handleCloseConfirmationDialog();
    } catch (error) {
      console.error("Error accepting item:", error);
      setError("Failed to accept item. Please try again.");
    }
  };

  const handleDeclineItem = async (item) => {
    try {
      await axiosInstance.delete(`/api/items/deleteItem/${item.itemId}`);
      // Refresh the items list
      fetchItems();
      handleCloseConfirmationDialog();
    } catch (error) {
      console.error("Error declining item:", error);
      setError("Failed to decline item. Please try again.");
    }
  };

  const handleOpenConfirmationDialog = (item, action) => {
    setConfirmationDialog({
      open: true,
      item,
      action
    });
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialog({
      open: false,
      item: null,
      action: null
    });
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

  const filteredItems = items.filter(item => {
    const matchesSearchTerm =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' 
      ? true 
      : item.category?.id === Number(selectedCategory) || 
        item.category?.categoryId === Number(selectedCategory);

    const matchesLocation = selectedLocation === '' 
      ? true 
      : item.location?.id === Number(selectedLocation) || 
        item.location?.locationId === Number(selectedLocation);

    const isReportedStatus = item.status === 'Reported';

    return matchesSearchTerm && matchesCategory && matchesLocation && isReportedStatus;
  });

  const generateReportSummary = () => {
    const totalItems = filteredItems.length;
    const reportedItems = filteredItems.length;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Chip 
          label={`Total Items: ${totalItems}`} 
          color="primary" 
          variant="outlined" 
          sx={{ mr: 2 }} 
        />
        <Chip 
          label={`Reported Items: ${reportedItems}`} 
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
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">
              <em>All Categories</em>
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
            value={selectedLocation || ''}
            onChange={(e) => setSelectedLocation(e.target.value)}
            label="Location"
          >
            <MenuItem value="">
              <em>All Locations</em>
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
              <TableCell>Date Added</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {loading ? 'Loading...' : 'No reported items found'}
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
                  <TableCell>{item.date || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="success" 
                      onClick={() => handleOpenConfirmationDialog(item, 'accept')}
                      title="Accept Item"
                    >
                      <Check />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenConfirmationDialog(item, 'decline')}
                      title="Decline Item"
                    >
                      <Close />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.open}
        onClose={handleCloseConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmationDialog.action === 'accept' 
            ? 'Accept Item' 
            : 'Decline Item'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationDialog.action === 'accept'
              ? 'Are you sure you want to accept this item and transfer it to inventory?'
              : 'Are you sure you want to decline this item? It will be deleted.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (confirmationDialog.action === 'accept') {
                handleTransferItem(confirmationDialog.item);
              } else {
                handleDeclineItem(confirmationDialog.item);
              }
            }} 
            color={confirmationDialog.action === 'accept' ? 'success' : 'error'} 
            autoFocus
          >
            {confirmationDialog.action === 'accept' ? 'Accept' : 'Decline'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ItemReport;