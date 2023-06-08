import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, CardMedia } from '@mui/material';

const MovieListCard = ({ movieList }) => {
  const navigate = useNavigate();
  const [imageSrcs, setImageSrcs] = useState([]);

  useEffect(() => {
    if (movieList.movies && movieList.movies.length >= 4) {
      const posterPaths = movieList.movies.slice(0, 4).map((movie) => movie.poster_path);
      const imagePaths = posterPaths.map((path) => `https://image.tmdb.org/t/p/w200${path}`);
      setImageSrcs(imagePaths);
    }
  }, [movieList.movies]);

  return (
    <Card sx={{ padding: '2em' }} align="center">
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
        {movieList.title}
      </Typography>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5em',
        }}
      >
        {imageSrcs.map((src, index) => (
          <CardMedia
            key={index}
            component="img"
            src={src}
            alt={`Poster ${index + 1}`}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1/1',
              objectFit: 'cover',
            }}
          />
        ))}
      </div>
      <Button
        variant="contained"
        size="large"
        sx={{ marginTop: '1em' }}
        color="primary"
        onClick={() => navigate('/movielist/' + movieList.id)}
      >
        Open List
      </Button>
    </Card>
  );
};

export default MovieListCard;
