import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Weather App
        </Typography>
        <Button color="inherit" >Home</Button>
        <Button color="inherit" onClick={() => navigate('/weather')}>Weather</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
