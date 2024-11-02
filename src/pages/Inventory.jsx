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
  status: 'Active',
};

function Inventory() {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get('/api/items/getAllItems');
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenDialog = (item = null) => {
    setError('');
    if (item) {
      setFormData({
        itemName: item.itemName,
        category: item.category?.categoryId || '',
        description: item.description || '',
        location: item.location?.locationId || '',
        status: item.status || 'Active',
      });
      setEditingId(item.id);
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
        itemName: formData.itemName,
        description: formData.description || '',
        status: formData.status,
        category: {
          categoryId: parseInt(formData.category)
        },
        location: {
          locationId: parseInt(formData.location)
        }
      };

      if (editingId) {
        await axiosInstance.put(`/api/items/updateItemDetails?id=${editingId}`, requestData);
      } else {
        await axiosInstance.post('/api/items/addItem', requestData);
      }

      await fetchItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving item:", error.response || error);
      setError(error.response?.data?.message || "Error saving item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axiosInstance.delete(`/api/items/deleteItem/${id}`);
        await fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        setError(error.response?.data?.message || "Error deleting item. Please try again.");
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : '';
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === parseInt(locationId));
    return location ? location.name : '';
  };

  return (
    <Box>
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
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{getCategoryName(item.category?.categoryId)}</TableCell>
                <TableCell>{getLocationName(item.location?.locationId)}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {error && (
              <Box sx={{ color: 'error.main', mb: 2 }}>
                {error}
              </Box>
            )}
            <TextField
              label="Item Name"
              required
              fullWidth
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              error={!formData.itemName}
            />
            <FormControl fullWidth required error={!formData.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required error={!formData.location}>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                label="Location"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
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
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            variant="contained"
          >
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;