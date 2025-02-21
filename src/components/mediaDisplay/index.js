import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';
import ShowMoreWrapper from '../showMoreWrapper';

const MediaDisplay = ({ videos, images }) => {
    const [wrapperCount, setWrapperCount] = useState(getInitialCount());

    function getInitialCount() {
        const width = window.innerWidth;
        if (width < 900) return 2;    
        if (width < 1200) return 3 
        if (width < 1536) return 4;
        return 6;                
    }

    useEffect(() => {
        const handleResize = () => setWrapperCount(getInitialCount());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getVideoSrc = (video) => {
        if (video.site === 'YouTube') return `https://www.youtube.com/embed/${video.key}`;
        if (video.site === 'Vimeo') return `https://player.vimeo.com/video/${video.key}`;
        return '';
    };

    return (
        <Box className="media-display" sx={{ p: 2 }}>
            {videos && videos.length > 0 && (
                <Box className="video-section" mb={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>Videos</Typography>
                    <ShowMoreWrapper initialCount={wrapperCount} parentComponent={Grid} parentComponentProps={{ container: true, spacing: 2 }}>
                        {videos.map((video, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
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
                    </ShowMoreWrapper>
                </Box>
            )}
            {images && images.length > 0 && (
                <Box className="images-section" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>Images</Typography>
                    <ShowMoreWrapper initialCount={wrapperCount} parentComponent={Grid} parentComponentProps={{ container: true, spacing: 2 }}>
                        {images.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                        alt={`Image ${index}`}
                                        sx={{ width: '100%', height: 'auto' }}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </ShowMoreWrapper>
                </Box>
            )}
        </Box>
    );
};

export default MediaDisplay;
