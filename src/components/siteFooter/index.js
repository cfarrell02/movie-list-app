import React from 'react';
import { Typography, Link } from '@mui/material';

function SiteFooter() {
    
    return (
        <div style={{paddingTop:'2em'}}>
            <Typography variant="h6" align="center" gutterBottom sx={{color:'text.primary'}}>
                Movie List App
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                Created by Cian Farrell
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{paddingBottom:'2em'}}>
                {'Movies supplied by '}
                <Link color="inherit" href="https://www.themoviedb.org/">
                    The Movie Database
                </Link>
            </Typography>
        </div>
    );
    }

export default SiteFooter;
