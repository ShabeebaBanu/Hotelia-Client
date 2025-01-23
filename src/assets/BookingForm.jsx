import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const BookingForm = ({ roomId, userId, pricePerDay, isPopoverOpen, handlePopoverClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const days = dayjs(checkOut).diff(dayjs(checkIn), 'day');
      if (days > 0) {
        setTotalPrice(days * pricePerDay);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  };

  const handleBookNow = async () => {
    const token = sessionStorage.getItem('token');
    if(token == null){
        navigate("/signin");
    }

    if (!name || !phone || !checkInDate || !checkOutDate || totalPrice === 0) {
      alert('Please fill in all fields correctly.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/v1/book/${userId}/${roomId}`, {
        name : name,
        phone : phone,
        checkInDate: checkInDate.format('YYYY-MM-DD'),
        checkOutDate: checkOutDate.format('YYYY-MM-DD'),
        rentTotal: totalPrice,
        paymentStatus: "Pending"
      },{
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.status === 200) {
        alert('Booking successful!');
        handlePopoverClose();
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking room:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        Booking Form
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Adjust the gap between fields
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Check-In Date"
            value={checkInDate}
            onChange={(newValue) => {
              setCheckInDate(newValue);
              calculateTotalPrice(newValue, checkOutDate);
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="Check-Out Date"
            value={checkOutDate}
            onChange={(newValue) => {
              setCheckOutDate(newValue);
              calculateTotalPrice(checkInDate, newValue);
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <TextField
          label="Total Price"
          value={totalPrice}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ backgroundColor: 'var(--orange)' }}
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </Box>
    </div>
  );
};

export default BookingForm;
