import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Header = ({authenticated}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleForward = () => {
    navigate(1); // Go forward to the next page
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {authenticated ? ( <>
        <IconButton color="inherit" onClick={handleBack} sx={{marginRight:"1em"}}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleForward} sx={{marginRight:"1em"}}>
          <ArrowForwardIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Weather App
        </Typography>
        <Button color="inherit" onClick={() => navigate('/home')}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate('/movielist')}>
          Movie List
        </Button>
        <Button color="inherit" onClick={() => navigate('/weather')}>
          Weather
        </Button>
        </>
        ) : (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Weather App
        </Typography>
        )}
      </Toolbar>
    </AppBar>
    
  );
};

export default Header;
