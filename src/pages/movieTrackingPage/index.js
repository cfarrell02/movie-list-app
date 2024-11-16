import React, { useState, useEffect, useMemo } from 'react';
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
  Tabs
} from '@mui/material';
import MovieListSettings from '../../components/MovieComponents/movieListSettings';
import { AlertContext } from '../../contexts/alertContext';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getMovieListById, addMovieToList, addMovieList, deleteMovieFromList, updateMovieInList, deleteTVShowFromList, updateTVShowInList} from '../../api/movieStorage';
import MovieAdd from '../../components/MovieComponents/movieAdd';
import { useParams , useNavigate} from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { CheckBox } from '@mui/icons-material';
import TVTable from '../../components/TVComponents/TVTable';
import TVAdd from '../../components/TVComponents/TVAdd';

const MovieTrackingPage = (props) => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [movieList, setMovieList] = useState({});
  const [loading, setLoading] = useState(false);
  const { listId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [user, setUser] = useState(null);
  const [accessType, setAccessType] = useState(0);
  const {addAlert} = React.useContext(AlertContext);
  const navigate = useNavigate();

  const refreshMovieList = async () => {
    setLoading(true);
    const movies = await getMovieListById(listId);
    setMovies(movies.movies);
    setTvShows(movies.tvShows);
    setMovieList(movies);
    setLoading(false);
  }

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

  const cachedMovies = useMemo(() => {
    
    return getMovieListById(listId);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await cachedMovies;
        setMovies(movies.movies);
        setTvShows(movies.tvShows);
        setMovieList(movies);
      } catch (error) {
        console.error('Error getting movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [cachedMovies]);

  useEffect(() => {
    try{
    if( user && movieList.users){
      const userObj = movieList.users.find((userObj) => userObj.uid === user.uid);
      if(userObj){ setAccessType(userObj.accessType);
      }else{
        navigate('/home');
      }
    }
    }catch(error){
      console.error(error);
    }
  }, [user, movieList.users]);

  const removeMovie = async (movie) => {
    try{
    const newMovies = movies.filter((m) => m.id !== movie.id);
    await deleteMovieFromList(listId, movie.id);
    setMovies(newMovies);
    addAlert('info', `${movie.title} removed successfully`)
    }catch(error){
      console.error(error);
      addAlert('error', 'Error removing movie');
    }
  };

  const editMovie = async (movie) => {
    try{
    const editedMovieIndex = movies.findIndex((m) => m.id === movie.id);
    if (editedMovieIndex !== -1) {
      let newMovies = [...movies];
      newMovies[editedMovieIndex] = movie;
      await updateMovieInList(listId, movie.id, movie);
      setMovies(newMovies);
      addAlert('success', `${movie.title} edited successfully`)
    }
    }catch(error){
      console.error(error);
      addAlert('error', 'Error editing movie');
    }
  };
  const removeTVShow = async (tvShow) => {
    try {
      const newTvShows = tvShows.filter((tv) => tv.id !== tvShow.id);
      await deleteTVShowFromList(listId, tvShow.id); 
      setTvShows(newTvShows);
      addAlert('info', `${tvShow.name} removed successfully`);
    } catch (error) {
      console.error(error);
      addAlert('error', 'Error removing TV show');
    }
  };

  const editTVShow = async (tvShow) => {
    try {
      const editedTVShowIndex = tvShows.findIndex((tv) => tv.id === tvShow.id);
      if (editedTVShowIndex !== -1) {
        let newTvShows = [...tvShows];
        newTvShows[editedTVShowIndex] = tvShow;
        await updateTVShowInList(listId, tvShow.id, tvShow); 
        setTvShows(newTvShows);
        addAlert('success', `${tvShow.name} edited successfully`);
      }
    } catch (error) {
      console.error(error);
      addAlert('error', 'Error editing TV show');
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 , minHeight: '100vh'}}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }} align="center">
        <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{marginBottom:'2em'}}>
          <Tab label="Movies" />
          <Tab label="TV Shows" />
          <Tab label="Settings" />
        </Tabs>
        {selectedTab === 0 && (
          <>
          <MovieAdd
          title={movieList.title}
          listId={listId}
          movies={movies}
          setMovies={setMovies}
          disabled={accessType === 0} 
          currentUserID = {user ? user.uid : null}
          onRefresh={refreshMovieList}
          />

          {movies.length === 0 && !loading ? (

            <Typography variant="h6" sx={{ mt: 2 }}>
              No movies found, add some!
            </Typography>

          ):(

          <MovieTable
          movies={movies}
          deleteMovie={removeMovie}
          editMovie={editMovie}
          loading={loading}
          accessType={accessType}
        />
          )}

        </>
        )}


        {selectedTab === 1 && (
            <>
            <TVAdd
            title={movieList.title}
            listId={listId}
            tvshows={tvShows}
            setTvShows={setTvShows}
            disabled={accessType === 0}
            currentUserID = {user ? user.uid : null}
            onRefresh={refreshMovieList}
            />
            {tvShows.length === 0 && !loading ? (

          <Typography variant="h6" sx={{ mt: 2 }}>
            No tv shows found, add some!
          </Typography>

          ):(

          <TVTable
          tvShows={tvShows}
          deleteTVShow={removeTVShow}
          editTVShow={editTVShow}
          loading={loading}
          accessType={accessType}
          />
          )}
          
          </>)
        }

        
        {selectedTab === 2 && (
          // Content for the third tab
          <MovieListSettings
            movieList={movieList}
            setMovieList={setMovieList}
          />
        )}

      </Paper>
    </Container>
  );
};

export default MovieTrackingPage;
