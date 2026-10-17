import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';

function SiteFooter() {
    return (
        <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 6, py: 3 }}>
            <Container
                maxWidth="xl"
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography variant="body2" color="text.secondary">
                    Watchlist · Created by Cian Farrell
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {'Data provided by '}
                    <Link color="inherit" href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
                        The Movie Database (TMDB)
                    </Link>
                    {' and '}
                    <Link color="inherit" href="https://openlibrary.org/" target="_blank" rel="noopener noreferrer">
                        Open Library
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default SiteFooter;
