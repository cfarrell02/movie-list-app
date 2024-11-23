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
  Stack,
  useMediaQuery
} from '@mui/material';
import { getPerson, getPersonMovies, getPersonTV , getPersonImages, getPersonTaggedImages} from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import PersonDetailsCard from '../../components/personComponents/personDetailsCard';
import PersonDetailsSection from '../../components/personComponents/personDetailsSection';
import PersonCreditsSection from '../../components/personComponents/personCreditsSection';
import { AlertContext } from '../../contexts/alertContext';
import { getUserById } from '../../api/userDataStorage';
import { useNavigate } from 'react-router-dom';
import { SiteDataContext } from '../../contexts/siteDataContext';
import MediaDisplay from '../../components/mediaDisplay';

const PersonPage = (props) => {
    const {id} = useParams();
    const [loading , setLoading] = useState(false);
    const [person, setPerson] = useState({});
    const [tmdbId, setTmdbId] = useState(null);
    const {adultContent} = React.useContext(SiteDataContext);
    const navigate = useNavigate();
    const isMobile = useMediaQuery  ('(max-width:600px)');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedPerson = await getPerson(id);
                const fetchedMovieCredits = await getPersonMovies(id);
                const fetchedTVCredits = await getPersonTV(id);
                const fetchedImages = await getPersonImages(id);
                const fetchedTaggedImages = await getPersonTaggedImages(id);
                
                // If the person is adult only and the user has adult content disabled, redirect to home
                if(!adultContent && fetchedPerson.adult){
                    navigate('/');
                }

                const combinedImages = fetchedImages.profiles.concat(fetchedTaggedImages.results);

                setPerson({...fetchedPerson, credits: fetchedMovieCredits, tvCredits: fetchedTVCredits, images : {profiles: combinedImages}});
                setTmdbId(fetchedPerson.id + fetchedPerson.name.replace(/\s/g, '-'));
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        fetchData();
    }, [id, adultContent, navigate]);


    return (
      <Card sx={{ display: 'flex', flexDirection: 'column', padding: '0 2%', margin: '2% 5% 2% 5%'}}>
        {loading ? <CircularProgress align='center'/> : <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: isMobile ? 'center' : 'flex-start' }}>
        <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{person.name}</Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: isMobile ? 'center' : 'flex-end' }}>
          <ButtonGroup sx={{marginBottom: '.5em', marginRight:'1em'}}>
            {person.imdb_id && <Button variant="contained" target="_blank" href={`https://www.imdb.com/name/${person.imdb_id}`} title='IMDB'>IMDB</Button>}
            <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/person/${tmdbId}`} title='TMDB'>TMDB</Button>
          </ButtonGroup>
        </Grid>
        </Grid>
        <Divider/>
        {person.known_for_department ? (
        <Typography variant="subtitle1" color='text.secondary' >{person.known_for_department}</Typography>
        ) : ''}
        <Grid container spacing={ isMobile ? 0 : 2}>
          {isMobile ? (<>
            <Grid item xs={12}>
              <PersonDetailsCard person={person}/>
            </Grid>
            <Grid item xs={12}>
            <PersonDetailsSection person={person}/>
            </Grid>
            </>):<>
          <Grid item xs={9}>
            <PersonDetailsSection person={person}/>
            </Grid>
            <Grid item xs={3}>
              <PersonDetailsCard person={person}/>
            </Grid> 
            </>}
            {person.images && 
        <Grid item xs={12}>
        <Typography variant="h4" sx={{ marginTop: '1em' }}>
                    Media
            </Typography>
        <Divider sx={{ marginBottom: '1em' }} />
        <Container sx={{maxHeight: '45em', overflow: 'auto', margin: '1em 0'}}>
        <MediaDisplay images={person.images.profiles}/>
        </Container>
        </Grid>
        }
            <Grid item xs={12}>
            <Typography variant="h4" sx={{ marginTop: '1em' }}>
                      Credits 
              </Typography>
              <Divider sx={{ marginBottom: '1em' }} />
              <PersonCreditsSection person={person}/>
              </Grid>
            </Grid>

          </>}
      </Card>
    )

}
export default PersonPage;