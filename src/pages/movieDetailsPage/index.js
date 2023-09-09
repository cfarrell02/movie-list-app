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
  Select,
  MenuItem,
  Card,
  FormControl,
  Divider,
  ButtonGroup,
  InputLabel,
  Stack
} from '@mui/material';
import { getMovie,getMovieCredits , getMovieSearchResults } from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import MovieDetailCard from '../../components/MovieDetailComponents/movieDetailCard';
import MovieDetailSection from '../../components/MovieDetailComponents/movieDetailSection';
import MovieReviewSection from '../../components/MovieDetailComponents/movieReviewsSection';
import { AlertContext } from '../../contexts/alertContext';
import { getUserById } from '../../api/userDataStorage';


const MovieDetailsPage = (props) => {
  const {id} = useParams();
  const [movie, setMovie] = useState({});
  const [stremioLinkEnding, setStremioLinkEnding] = useState('');
  const [movieLists, setMovieLists] = useState([]);
  const {addAlert} = React.useContext(AlertContext);  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      finally{
        setLoading(false);
      }

    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
    if(user){
      const fetchedMovieLists = await getMovieListsByUserId(user.uid);
      setMovieLists(fetchedMovieLists.filter(list => {
        return list.users.find(userObj => userObj.uid === user.uid).accessType > 0
      }));
      }
    };
    fetchData();
  }, [user]);

  const handleChange = async (event) => {
    const userData = await getUserById(user.uid);
    try{
      movie.addedDate = new Date().toISOString();
      movie.addedBy = user.uid;
      const movieList = await getMovieListById(event.target.value);
      if(movieList.movies.find(m => m.id === movie.id)) throw new Error('Movie already in list');
      addMovieToList(event.target.value, movie);
      addAlert('success', `${movie.title} added to ${movieList.title}`);
    }
    catch(error){
      addAlert('error', error.message);
    }
  };
  


  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', marginLeft:'10%', marginRight:'10%', marginTop:'2%', padding: '2%'}}>
      {loading ? <CircularProgress align='center'/> : <>
      <Grid container spacing={2}>
        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'flex-end'}}>
      <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{movie.title} ({new Date(movie.release_date).getFullYear()})</Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <Stack> 
        <FormControl sx={{ m: 1, minWidth: 80 }} size='small'>
        <InputLabel> Add to list</InputLabel>
        <Select
        autoWidth
        sx={{marginRight:'1em'}}
        onChange={handleChange}
        label="Add to list"
        title= 'Select a list to add this movie to'
        >
          {movieLists.map((list) => (
          <MenuItem value={list.id}>{list.title}</MenuItem>
          ))}
        </Select>
        </FormControl>
        <ButtonGroup sx={{marginBottom: '.5em', marginRight:'1em'}}>
          <Button variant="contained" target="_blank" href={`https://www.imdb.com/title/${movie.imdb_id}`} title='IMDB'>IMDB</Button>
          <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/movie/${movie.id}`} title='TMDB'>TMDB</Button>
          <Button variant="contained" target="_blank" href={`https://www.strem.io/s/movie/${stremioLinkEnding}`} title='Stremio'>Stremio</Button>
        </ButtonGroup>
        </Stack>
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
        </>}
    </Card>
  );
};

export default MovieDetailsPage;
