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
import { getTVShow,getTVCredits , getMovieSearchResults } from '../../api/TMDBAPI';
import { getMovieListById, addTVShowToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import TVDetailCard from '../../components/TVDetailComponents/tvDetailCard';
import TVDetailSection from '../../components/TVDetailComponents/tvDetailSection';
import TVReviewSection from '../../components/TVDetailComponents/tvReviewsSection';
import { AlertContext } from '../../contexts/alertContext';
import { getUserById } from '../../api/userDataStorage';


const TVDetailsPage = (props) => {
  const {id} = useParams();
  const [tvShow, setMovie] = useState({});
  const [stremioLinkEnding, setStremioLinkEnding] = useState('');
  const [movieLists, setMovieLists] = useState([]);
  const {addAlert} = React.useContext(AlertContext);  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formattedTitle, setFormattedTitle] = useState('');

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
        const fetchedMovie = await getTVShow(id);
        const fetchedCredits = await getTVCredits(id);
        if(fetchedMovie.imdb_id){
          setStremioLinkEnding(
            fetchedMovie.title.replace(/[^\w\s]/gi, '').replace(/\s/g, '-').toLowerCase() +
              '-' +
              fetchedMovie.imdb_id.substring(2)
          );
        }

        const tvShow = {...fetchedMovie, credits: fetchedCredits};
        setMovie(tvShow);
        console.log(tvShow);
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

  useEffect(() => {
    if(!tvShow) return;
    const name = tvShow.name ? tvShow.name.length > 30 ? tvShow.name.substring(0, 30) + '...' : tvShow.name : '';
    const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : '';
    const endYear = tvShow.last_air_date ? new Date(tvShow.last_air_date).getFullYear() : '';
    const yearString = '(' + (year ? year : '') + (endYear && year !== endYear ? ' - ' + endYear : '') + ')';
    setFormattedTitle(`${name} ${yearString}`);
  }, [tvShow]);

  const handleChange = async (event) => {
    const userData = await getUserById(user.uid);
    try{
      tvShow.addedDate = new Date().toISOString();
      tvShow.addedBy = user.uid;
      const movieList = await getMovieListById(event.target.value);
      if(movieList.tvShows.find(m => m.id === tvShow.id)) throw new Error('tvShow already in list');
      try{
        await addTVShowToList(event.target.value, tvShow);
      }catch(error){
        addAlert('error', error.message);
      }finally{
        addAlert('success', `${tvShow.name} added to ${movieList.title}`);
      }
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
      <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{formattedTitle}</Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <Stack> 
        <FormControl sx={{ m: 1, minWidth: '15em' }} size='small'>
        <InputLabel> Add to list</InputLabel>
        <Select
        autoWidth
        onChange={handleChange}
        label="Add to list"
        title= 'Select a list to add this tvShow to'
        >
          {movieLists.map((list) => (
          <MenuItem value={list.id}>{list.title}</MenuItem>
          ))}
        </Select>
        </FormControl>
        <ButtonGroup sx={{marginBottom: '.5em', marginRight:'auto',marginLeft:'auto'}}>
          {tvShow.imdb_id && <Button variant="contained" target="_blank" href={`https://www.imdb.com/title/${tvShow.imdb_id}`} title='IMDB'>IMDB</Button>}
          {tvShow.id && <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/tvShow/${tvShow.id}`} title='TMDB'>TMDB</Button>}
          {stremioLinkEnding && <Button variant="contained" target="_blank" href={`https://www.strem.io/s/tvShow/${stremioLinkEnding}`} title='Stremio'>Stremio</Button>}
        </ButtonGroup>
        </Stack>
      </Grid>
      </Grid>
      <Divider/>
      {tvShow.tagline && <Typography variant="subtitle1" color='text.secondary' >{tvShow.tagline}</Typography>}
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TVDetailSection tvShow={tvShow}/>
          </Grid>
          <Grid item xs={3}>
            <TVDetailCard tvShow={tvShow}/>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="h4" sx={{ marginTop: '1em' }}>
                    Reviews 
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <TVReviewSection tvId={tvShow.id} />
            </Grid>
          </Grid>
        </>}
    </Card>
  );
};

export default TVDetailsPage;