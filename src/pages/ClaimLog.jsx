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
} from "@mui/material";
import axios from "axios";

const ClaimLog = () => {
  const [claims, setClaims] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studEmail: "",
    dateClaimed: "",
    itemId: "", // Add a new state variable for the selected item
  });
  const [itemOptions, setItemOptions] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // ...
        setClaims(Array.isArray(response.data) ? response.data : []);
        // Get all items from API
        const itemsResponse = await axios.get("/api/items getAllItems");
        setItemOptions(itemsResponse.data.map((item) => ({ value: item.id, label: item.name })));
      } catch (error) {
        console.error("Error fetching claims:", error);
        setClaims([]);
      }
    };
  }, [claims]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `/api/claims/createClaim/${formData.itemId}`,
        formData
      );
      setClaims([...claims, response.data]);
      setOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        studEmail: "",
        dateClaimed: "",
        itemId: "", // Reset the selected item
      });
    } catch (error) {
      console.error("Error creating claim:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Claim Log
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Claim
      </Button>
      {Array.isArray(claims) && (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date Claimed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.claimId}>
                  <TableCell>{claim.firstName}</TableCell>
                  <TableCell>{claim.lastName}</TableCell>
                  <TableCell>{claim.studEmail}</TableCell>
                  <TableCell>{claim.dateClaimed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
          <Select
            fullWidth
            margin="normal"
            label="Item ID"
            name="itemId"
            value={formData.itemId}
            onChange={handleInputChange}
            renderValue={(selected) => selected && selected.value}
          >
            {itemOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Date Claimed"
            name="dateClaimed"
            value={formData.dateClaimed}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Claim
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ClaimLog;