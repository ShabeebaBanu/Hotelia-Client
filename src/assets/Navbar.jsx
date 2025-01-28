import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate, NavLink } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const getToken = () => sessionStorage.getItem('token');
  const isLoggedIn = !!getToken();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: 'black' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'left' }}>
            <Button component={NavLink} to="/" color="inherit">
              <b>HOTELIA</b>
            </Button>
          </div>
          <div>
            <Button component={NavLink} to={isLoggedIn ? '/profile' : '/signin'} color="inherit">
              {isLoggedIn ? 'Profile' : 'Login'}
            </Button>
            <Button component={NavLink} to="/signup" color="inherit">
              Add Hotel
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
