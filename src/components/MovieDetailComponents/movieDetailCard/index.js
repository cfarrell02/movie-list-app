import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const MovieDetailCard = (movie) => {
  

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia component="img" height="300" image={poster} alt={movie.title} />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Director: {director}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Actors: {actors}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default MovieDetailCard;
