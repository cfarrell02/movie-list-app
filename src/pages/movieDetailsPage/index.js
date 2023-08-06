import React, { useState, useEffect, useMemo} from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  CircularProgress,
  Tab,
  Tabs,
  Card,
  Divider
} from '@mui/material';
import { getMovie,getMovieCredits , getMovieSearchResults } from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, addMovieList, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import MovieDetailCard from '../../components/MovieDetailComponents/movieDetailCard';
import MovieDetailSection from '../../components/MovieDetailComponents/movieDetailSection';

const MovieDetailsPage = (props) => {
  const {id} = useParams();
  const [movie, setMovie] = useState({});

  useEffect(async () => {
    try{
    const fetchedMovie = await getMovie(id);
    const fetchedCredits = await getMovieCredits(id);
    setMovie({...fetchedMovie, credits: fetchedCredits});
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleButton = () => {
    console.log(movie);
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', marginLeft:'10%', marginRight:'10%', marginTop:'2%', padding: '2%'}}>
      <Typography variant="h4" sx={{marginTop: '1em', marginBottom: '.2em'}}>{movie.title}</Typography>
      <Divider sx={{marginBottom: '1em'}}/>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <MovieDetailSection/>
          </Grid>
          <Grid item xs={3}>
            <MovieDetailCard movie={movie}/>
          </Grid>
          </Grid>
    </Card>
  );
};

export default MovieDetailsPage;
