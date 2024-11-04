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

const categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Furniture' },
  { id: 3, name: 'Office Supplies' },
  { id: 4, name: 'Books' },
  { id: 5, name: 'Kitchen' },
  { id: 6, name: 'Others' },
];

const locations = [
  { id: 1, name: 'NGE' },
  { id: 2, name: 'GLE' },
  { id: 3, name: 'RTL' },
  { id: 4, name: 'ACAD' },
  { id: 5, name: 'LIBRARY' },
  { id: 6, name: 'ALLIED' },
  { id: 7, name: 'CANTEEN' },
  { id: 8, name: 'PARKING LOT' },
  { id: 9, name: 'GUARD HOUSE' },
  { id: 10, name: 'ACCOUNTING' },
];

const initialFormState = {
  itemName: '',
  category: '',
  description: '',
  location: '',
  status: 'Unclaimed',
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

  useEffect(() => {
    fetchItems();
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
      setItems(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    setError('');
    if (item) {
      setFormData({
        itemName: item.itemName || '',
        category: item.category?.categoryId || item.categoryId || '',
        description: item.description || '',
        location: item.location?.locationId || item.locationId || '',
        status: item.status || 'Unclaimed',
      });
      setEditingId(item.itemId);
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
        category: {
          categoryId: parseInt(formData.category)
        },
        location: {
          locationId: parseInt(formData.location)
        }
      };

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

const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : 'N/A';
};

const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === parseInt(locationId));
    return location ? location.name : 'N/A';
};

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
                  <TableCell>{item.itemId || 'N/A'}</TableCell>
                  <TableCell>{item.itemName || 'N/A'}</TableCell>
                  <TableCell>{getCategoryName(item.categoryId || item.category?.categoryId)}</TableCell>
                  <TableCell>{getLocationName(item.locationId || item.location?.locationId)}</TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                  <TableCell>{item.status || 'N/A'}</TableCell>
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
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="Unclaimed">Unclaimed</MenuItem>
              <MenuItem value="Claimed">Claimed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editingId ? 'Update Item' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;
