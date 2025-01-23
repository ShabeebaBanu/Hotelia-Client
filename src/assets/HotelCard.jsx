import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'; 

export default function HotelCard({ hotel }) {
  if (!hotel) {
    console.error('Invalid hotel prop passed to HotelCard:', hotel);
    return null; 
  }

  const { id, name, phone, addNo, addStreet, addCity, imagePath } = hotel;
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    navigate(`/room/${id}/${name}`); 
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 1 }} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <CardMedia
        component="img"
        height="140"
        image={imagePath}
        alt={`${name} image`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${addNo}, ${addStreet}, ${addCity}`}
        </Typography>
      </CardContent>
    </Card>
  );
}
