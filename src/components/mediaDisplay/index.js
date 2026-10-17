import React, { useState } from 'react';
import { Box, ButtonBase, Grid, Typography } from '@mui/material';
import ImageViewer, { tmdbThumbSrc, tmdbViewerSrc } from '../imageViewer';
import { ShowMoreButton, useItemsPerRow } from '../detail';

// Match the Grid item sizes below so the collapsed view is exactly one row
const VIDEO_COLUMNS = { xs: 1, sm: 2, md: 3 };
const IMAGE_COLUMNS = { xs: 2, sm: 3, md: 4 };

const getVideoSrc = (video) => {
    if (video.site === 'YouTube') return `https://www.youtube-nocookie.com/embed/${video.key}`;
    if (video.site === 'Vimeo') return `https://player.vimeo.com/video/${video.key}`;
    return '';
};

const MediaDisplay = ({ videos, images, imageAspect = '16 / 9', title }) => {
    const [viewerIndex, setViewerIndex] = useState(null);
    const [allVideos, setAllVideos] = useState(false);
    const [allImages, setAllImages] = useState(false);
    const videosPerRow = useItemsPerRow(VIDEO_COLUMNS);
    const imagesPerRow = useItemsPerRow(IMAGE_COLUMNS);
    const playable = (videos || []).filter(getVideoSrc);
    const shownVideos = allVideos ? playable : playable.slice(0, videosPerRow);
    const shownImages = allImages ? images || [] : (images || []).slice(0, imagesPerRow);

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
                    {playable.length > videosPerRow && (
                        <ShowMoreButton expanded={allVideos} total={playable.length} noun="videos" onClick={() => setAllVideos(!allVideos)} />
                    )}
                </Box>
            )}
            {images && images.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 1.5 }}>Images</Typography>
                    <Grid container spacing={2}>
                        {shownImages.map((image, index) => (
                            <Grid item xs={6} sm={4} md={3} key={image.file_path}>
                                <ButtonBase
                                    onClick={() => setViewerIndex(index)}
                                    aria-label={`View image ${index + 1} of ${images.length}`}
                                    sx={{ display: 'block', width: '100%', borderRadius: '12px', overflow: 'hidden', '&:hover img': { transform: 'scale(1.04)' } }}
                                >
                                    <Box
                                        component="img"
                                        src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                        alt=""
                                        loading="lazy"
                                        sx={{ width: '100%', aspectRatio: imageAspect, objectFit: 'cover', display: 'block', transition: 'transform .3s', bgcolor: 'action.hover' }}
                                    />
                                </ButtonBase>
                            </Grid>
                        ))}
                    </Grid>
                    {images.length > imagesPerRow && (
                        <ShowMoreButton expanded={allImages} total={images.length} noun="images" onClick={() => setAllImages(!allImages)} />
                    )}
                </Box>
            )}
            <ImageViewer
                images={(images || []).map((image) => ({ src: tmdbViewerSrc(image), thumb: tmdbThumbSrc(image) }))}
                index={viewerIndex}
                onIndexChange={setViewerIndex}
                onClose={() => setViewerIndex(null)}
                title={title}
            />
        </Box>
    );
};

export default MediaDisplay;
