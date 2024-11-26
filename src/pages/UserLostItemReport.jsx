import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Container, 
  Paper 
} from '@mui/material';
import Layout from '../components/Layout'; // Adjust the import path as needed

const categories = [
  'Electronics', 
  'Clothing', 
  'Accessories', 
  'Books', 
  'Tools'
];

function UserLostItemReport() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    const reportData = {
      itemName,
      category,
      location,
      description
    };

    console.log('Lost Item Report Submitted:', reportData);
    
    // Reset form after submission
    setItemName('');
    setCategory('');
    setLocation('');
    setDescription('');

    // TODO: Add actual submission logic (e.g., API call)
    // TODO: Add success/error notification
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 2, 
            borderRadius: 2 
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}
          >
            Report a Lost Item
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Item Name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Location Found"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Provide additional details about the found item..."
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              Submit Lost Item Report
            </Button>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
}

export default UserLostItemReport;