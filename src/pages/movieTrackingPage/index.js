import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Autocomplete, CircularProgress} from '@mui/material';
import { getMovie, getMovieSearchResults} from '../../api/TMDBAPI';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getAllMovies, addMovie, updateMovie, deleteMovie} from '../../api/movieStorage';
import MovieAdd from '../../components/MovieComponents/movieAdd';

const MovieTrackingPage = () => {
  const [movies, setMovies] = useState([]);
  const [changesToBeMade, setChangesToBeMade] = useState([]);
  const [loading, setLoading] = useState(false);


  const cachedMovies = useMemo(() => {
    return getAllMovies();
  },[]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await cachedMovies;
        setMovies(movies);
      } catch (error) {
        console.error('Error getting movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [cachedMovies]);



  const removeMovie = (movie) => {
    const newMovies = movies.filter((m) => m.id !== movie.id);
    if(changesToBeMade.find((m) => m.movie.id === movie.id)) {
      setChangesToBeMade([...changesToBeMade.filter((m) => m.movie.id !== movie.id)]);
    }else{
    setChangesToBeMade([...changesToBeMade, {action: "delete", movie}]);
    }
    setMovies(newMovies);
  };

  const editMovie = (movie) => {
    const editedMovieIndex = movies.findIndex((m) => m.id === movie.id);
    if (editedMovieIndex !== -1) {
      let newMovies = [...movies];
      newMovies[editedMovieIndex] = movie;
      if(changesToBeMade.find((m) => m.movie.id === movie.id && m.action === "add")) {
        setChangesToBeMade([...changesToBeMade.filter((m) => m.movie.id !== movie.id), {action: "add", movie}]);
      } else {
      setChangesToBeMade([...changesToBeMade, {action: "edit", movie}]);
      }
      setMovies(newMovies);
    }
  };




  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }} align="center">
      <MovieAdd 
      title="Movie Tracker" 
      movies={movies} 
      changesToBeMade={changesToBeMade}
      setChangesToBeMade={setChangesToBeMade}
      setMovies={setMovies}
      />
      <MovieTable 
      movies={movies}
      deleteMovie={removeMovie}
      editMovie={editMovie}
      loading={loading}
      />
      </Paper>
    </Container>
  );
};

export default MovieTrackingPage;

