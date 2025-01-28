import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';  // Import axios for API requests
import '../index.css';

const AddHotelForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: '',
    addNo: '',
    addStreet: '',
    addCity: '',
    province: '',
    district: '',
    imagePath: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the token from localStorage or context
    const token = sessionStorage.getItem('token'); // Replace with your token retrieval logic

    if (!token) {
      alert('No authentication token found');
      return;
    }

    try {
      // Make POST request to add hotel
      const response = await axios.post(
        `http://localhost:8080/api/v1/hotel/admin/${userId}`,
        formData, // Send form data as payload
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers for authentication
          },
        }
      );

      if (response.status === 200) {
        alert('Hotel added successfully!');
        // Optionally reset form after successful submission
        setFormData({
          code: '',
          name: '',
          phone: '',
          addNo: '',
          addStreet: '',
          addCity: '',
          province: '',
          district: '',
          imagePath: '',
        });
      } else {
        alert('Failed to add hotel');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Error adding hotel. Please try again later.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address No"
              name="addNo"
              value={formData.addNo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address Street"
              name="addStreet"
              value={formData.addStreet}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address City"
              name="addCity"
              value={formData.addCity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image Path"
              name="imagePath"
              value={formData.imagePath}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '10px', backgroundColor: "var(--orange)" }}
            >
              Add Hotel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddHotelForm;
