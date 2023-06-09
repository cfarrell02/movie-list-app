import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, CardMedia, IconButton, Grid} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MovieListCard = ({ movieList, onDelete }) => {
  const navigate = useNavigate();
  const [imageSrcs, setImageSrcs] = useState([]);

  useEffect(() => {
    if (movieList.movies && movieList.movies.length >= 4) {
      const posterPaths = movieList.movies.slice(0, 4).map((movie) => movie.poster_path);
      const imagePaths = posterPaths.map((path) => `https://image.tmdb.org/t/p/w200${path}`);
      setImageSrcs(imagePaths);
    } else if (movieList.movies && movieList.movies.length > 0) {
        const posterPaths = movieList.movies.map((movie) => movie.poster_path);
        const imagePaths = posterPaths.map((path) => `https://image.tmdb.org/t/p/w200${path}`);
        setImageSrcs(imagePaths);
    }
  }, [movieList.movies]);

  return (
    <Card sx={{ padding: '2em' }} align="center">
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
        {movieList.title}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {imageSrcs.length >= 4 ? imageSrcs.map((src, index) => (
            <Grid item xs={6}>
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
            </Grid>
        )) : imageSrcs.map((src, index) => (
            <Grid item xs={12}>
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
            </Grid>
        ))
    
    }
        </Grid>
      
      <Button
        variant="contained"
        size="large"
        sx={{ marginTop: '1em', marginRight: '1em' }}
        color="primary"
        onClick={() => navigate('/movielist/' + movieList.id)}
      >
        Open List
      </Button>
        <IconButton
        variant="outlined"
        size="large"
        sx={{ marginTop: '.5em' }}
        color="primary"
        onClick={() => onDelete(movieList.id)}
        >
        <DeleteIcon fontSize="inherit" />
        </IconButton>
    </Card>
  );
};

export default MovieListCard;
