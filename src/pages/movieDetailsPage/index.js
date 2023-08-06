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
  Divider,
  ButtonGroup
} from '@mui/material';
import { getMovie,getMovieCredits , getMovieSearchResults } from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, addMovieList, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import MovieDetailCard from '../../components/MovieDetailComponents/movieDetailCard';
import MovieDetailSection from '../../components/MovieDetailComponents/movieDetailSection';
import MovieReviewSection from '../../components/MovieDetailComponents/movieReviewsSection';


const MovieDetailsPage = (props) => {
  const {id} = useParams();
  const [movie, setMovie] = useState({});
  const [stremioLinkEnding, setStremioLinkEnding] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMovie = await getMovie(id);
        const fetchedCredits = await getMovieCredits(id);
        setStremioLinkEnding(
          fetchedMovie.title.replace(/[^\w\s]/gi, '').replace(/\s/g, '-').toLowerCase() +
            '-' +
            fetchedMovie.imdb_id.substring(2)
        );
        setMovie({ ...fetchedMovie, credits: fetchedCredits });
      } catch (error) {
        console.error(error);
        // Handle the error, show an error message, or take appropriate action.
      }
    };
  
    fetchData();
  }, []);
  


  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', marginLeft:'10%', marginRight:'10%', marginTop:'2%', padding: '2%'}}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
      <Typography variant="h4" sx={{marginTop: '1em', marginBottom: '.2em'}}>{movie.title} ({new Date(movie.release_date).getFullYear()})</Typography>
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <ButtonGroup sx={{marginBottom: '.5em', marginRight:'1em'}}>
          <Button variant="contained" target="_blank" href={`https://www.imdb.com/title/${movie.imdb_id}`} title='IMDB'>IMDB</Button>
          <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/movie/${movie.id}`} title='TMDB'>TMDB</Button>
          <Button variant="contained" target="_blank" href={`https://www.strem.io/s/movie/${stremioLinkEnding}`} title='Stremio'>Stremio</Button>
        </ButtonGroup>
      </Grid>
      </Grid>
      <Divider/>
      <Typography variant="subtitle1" color='text.secondary' >{movie.tagline}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <MovieDetailSection movie={movie}/>
          </Grid>
          <Grid item xs={3}>
            <MovieDetailCard movie={movie}/>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="h4" sx={{ marginTop: '1em' }}>
                    Reviews 
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <MovieReviewSection movieId={movie.id} />
            </Grid>
          </Grid>
    </Card>
  );
};

export default MovieDetailsPage;
