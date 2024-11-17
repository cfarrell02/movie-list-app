import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <Container style={{ textAlign: 'center', marginTop: '5em' }}>
            <Typography variant="h1" component="h1" gutterBottom sx={{color:'text.primary'}}>
                404
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{color:'text.primary'}}>
                Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom sx={{color:'text.primary', mb: '1em'}}>
                The page you are looking for does not exist.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoBack}>
                Go to Home
            </Button>
        </Container>
    );
};

export default NotFoundPage;