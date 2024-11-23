import React from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';


const MediaDisplay = ({ videos, images }) => {


    const getVideoSrc = (video) => {
        switch (video.site)
        {
            case 'YouTube':
                return `https://www.youtube.com/embed/${video.key}`;
            case 'Vimeo':
                return `https://player.vimeo.com/video/${video.key}`;
            default:
                return '';
        }

    }
    return (
        <Box className="media-display">
            {videos && videos.length > 0 && (
            <Box className="video-section" mb={4}>
                <Typography variant="h4" gutterBottom>
                    Videos
                </Typography>
                <Grid container spacing={2}>
                    {videos.map((video, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardMedia
                                    component="iframe"
                                    src={getVideoSrc(video)}
                                    title={video.name}
                                    height="315"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            )}
            {images && images.length > 0 && (
            <Box className="images-section">
                <Typography variant="h4" gutterBottom>
                    Images
                </Typography>
                <Grid container spacing={2}>
                    {images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                    alt={image}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            )}
        </Box>
    );
};

export default MediaDisplay;