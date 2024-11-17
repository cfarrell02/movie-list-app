// MovieAdd.js

import React, { useState, useRef, useContext } from 'react';
import {AlertContext} from '../../../contexts/alertContext';
import { Container, Typography, TextField, Button, Card, Grid, Autocomplete, CircularProgress, Alert, Box , useMediaQuery} from '@mui/material';
import { getMovie, getMovieSearchResults } from '../../../api/TMDBAPI';
import { getMovies, addMovieToList, updateMovieInList, deleteMovieFromList} from '../../../api/movieStorage';
import RefreshIcon from '@mui/icons-material/Refresh';


const MovieAdd = ({title, movies, listId, setMovies, disabled, currentUserID, onRefresh}) => {
  const [open, setOpen] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(false);
  const [options, setOptions] = useState([]);
  const { addAlert } = useContext(AlertContext);
  const [searchText, setSearchText] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

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
        addAlert('error', error.message);
        console.error('Error getting movie:', error);
      } finally {
        setFetchingMovies(false);
      }
    }
  };

  const handleTextFieldChange = async (event) => {
    try {
      setFetchingMovies(true);
      setSearchText(event.target.value);
      let data = await getMovieSearchResults(1, searchText);
      if (data) {
        data = data.sort((a, b) => a.popularity - b.popularity).reverse();
        setOptions(data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      addAlert('error', error.message);
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
      movie.addedDate = new Date().toISOString();
      movie.addedBy = currentUserID;

      const updatedMovieList = [...movies, { id: movie.id, ...movie }];

      // setSearchText('');
      // setMovie({});
      
      setMovies(updatedMovieList);
      await addMovieToList(listId, movie);
      

      addAlert('success', `${movie.title} added to list.`);
    } catch (error) {
      addAlert('error', error.message);
      console.error('Error adding movie:', error);
    }
  };

 

  return (
    <Card sx={{ marginBottom: '1em', marginTop: '1em' }}>
      <Grid container spacing={2} alignItems="center" sx={{ padding: '1em' }}>
        {!isMobile && (
          <Grid item xs={2}>
          </Grid>
        )}
        <Grid item xs={isMobile ? 12 : 8}>
          <Typography variant="h5" component="h1" align="center" sx={{ mb: 2 }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={isMobile ? 12 : 2} sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
          <Button variant="contained" onClick={onRefresh} disabled={disabled}>
            <RefreshIcon />
          </Button>
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
        getOptionLabel={(option) => option.title + ' (' + new Date(option.release_date).getFullYear()+ ')'}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="40"
              src={`https://image.tmdb.org/t/p/w200${option.poster_path}`}
              srcSet={`https://image.tmdb.org/t/p/w200${option.poster_path} 2x`}
              alt=""
            />
            {option.title} ({new Date(option.release_date).getFullYear()})
          </Box>
        )}
        options={options}
        loading={fetchingMovies}
        renderInput={(params) => (
          <TextField
            {...params}
            value={searchText}
            label="Movie Title"
            onChange={handleTextFieldChange}
            style={{ marginBottom: isMobile ? '1em' : '4em', marginTop: isMobile ? '.5em' : '2em', width: '90%' }}
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
    </Card>
  );
};

export default MovieAdd;
