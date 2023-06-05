import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button} from '@mui/material';

const Homepage = () => {
    const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', paddingTop: '5%' }}>
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome to My Weather App
      </Typography>
      <Typography variant="h5" component="p" align="center" sx={{ mb: 4 }}>
        Get real-time weather updates for your favorite locations!
      </Typography>
      <Button variant="contained" size="large" color="primary" onClick={() => navigate('/weather')}>
        Get Started
      </Button>
    </Container>
  );
};

export default Homepage;
