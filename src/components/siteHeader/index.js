import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Weather App
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Weather</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
