import React, {useState} from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {auth } from '../../firebase-config';
import { onAuthStateChanged } from "firebase/auth";


const Header = ({ handleLogout}) => {
  const navigate = useNavigate();
  const [user , setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
        setUser(user);
    } else {
        setUser(null);
    }
});

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleForward = () => {
    navigate(1); // Go forward to the next page
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {user!==null ? ( <>
        <IconButton color="inherit" onClick={handleBack} sx={{marginRight:"1em"}}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleForward} sx={{marginRight:"1em"}}>
          <ArrowForwardIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Weather App - {user ? user.email : null}
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
