import React, {useState, useEffect} from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {auth } from '../../firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { getUserById } from '../../api/userDataStorage';


const Header = ({ handleLogout}) => {
  const navigate = useNavigate();
  const [user , setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserById(user.uid).then((userData) => {
          setUser(userData);
        });
      } else {
        setUser(null);
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleForward = () => {
    navigate(1); // Go forward to the next page
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', margin:'0' }}>
    <AppBar position="static" sx={{ margin: '.25em 1em 1em 1em', borderRadius: '1em' , width: 'calc(100% - 2em)'}}>
      <Toolbar>
        {user!==null ? ( <>
        {/* <IconButton color="inherit" onClick={handleBack} sx={{marginRight:"1em"}}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleForward} sx={{marginRight:"1em"}}>
          <ArrowForwardIcon />
        </IconButton> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate('/home')}>
          Movie App - {user.firstName} {user.lastName}
        </Button>
        </Typography>

        <Button color="inherit" onClick={() => navigate('/movielist')}>
          Movie Lists
        </Button>
        {/* <Button color="inherit" onClick={() => navigate('/weather')}>
          Weather
        </Button> */}
        <Button color="inherit" onClick={() => navigate('/login')}>
          Settings
        </Button>
        </>
        ) : (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie App
        </Typography>
        )}
      </Toolbar>
    </AppBar>
    </div>
    
  );
};

export default Header;
