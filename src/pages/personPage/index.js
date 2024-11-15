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
import { getPerson, getPersonMovies, getPersonTV } from '../../api/TMDBAPI';
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

const PersonPage = (props) => {
    const {id} = useParams();
    const [loading , setLoading] = useState(false);
    const [person, setPerson] = useState({});
    const [tmdbId, setTmdbId] = useState(null);
    const {adultContent} = React.useContext(SiteDataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedPerson = await getPerson(id);
                const fetchedMovieCredits = await getPersonMovies(id);
                const fetchedTVCredits = await getPersonTV(id);
                
                if(!adultContent && fetchedPerson.adult){
                    navigate('/');
                }

                setPerson({...fetchedPerson, credits: fetchedMovieCredits, tvCredits: fetchedTVCredits});
                setTmdbId(fetchedPerson.id + fetchedPerson.name.replace(/\s/g, '-'));
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);


    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', marginLeft:'10%', marginRight:'10%', marginTop:'2%', padding: '2%'}}>
        {loading ? <CircularProgress align='center'/> : <>
        <Grid container spacing={2}>
          <Grid item xs={8} sx={{ display: 'flex', alignItems: 'flex-end'}}>
        <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{person.name}</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
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
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <PersonDetailsSection person={person}/>
            </Grid>
            <Grid item xs={3}>
              <PersonDetailsCard person={person}/>
            </Grid>
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