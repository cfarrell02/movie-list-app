// MovieAdd.js

import React, { useState, useRef } from 'react';
import { Container, Typography, TextField, Button, Card, Grid, Autocomplete, CircularProgress } from '@mui/material';
import { getMovie, getMovieSearchResults } from '../../../api/TMDBAPI';
import { getMovies, addMovieToList, updateMovieInList, deleteMovieFromList} from '../../../api/movieStorage';
import MovieTable from '../movieTable';
import ErrorModal from '../../Modals/errorModal';

const MovieAdd = ({ title, movies, setMovies, setChangesToBeMade, changesToBeMade}) => {
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(false);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState({ header: '', body: '' });
  const movieTitleTextField = useRef(null);

  const ownerID = '1'; // Replace with the desired owner ID
  const [movie, setMovie] = useState({});

  const handleAutocompleteChange = async (event, value) => {
    if (value) {
      try {
        setFetchingMovies(true);
        const newMovie = await getMovie(value.id);
        setOptions([]);
        setMovie(newMovie);
        setOpen(false);
      } catch (error) {
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
    const listID = 1;
      const updatedMovieList = [...movies, { id: movie.id, ...movie }];

      setChangesToBeMade([...changesToBeMade, { action: 'add', movie }]);
      setMovies(updatedMovieList);
      setMovie({});
      movieTitleTextField.current.value = '';
    } catch (error) {
      setError({ header: 'Error adding movie', body: error.message });
      console.error('Error adding movie:', error);
    }
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      changesToBeMade.forEach(async (change) => {
        if (change.action === 'add') {
          await addMovieToList(ownerID, change.movie);
        } else if (change.action === 'delete') {
          await deleteMovieFromList(ownerID, change.movie.id);
        } else if (change.action === 'edit') {
          await updateMovieInList(ownerID, change.movie.id, change.movie);
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
    <Card sx={{ marginBottom: '1em', marginTop: '1em' }}>
      <ErrorModal header={error.header} body={error.body} open={error.header !== ''} onClose={() => setError({ header: '', body: '' })} />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
            {title}
          </Typography>
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
            style={{ marginBottom: '4em', marginTop: '2em', width: '90%' }}
            ref={movieTitleTextField}
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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sx={{ padding: '2em' }}>
          {submitting ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <Button variant="contained" size="medium" color="primary" onClick={onSubmit} disabled={changesToBeMade.length === 0}>
              Submit Changes
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default MovieAdd;
