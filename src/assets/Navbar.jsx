import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/signin');
  };
  const handleLogoNavigation = () => {
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{backgroundColor: "black"}}>
        <Toolbar style={{justifyContent: 'space-between'}}>
          <div style={{textAlign:"left"}}>
            <Button color="inherit" onClick={handleLogoNavigation}>
              <b>HOTELIA</b>
            </Button>
          </div>
          <div>
            <Button color="inherit" onClick={handleNavigation}>
              Login
            </Button>
            <Button color="inherit" onClick={handleNavigation}>
              Add Hotel
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}