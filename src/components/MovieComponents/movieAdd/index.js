// MovieAdd.js

import React, { useState, useRef } from 'react';
import { Container, Typography, TextField, Button, Card, Grid, Autocomplete, CircularProgress, Alert } from '@mui/material';
import { getMovie, getMovieSearchResults } from '../../../api/TMDBAPI';
import { getMovies, addMovieToList, updateMovieInList, deleteMovieFromList} from '../../../api/movieStorage';


const MovieAdd = ({ title, movies, listId, setMovies, disabled, error, setError}) => {
  const [open, setOpen] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(false);
  const [options, setOptions] = useState([]);

  const movieTitleTextField = useRef(null);

  const [movie, setMovie] = useState({});

  const handleAutocompleteChange = async (event, value) => {
    if (value) {
      try {
        setFetchingMovies(true);
        const newMovie = await getMovie(value.id);
        setOptions([]);
        setMovie(newMovie);
        setOpen(false);
        setError({ type: '', body: '' });
      } catch (error) {
        setError({ type:'error', body: error.message });
        console.error('Error getting movie:', error);
      } finally {
        setFetchingMovies(false);
      }
    }
  };

  const handleTextFieldChange = async (event) => {
    try {
      setFetchingMovies(true);
      let data = await getMovieSearchResults(1, event.target.value);
      if (data) {
        setOptions(data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      setError({ type:'error', body: error.message });
      console.error('Error getting movies:', error);
    } finally {
      setFetchingMovies(false);
    }
  };

  const handleAddMovie = async () => {
    try {
      if (movie.id === undefined) throw new Error('No movie selected.');
      if (movies.find((m) => m.id === movie.id)) throw new Error('Movie already added.');
      movie.watched = false;

    //   const listID = await addMovie(ownerID, movie);

      const updatedMovieList = [...movies, { id: movie.id, ...movie }];


      
      setMovies(updatedMovieList);
      await addMovieToList(listId, movie);
      
      movieTitleTextField.current.value = '';
      setError({ type: 'success', body: `Added movie ${movie.title}` });
      setMovie({});
    } catch (error) {
      setError({ type:'error', body: error.message });
      console.error('Error adding movie:', error);
    }
  };

 

  return (
    <Card sx={{ marginBottom: '1em', marginTop: '1em' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
            {title}
          </Typography>
        </Grid>
      </Grid>
      <Autocomplete
        disabled={disabled}
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
        getOptionLabel={(option) => option.title + ' (' + option.release_date.substring(0, 4) + ')'}
        options={options}
        loading={fetchingMovies}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Movie Title"
            onChange={handleTextFieldChange}
            style={{ marginBottom: '4em', marginTop: '2em', width: '90%' }}
            ref={movieTitleTextField}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {fetchingMovies ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                  <Button variant="contained" onClick={handleAddMovie} disabled={disabled}>
                    Add
                  </Button>
                </React.Fragment>
              ),
            }}
            fullWidth
          />
        )}
      />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}/>
        <Grid item xs={8} sx={{marginBottom:'2em'}}>
          {error.type !== '' ? (
        <Alert severity={error.type}>{error.body}</Alert>
      ) : null}
        </Grid>
        <Grid item xs={2}/>
      </Grid>
    </Card>
  );
};

export default MovieAdd;
