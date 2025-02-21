// TVAdd.js

import React, { useState, useRef, useContext } from 'react';
import {AlertContext} from '../../../contexts/alertContext';
import { Container, Typography, TextField, Button, Card, Grid, Autocomplete, CircularProgress, Alert, Box, useMediaQuery } from '@mui/material';
import { getTVShow, getTVShowSearchResults } from '../../../api/TMDBAPI';
import RefreshIcon from '@mui/icons-material/Refresh';
import { addTVShowToList } from '../../../api/movieStorage';


const TVAdd = ({title, tvshows, listId, setTvShows, disabled, currentUserID, onRefresh}) => {
  const [open, setOpen] = useState(false);
  const [fetchingShows, setFetchingShows] = useState(false);
  const [options, setOptions] = useState([]);
  const { addAlert } = useContext(AlertContext);
  const [searchText, setSearchText] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  const [tvshow, setTvShow] = useState({});

  const handleAutocompleteChange = async (event, value) => {
    if (value) {
      try {
        setFetchingShows(true);
        const newShow = await getTVShow(value.id);
        setOptions([]);
        setTvShow(newShow);
        setOpen(false);
      } catch (error) {
        addAlert('error', error.message);
        console.error('Error getting tv show:', error);
      } finally {
        setFetchingShows(false);
      }
    }
  };

  const handleTextFieldChange = async (event) => {
    try {
      setFetchingShows(true);
      setSearchText(event.target.value);
      let data = await getTVShowSearchResults(1, searchText);
      if (data) {
        data = data.sort((a, b) => a.popularity - b.popularity).reverse();
        setOptions(data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      addAlert('error', error.message);
      console.error('Error getting shows:', error);
    } finally {
      setFetchingShows(false);
    }
  };

  const handleAddShow = async () => {
    try {
      if (tvshow.id === undefined) throw new Error('No tv show selected.');
      if (tvshows.find((m) => m.id === tvshow.id)) throw new Error('Tv Show already added.');
      tvshow.watched = 0;
      
    //   const listID = await addMovie(ownerID, tvshow);
      tvshow.addedDate = new Date().toISOString();
      tvshow.addedBy = currentUserID;

      const updatedMovieList = [...tvshows, { id: tvshow.id, ...tvshow }];

      // setSearchText('');
      // setTvShow({});
      
      setTvShows(updatedMovieList);
      await addTVShowToList(listId, tvshow);
      

      addAlert('success', `${tvshow.name} added to list.`);
    } catch (error) {
      addAlert('error', error.message);
      console.error('Error adding tv show:', error);
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
          <Button variant="contained" onClick={onRefresh}>
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
        getOptionLabel={(option) => option.name + ' (' + new Date(option.first_air_date).getFullYear()+ ')'}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="40"
              src={`https://image.tmdb.org/t/p/w200${option.poster_path}`}
              srcSet={`https://image.tmdb.org/t/p/w200${option.poster_path} 2x`}
              alt=""
            />
            {option.name} ({new Date(option.first_air_date).getFullYear()})
          </Box>
        )}
        options={options}
        loading={fetchingShows}
        renderInput={(params) => (
          <TextField
            {...params}
            value={searchText}
            label="TV Show Name"
            onChange={handleTextFieldChange}
            style={{ marginBottom: isMobile ? '1em' : '4em', marginTop: isMobile ? '.5em' : '2em', width: '90%' }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {fetchingShows ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                  <Button variant="contained" onClick={handleAddShow} disabled={disabled}>
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

export default TVAdd;
