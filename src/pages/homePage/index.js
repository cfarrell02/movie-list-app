import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button} from '@mui/material';

const Homepage = () => {
    const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', paddingTop: '5%' }}>
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome!
      </Typography>
      <Typography variant="h5" component="p" align="center" sx={{ mb: 4 }}>
        Get real-time weather updates for your favorite locations and Track your favorite movies!
      </Typography>
      <Button variant="contained" size="large" color="primary" onClick={() => navigate('/movielist')}>
        Get Started
      </Button>
    </Container>
  );
};

export default Homepage;
