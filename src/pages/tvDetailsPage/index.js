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
  Stack,
  useMediaQuery
} from '@mui/material';
import { getTVShow,getTVCredits , getTVImages,getTVVideos, getTVRecommendations } from '../../api/TMDBAPI';
import { getMovieListById, addTVShowToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import TVDetailCard from '../../components/TVDetailComponents/tvDetailCard';
import TVDetailSection from '../../components/TVDetailComponents/tvDetailSection';
import TVReviewSection from '../../components/TVDetailComponents/tvReviewsSection';
import { AlertContext } from '../../contexts/alertContext';
import { getUserById } from '../../api/userDataStorage';
import MediaDisplay from '../../components/mediaDisplay';
import TVCard from '../../components/TVComponents/TVCard';
import ShowMoreWrapper from '../../components/showMoreWrapper';


const TVDetailsPage = (props) => {
  const {id} = useParams();
  const [tvShow, setMovie] = useState({});
  const [stremioLinkEnding, setStremioLinkEnding] = useState('');
  const [movieLists, setMovieLists] = useState([]);
  const {addAlert} = React.useContext(AlertContext);  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formattedTitle, setFormattedTitle] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const [wrapperCount, setWrapperCount] = useState(getInitialCount());

  function getInitialCount() {
      const width = window.innerWidth;
      if (width < 900) return 4;    
      if (width < 1200) return 6 
      return 6;                    
  }

  useEffect(() => {
      const handleResize = () => setWrapperCount(getInitialCount());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const fetchedImages = await getTVImages(id);
        const fetchedVideos = await getTVVideos(id);
        const recommendations = await getTVRecommendations(id);
        if(fetchedMovie.imdb_id){
          setStremioLinkEnding(
            fetchedMovie.title.replace(/[^\w\s]/gi, '').replace(/\s/g, '-').toLowerCase() +
              '-' +
              fetchedMovie.imdb_id.substring(2)
          );
        }

        const tvShow = {...fetchedMovie, credits: fetchedCredits, images: fetchedImages, videos: fetchedVideos, recommendations: recommendations};
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
    if(!tvShow) return;
    const name = tvShow.name ? tvShow.name.length > 30 ? tvShow.name.substring(0, 30) + '...' : tvShow.name : '';
    let year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : '';
    let endYear = tvShow.last_air_date ? new Date(tvShow.last_air_date).getFullYear() : '';

    let shouldShowEndYear = endYear !== year;

    if(tvShow.in_production){
      shouldShowEndYear = true;
      endYear = 'Present';
    }
    
    setFormattedTitle(`${name} (${year}${shouldShowEndYear ? ` - ${endYear}` : ''})`);
  }, [tvShow]);

  const handleChange = async (event) => {
    const userData = await getUserById(user.uid);
    try{
      tvShow.addedDate = new Date().toISOString();
      tvShow.addedBy = user.uid;
      tvShow.watched = 0;
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
    <Card sx={{ display: 'flex', flexDirection: 'column', padding: '0 2%', margin: '2% 5% 2% 5%'}}>
      {loading ?
      <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
        <CircularProgress/>
      </Container>
      :<>
      <Grid container spacing={2} >
      <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', justifyContent: isMobile ? 'center' : 'flex-start'}} >
      <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{formattedTitle}</Typography>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: isMobile ? 'center' : 'flex-end'}}>
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
          {tvShow.id && <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/tv/${tvShow.id}`} title='TMDB'>TMDB</Button>}
          {stremioLinkEnding && <Button variant="contained" target="_blank" href={`https://www.strem.io/s/tvShow/${stremioLinkEnding}`} title='Stremio'>Stremio</Button>}
        </ButtonGroup>
        </Stack>
      </Grid>
      </Grid>
      <Divider/>
      {tvShow.tagline && <Typography variant="subtitle1" color='text.secondary' >{tvShow.tagline}</Typography>}
      <Grid container spacing={ isMobile ? 0 : 2}>
        {isMobile ? (<>
          <Grid item xs={12}>
            <TVDetailCard tvShow={tvShow}/>
          </Grid>
          <Grid item xs={12}>
          <TVDetailSection tvShow={tvShow}/>
          </Grid>
          </>):<>
        <Grid item xs={9}>
          <TVDetailSection tvShow={tvShow}/>
          </Grid>
          <Grid item xs={3}>
            <TVDetailCard tvShow={tvShow}/>
          </Grid>
          </>}

          {tvShow.recommendations && tvShow.recommendations.length > 0 && (
  <Grid item xs={12}>
    <Typography variant="h4" sx={{ marginTop: '1em'}}>
      Recommendations
    </Typography>
    <Divider sx={{ marginBottom: '1em' }} />
    <ShowMoreWrapper initialCount={wrapperCount} parentComponent={Grid} parentComponentProps={{ container: true, spacing: 2 }}>
        {tvShow.recommendations.map((movie, index) => (
          <Grid item xs={6} sm={3} md={2} key={index}>
            <TVCard tv={movie}/>
          </Grid>
        ))}
    </ShowMoreWrapper>
  </Grid>
)}
        {tvShow.images && tvShow.videos &&
        <Grid item xs={12}>
        <Typography variant="h4" sx={{ marginTop: '1em' }}>
                    Media
            </Typography>
        <Divider sx={{ marginBottom: '1em' }} />
        <MediaDisplay videos={tvShow.videos.results} images={tvShow.images.backdrops}/>
        </Grid>
        }
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
