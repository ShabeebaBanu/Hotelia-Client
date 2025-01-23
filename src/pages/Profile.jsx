import React, { useEffect, useState } from 'react';
import { Typography, Button, Paper, Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../index.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
    
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setUser(response.data); 
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile details. Please log in again.');
        sessionStorage.clear(); 
        navigate('/signin'); 
      }
    };
    

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/signin');
  };

  if (error) {
    return (
      <Paper elevation={3} style={{ padding: '16px', maxWidth: '90%', margin: 'auto', marginTop: '50px' }}>
        <Typography variant="h6" color="error" align="center" style={{ marginBottom: '20px' }}>
          {error}
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/signin')}>
          Go to Login
        </Button>
      </Paper>
    );
  }

  if (!user) return <p>Loading...</p>;

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '90%', margin: 'auto', marginTop: '50px' }}>
      <Grid container direction="column" spacing={4}>
        
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar alt="Profile Icon" src="/path-to-image.jpg" style={{ width: 60, height: 60 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" style={{backgroundColor: "var(--green)"}} onClick={handleLogout}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Grid>

        
      </Grid>
    </Paper>
  );
};

export default ProfilePage;
