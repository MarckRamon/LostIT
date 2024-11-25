import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

const ClaimLog = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studEmail: "",
    dateClaimed: "",
    itemId: "",
  });
  const [itemOptions, setItemOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
    fetchClaims();
  }, []);

  useEffect(() => {
    const filtered = claims.filter(claim => 
      claim.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.studEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.item?.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClaims(filtered);
  }, [searchTerm, claims]);

  const fetchItems = async () => {
    try {
      const response = await api.get("/api/items/getAllItems");
      console.log('Items fetched:', response.data);
      if (Array.isArray(response.data)) {
        const formattedItems = response.data.map(item => ({
          value: item.itemId,
          label: item.itemName
        }));
        setItemOptions(formattedItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to load items");
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/claims/getAllClaims");
      console.log('Claims fetched:', response.data);
      if (response.data) {
        setClaims(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      setError("Failed to load claims");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.itemId) {
      setError('Please select an item');
      return;
    }

    try {
      const response = await api.post(
        `/api/claims/createClaim/${formData.itemId}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          studEmail: formData.studEmail,
          dateClaimed: formData.dateClaimed
        }
      );
      
      console.log('Claim created:', response.data);
      
      setOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        studEmail: "",
        dateClaimed: "",
        itemId: "",
      });
      fetchClaims();
      
    } catch (error) {
      console.error("Error creating claim:", error);
      setError(error.response?.data || "Failed to create claim");
    }
  };

  const handleDeleteClick = (claim) => {
    setClaimToDelete(claim);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!claimToDelete) return;

    try {
      await api.delete(`/api/claims/deleteClaim/${claimToDelete.claimId}`);
      console.log('Claim deleted:', claimToDelete.claimId);
      setDeleteConfirmOpen(false);
      setClaimToDelete(null);
      fetchClaims(); // Refresh the claims list
    } catch (error) {
      console.error("Error deleting claim:", error);
      setError(error.response?.data || "Failed to delete claim");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <br/>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          label="Search Logs"
          variant="outlined"
          fullWidth
          sx={{ mr: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ 
            height: '56px',
            minWidth: '120px' 
          }}
          onClick={() => setOpen(true)}
        >
          Add Claim
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Date Claimed</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading claims...</TableCell>
              </TableRow>
            ) : filteredClaims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No claims found</TableCell>
              </TableRow>
            ) : (
              filteredClaims.map((claim, index) => (
                <TableRow key={claim.claimId || index}>
                  <TableCell>{claim.firstName}</TableCell>
                  <TableCell>{claim.lastName}</TableCell>
                  <TableCell>{claim.studEmail}</TableCell>
                  <TableCell>{claim.item?.itemName || 'Unknown Item'}</TableCell>
                  <TableCell>{formatDate(claim.dateClaimed)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(claim)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Claim Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Claim
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="item-select-label">Item</InputLabel>
            <Select
              labelId="item-select-label"
              label="Item"
              name="itemId"
              value={formData.itemId}
              onChange={handleInputChange}
            >
              {itemOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="studEmail"
            value={formData.studEmail}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date Claimed"
            name="dateClaimed"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dateClaimed}
            onChange={handleInputChange}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            disabled={!formData.itemId}
          >
            Create Claim
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom color="black">
            Confirm Delete
          </Typography>
          <Typography color="black">
            Are you sure you want to delete this claim?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ClaimLog;