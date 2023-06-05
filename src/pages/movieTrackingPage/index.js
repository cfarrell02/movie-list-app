import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import { getMovie } from '../../api/TMDBAPI';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getAllMovies, addMovie } from '../../api/movieStorage';

const MovieTrackingPage = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movies, setMovies] = useState([]);

  const handleMovieTitleChange = (event) => {
    setMovieTitle(event.target.value);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getAllMovies();
        setMovies(movies);
      } catch (error) {
        console.error('Error getting movies:', error);
      }
    };
  
    fetchMovies();
  }, []);
  

  const handleAddMovie = () => {
    if (movieTitle.trim() !== '') {
      setMovies([...movies, {title: movieTitle}]);
      setMovieTitle('');
    }
  };

  const deleteMovie = (movie) => {
    const newMovies = movies.filter((m) => m.id !== movie.id);
    setMovies(newMovies);
  };

  const editMovie = (movie) => {
    const editedMovieIndex = movies.findIndex((m) => m.id === movie.id);
    if (editedMovieIndex !== -1) {
      let newMovies = [...movies];
      newMovies[editedMovieIndex] = movie;
      setMovies(newMovies);
    }
  };
  

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }} align="center">
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
        Movie Tracking Page
      </Typography>

      <TextField
        label="Movie Title"
        variant="outlined"
        fullWidth
        value={movieTitle}
        onChange={handleMovieTitleChange}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            handleAddMovie();
          }
        }}
        sx={{ mb: 2 }}
      />


      <MovieTable 
      movies={movies}
      deleteMovie={deleteMovie}
      editMovie={editMovie}
      />
      </Paper>
    </Container>
  );
};

export default MovieTrackingPage;
