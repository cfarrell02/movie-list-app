import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const NotFoundPage = () => (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
        <Typography variant="overline" color="primary" fontWeight={700}>404</Typography>
        <Typography variant="h3" component="h1" sx={{ mt: 1 }}>Page not found</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
            The page you're looking for doesn't exist or may have moved.
        </Typography>
        <Button component={RouterLink} to="/home" variant="contained" size="large">
            Back to browsing
        </Button>
    </Container>
);

export default NotFoundPage;
