import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Autocomplete, CircularProgress} from '@mui/material';
import { getMovie, getMovieSearchResults} from '../../api/TMDBAPI';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getAllMovies, addMovie, updateMovie, deleteMovie} from '../../api/movieStorage';

const MovieTrackingPage = () => {
  const [movie, setMovie] = useState({});
  const [movies, setMovies] = useState([]);
  const [changesToBeMade, setChangesToBeMade] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(false);
  const [options, setOptions] = useState([]);



  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await getAllMovies();
        setMovies(movies);
      } catch (error) {
        console.error('Error getting movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  
  const handleAutocompleteChange = async (event, value) => {
    if (value) {
      try {
        setFetchingMovies(true);
        const newMovie = await getMovie(value.id);
        setMovie(newMovie);
        setOptions([]);
        setOpen(false);
      } catch (error) {
        console.error('Error getting movie:', error);
      } finally {
        setFetchingMovies(false);
      }
    }
  };



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

  const handleTextFieldChange = async (event) => {
    try {
      setFetchingMovies(true);
      let data = await getMovieSearchResults(1,event.target.value);
      if (data) {
        setOptions(data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error getting movies:', error);
    } finally {
      setFetchingMovies(false);
    }
  };

  const handleAddMovie = async () => {
    try {
      if(movie.id === undefined) throw new Error("No movie selected.");
      movie.watched = false;
      setChangesToBeMade([...changesToBeMade, {action: "add", movie}]);
      setMovies([...movies, movie]);
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };
  
  

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      changesToBeMade.forEach(async (change) => {
        if(change.action === "add") {
          await addMovie(change.movie);
        }else if(change.action === "delete") {
          await deleteMovie(change.movie.id);
        }else if(change.action === "edit") {
          await updateMovie(change.movie.id, change.movie);
        }
      });
    } catch (error) {
      console.error('Error submitting changes:', error);
    } finally {
      setSubmitting(false);
      setChangesToBeMade([]);
    }
  };
        


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }} align="center">
        <Grid container spacing={2} alignItems="center">
      <Grid item xs={2}/>
      <Grid item xs={8}>
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
        Movie Tracking Page
      </Typography>
      </Grid>
      <Grid item xs={2}>{submitting ? <CircularProgress color="inherit" size={20} /> : 
      <Button variant="contained" size="medium" color="primary" onClick={onSubmit} disabled={changesToBeMade.length===0}>
        Submit Changes
      </Button>
    }
        </Grid>
      </Grid>
      <Autocomplete
  onChange={handleAutocompleteChange}
  sx={{ width: '100%' }}
  open={open}
  onOpen={() => {
    setOpen(true);
  }}
  onClose={() => {
    setOpen(false);
  }}
  isOptionEqualToValue={(option, value) => option.name === value.name}
  getOptionLabel={(option) => option.title}
  options={options}
  loading={fetchingMovies}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Movie Title"
      onChange={handleTextFieldChange}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <React.Fragment>
            {fetchingMovies ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
            <Button variant="contained" onClick={handleAddMovie}>
              Add
            </Button>
          </React.Fragment>
        ),
      }}
      fullWidth
    />
  )}
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

