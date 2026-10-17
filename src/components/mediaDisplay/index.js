import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

const INITIAL_VIDEOS = 3;
const INITIAL_IMAGES = 8;

const getVideoSrc = (video) => {
    if (video.site === 'YouTube') return `https://www.youtube-nocookie.com/embed/${video.key}`;
    if (video.site === 'Vimeo') return `https://player.vimeo.com/video/${video.key}`;
    return '';
};

const MediaDisplay = ({ videos, images, imageAspect = '16 / 9' }) => {
    const [allVideos, setAllVideos] = useState(false);
    const [allImages, setAllImages] = useState(false);
    const playable = (videos || []).filter(getVideoSrc);
    const shownVideos = allVideos ? playable : playable.slice(0, INITIAL_VIDEOS);
    const shownImages = allImages ? images || [] : (images || []).slice(0, INITIAL_IMAGES);

    return (
        <Box>
            {playable.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 1.5 }}>Videos</Typography>
                    <Grid container spacing={2}>
                        {shownVideos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.key}>
                                <Box
                                    component="iframe"
                                    src={getVideoSrc(video)}
                                    title={video.name}
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    sx={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: '12px', display: 'block', bgcolor: 'action.hover' }}
                                />
                                <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.75 }}>{video.name}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                    {playable.length > INITIAL_VIDEOS && (
                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Button onClick={() => setAllVideos(!allVideos)}>{allVideos ? 'Show less' : `Show all ${playable.length} videos`}</Button>
                        </Box>
                    )}
                </Box>
            )}
            {images && images.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 1.5 }}>Images</Typography>
                    <Grid container spacing={2}>
                        {shownImages.map((image) => (
                            <Grid item xs={6} sm={4} md={3} key={image.file_path}>
                                <Box
                                    component="a"
                                    href={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ display: 'block', borderRadius: '12px', overflow: 'hidden', '&:hover img': { transform: 'scale(1.04)' } }}
                                >
                                    <Box
                                        component="img"
                                        src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                        alt=""
                                        loading="lazy"
                                        sx={{ width: '100%', aspectRatio: imageAspect, objectFit: 'cover', display: 'block', transition: 'transform .3s', bgcolor: 'action.hover' }}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    {images.length > INITIAL_IMAGES && (
                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Button onClick={() => setAllImages(!allImages)}>{allImages ? 'Show less' : `Show all ${images.length} images`}</Button>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default MediaDisplay;
