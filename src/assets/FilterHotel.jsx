import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import axios from 'axios';
import HotelGrid from './HotelGrid'; 
import { Typography, Grid } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const provinces = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa',
];

const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Trincomalee', 'Batticaloa', 'Ampara',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
];

export default function FilterHotel() {
  const theme = useTheme();

  const [provinceName, setProvinceName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [hotelCode, setHotelCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]); 

  const handleProvinceChange = (event) => {
    setProvinceName(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setDistrictName(event.target.value);
  };

  const handleHotelNameChange = (event) => {
    setHotelName(event.target.value);
  };

  const handleHotelCodeChange = (event) => {
    setHotelCode(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        province: provinceName || undefined,
        district: districtName || undefined,
        hotelName: hotelName || undefined,
        hotelCode: hotelCode || undefined,
      };

      const response = await axios.get('http://localhost:8080/api/v1/hotel/search', { params });
      console.log(response.data);
      setHotels(response.data); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="province-label">Province</InputLabel>
          <Select
            labelId="province-label"
            id="province-select"
            value={provinceName}
            onChange={handleProvinceChange}
            input={<OutlinedInput label="Province" />}
            MenuProps={MenuProps}
          >
            {provinces.map((province) => (
              <MenuItem
                key={province}
                value={province}
                style={{
                  fontWeight: province === provinceName
                    ? theme.typography.fontWeightMedium
                    : theme.typography.fontWeightRegular,
                }}
              >
                {province}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="district-label">District</InputLabel>
          <Select
            labelId="district-label"
            id="district-select"
            value={districtName}
            onChange={handleDistrictChange}
            input={<OutlinedInput label="District" />}
            MenuProps={MenuProps}
          >
            {districts.map((district) => (
              <MenuItem
                key={district}
                value={district}
                style={{
                  fontWeight: district === districtName
                    ? theme.typography.fontWeightMedium
                    : theme.typography.fontWeightRegular,
                }}
              >
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Hotel Name"
          value={hotelName}
          onChange={handleHotelNameChange}
          variant="outlined"
          sx={{ minWidth: 150 }}
        />

        <TextField
          label="Hotel Code"
          value={hotelCode}
          onChange={handleHotelCodeChange}
          variant="outlined"
          sx={{ minWidth: 150 }}
        />

        <Button
          variant="contained"
          style={{ backgroundColor: 'var(--green)' }}
          sx={{ height: '56px', minWidth: 150 }}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Hotel'}
        </Button>
      </Box>

      {hotels.length > 0 && (
        <Box
          sx={{
            marginTop: '20px',
            backgroundColor: '#e0e0e0',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ marginBottom: '20px', color: 'black' }}
          >
            Available Hotels
          </Typography>
          <HotelGrid hotels={hotels} /> 
        </Box>
      )}
    </div>
  );
}
