import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";

const AddRoom = ({ hotelId, onClose }) => {
  const [roomDetails, setRoomDetails] = useState({
    type: "",
    maxMembers: "",
    bed: "",
    price: "",
    status: "",
    roomNo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const token = sessionStorage.getItem('token'); // Replace with your token retrieval logic

    if (!token) {
      alert('No authentication token found');
      return;
    }
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/room/admin/${hotelId}`,
        roomDetails,{
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in headers for authentication
            }}
      );
      console.log("Room added successfully:", response.data);
      onClose(); // Close the form after submission
    } catch (error) {
      console.error("Error adding room:", error);
      setError("Failed to add room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box >
      <Typography variant="h6" gutterBottom>
        Add Room Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Type Field */}
          <Grid item xs={12}>
            <TextField
              label="Room Type"
              name="type"
              value={roomDetails.type}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Max Members Field */}
          <Grid item xs={12}>
            <TextField
              label="Max Members"
              name="maxMembers"
              value={roomDetails.maxMembers}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
            />
          </Grid>

          {/* Bed Field */}
          <Grid item xs={12}>
            <TextField
              label="Bed"
              name="bed"
              value={roomDetails.bed}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Price Field */}
          <Grid item xs={12}>
            <TextField
              label="Price Per Day"
              name="price"
              value={roomDetails.price}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
            />
          </Grid>

          {/* Status Field */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={roomDetails.status}
                onChange={handleInputChange}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Booked">Booked</MenuItem>
              </Select>
              <FormHelperText>Select the room status</FormHelperText>
            </FormControl>
          </Grid>

          {/* Room No Field */}
          <Grid item xs={12}>
            <TextField
              label="Room Number"
              name="roomNo"
              value={roomDetails.roomNo}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {error && <Typography color="error">{error}</Typography>}

        <Box display="flex" justifyContent="space-between" marginTop="16px">
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Room"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddRoom;
