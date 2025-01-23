import React from 'react';
import Grid from '@mui/material/Grid';
import HotelCard from './HotelCard';

export default function HotelGrid({ hotels }) {
  if (!Array.isArray(hotels)) {
    console.error('Invalid hotels prop passed to HotelGrid:', hotels);
    return null; 
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      {hotels.map((hotel) => (
        <Grid item xs={12} sm={6} md={3} key={hotel.code}>
          <HotelCard hotel={hotel} />
        </Grid>
      ))}
    </Grid>
  );
}
