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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axiosInstance from '../axiosInstance';

const initialFormState = {
  itemName: '',
  category: '',
  description: '',
  location: '',
  status: 'Unclaimed',
  dateAdded: '',
};

function Inventory() {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/items/getAllItems');
      const transformedItems = response.data.map(item => ({
        itemId: item.itemId || item.id,
        itemName: item.itemName,
        categoryId: item.categoryId || (item.category && item.category.id),
        locationId: item.locationId || (item.location && item.location.id),
        description: item.description,
        status: item.status,
        dateAdded: item.dateAdded || '',
        category: item.category,
        location: item.location
      }));
      setItems(transformedItems);
      setError('');
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories/getAllCategories');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories.");
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get('/api/locations/getAllLocations');
      console.log('Locations response:', response.data);
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

  const handleOpenDialog = (item = null) => {
    setError('');
    if (item) {
      setFormData({
        itemName: item.itemName || '',
        category: item.categoryId || item.category?.id || '',
        description: item.description || '',
        location: item.locationId || item.location?.id || '',
        status: item.status || 'Unclaimed',
        dateAdded: item.dateAdded || '',
      });
      setEditingId(item.id || item.itemId);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormState);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.itemName || !formData.category || !formData.location) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData = {
        itemName: formData.itemName.trim(),
        description: formData.description.trim(),
        status: formData.status,
        dateAdded: formData.dateAdded,
        category: { categoryId: parseInt(formData.category) },
        location: { locationId: parseInt(formData.location) }
      };

      console.log('Submitting data:', requestData);

      if (editingId) {
        await axiosInstance.put(`/api/items/updateItem/${editingId}`, requestData);
        setSuccessMessage('Item updated successfully!');
      } else {
        await axiosInstance.post('/api/items/addItem', requestData);
        setSuccessMessage('Item added successfully!');
      }

      await fetchItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving item:", error);
      setError(error.response?.data?.message || "Error saving item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/api/items/deleteItem/${itemId}`);
        await fetchItems();
        setSuccessMessage('Item deleted successfully!');
      } catch (error) {
        console.error("Error deleting item:", error);
        setError(error.response?.data?.message || "Error deleting item. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {successMessage && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1 }}>
          {successMessage}
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          {error}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search items..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Add New Item
        </Button>
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
              <TableCell>Actions</TableCell>
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
              <TableCell>{getLocationName(item)}</TableCell>
              <TableCell>{item.description || 'N/A'}</TableCell>
              <TableCell>{item.status || 'N/A'}</TableCell>
              <TableCell>{item.dateAdded || 'N/A'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(item)} disabled={loading}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.itemId)} disabled={loading}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            fullWidth
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            required
            sx={{ mb: 2, mt: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={formData.category}
              onChange={(e) => {
                console.log('Selected category:', e.target.value);
                setFormData({ ...formData, category: e.target.value });
              }}
              required
              label="Category"
            >
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
          <TextField
            label="Description"
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              value={formData.location}
              onChange={(e) => {
                console.log('Selected location:', e.target.value);
                setFormData({ ...formData, location: e.target.value });
              }}
              required
              label="Location"
            >
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Unclaimed">Unclaimed</MenuItem>
              <MenuItem value="Claimed">Claimed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date Added"
            type="date"
            value={formData.dateAdded}
            onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {editingId ? 'Save Changes' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;