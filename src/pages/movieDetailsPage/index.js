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
  useMediaQuery,
  Stack,
  Box
} from '@mui/material';
import { getMovie,getMovieCredits , getMovieImages, getMovieVideos, getSimilarMovies } from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import MovieDetailCard from '../../components/MovieDetailComponents/movieDetailCard';
import MovieDetailSection from '../../components/MovieDetailComponents/movieDetailSection';
import MovieReviewSection from '../../components/MovieDetailComponents/movieReviewsSection';
import { AlertContext } from '../../contexts/alertContext';
import { getUserById } from '../../api/userDataStorage';
import { SiteDataContext } from '../../contexts/siteDataContext';
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import MediaDisplay from '../../components/mediaDisplay';
import MovieCard from '../../components/MovieComponents/movieCard';
import ShowMoreWrapper from '../../components/showMoreWrapper';


const MovieDetailsPage = (props) => {
  const {id} = useParams();
  const [movie, setMovie] = useState({});
  const [stremioLinkEnding, setStremioLinkEnding] = useState('');
  const [movieLists, setMovieLists] = useState([]);
  const {addAlert} = React.useContext(AlertContext);  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formattedTitle, setFormattedTitle] = useState('');
  const {adultContent} = React.useContext(SiteDataContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

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
        const fetchedImages = await getMovieImages(id);
        const fetchedVideos = await getMovieVideos(id);
        const similarMovies = await getSimilarMovies(id);

        if(fetchedMovie.imdb_id){
          setStremioLinkEnding(
            fetchedMovie.title.replace(/[^\w\s]/gi, '').replace(/\s/g, '-').toLowerCase() +
              '-' +
              fetchedMovie.imdb_id.substring(2)
          );
        }

        const localMovie = { ...fetchedMovie, credits: fetchedCredits , images: fetchedImages, videos: fetchedVideos, similar: similarMovies};

        if(!adultContent && localMovie.adult){
          navigate('/')
        }

        setMovie(localMovie);
        console.log(movie);
      } catch (error) {
        console.error(error);
        // Handle the error, show an error message, or take appropriate action.
      }
      finally{
        setLoading(false);
      }

    };

  
    fetchData();
  }, [id]);

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

  useEffect(() => {
    if(!movie) return;
    const title = movie.title ? movie.title.length > 50 ? movie.title.substring(0, 50) + '...' : movie.title : '';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    setFormattedTitle('' + title + (year ? ' (' + year + ')' : ''));
  }, [movie]);

  const handleChange = async (event) => {
    const userData = await getUserById(user.uid);
    try{
      movie.addedDate = new Date().toISOString();
      movie.addedBy = user.uid;
      const movieList = await getMovieListById(event.target.value);
      if(movieList.movies.find(m => m.id === movie.id)) throw new Error('Movie already in list');
      try{
        await addMovieToList(event.target.value, movie);
      }catch(error){
        addAlert('error', error.message);
      }finally{
        addAlert('success', `${movie.title} added to ${movieList.title}`);
      }
    }
    catch(error){
      addAlert('error', error.message);
    }
  };
  

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', padding: '0 2%', margin: '2% 5% 2% 5%', alignContent: 'center'}}>
      {loading ? <CircularProgress align='center'/> : <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', justifyContent: isMobile ? 'center' : 'flex-start'}} >
      <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{formattedTitle}</Typography>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: isMobile ? 'center' : 'flex-end' }}>
        <Stack> 
        <FormControl sx={{ m: 1, minWidth: '15em' }} size='small'>
        <InputLabel> Add to list</InputLabel>
        <Select
        autoWidth
        onChange={handleChange}
        label="Add to list"
        title= 'Select a list to add this movie to'
        >
          {movieLists.map((list) => (
          <MenuItem value={list.id}>{list.title}</MenuItem>
          ))}
        </Select>
        </FormControl>
        <ButtonGroup sx={{marginBottom: '.5em', marginRight:'auto',marginLeft:'auto'}}>
          {movie.imdb_id && <Button variant="contained" target="_blank" href={`https://www.imdb.com/title/${movie.imdb_id}`} title='IMDB'>IMDB</Button>}
          {movie.id && <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/movie/${movie.id}`} title='TMDB'>TMDB</Button>}
          {stremioLinkEnding && <Button variant="contained" target="_blank" href={`https://www.strem.io/s/movie/${stremioLinkEnding}`} title='Stremio'>Stremio</Button>}
        </ButtonGroup>
        </Stack>
      </Grid>
      </Grid>
      <Divider/>
      {movie.tagline && <Typography variant="subtitle1" color='text.secondary' >{movie.tagline}</Typography>}
      <Grid container spacing={ isMobile ? 0 : 2}>
        {isMobile ? (<>
          <Grid item xs={12}>
            <MovieDetailCard movie={movie}/>
          </Grid>
          <Grid item xs={12}>
          <MovieDetailSection movie={movie}/>
          </Grid>

        </>) : (<>
        <Grid item xs={9}>
          <MovieDetailSection movie={movie}/>
          </Grid>
          <Grid item xs={3}>
            <MovieDetailCard movie={movie}/>
          </Grid>
        </>)}

{movie.similar && movie.similar.length > 0 && (
  <Grid item xs={12}>
    <Typography variant="h4" sx={{ marginTop: '1em'}}>
      Similar Movies
    </Typography>
    <Divider sx={{ marginBottom: '1em' }} />
    <ShowMoreWrapper initialHeight={350}>
      <Grid 
        container 
        spacing={2} 
      >
        {movie.similar.map((movie, index) => (
          <Grid item xs={6} sm={3} md={2} key={index}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </ShowMoreWrapper>
  </Grid>
)}


        {movie.images && movie.videos &&
        <Grid item xs={12}>
        <Typography variant="h4" sx={{ marginTop: '1em' }}>
                    Media
            </Typography>
        <Divider sx={{ marginBottom: '1em' }} />
        <MediaDisplay videos={movie.videos.results} images={movie.images.backdrops}/>
        </Grid>
        }

        
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
