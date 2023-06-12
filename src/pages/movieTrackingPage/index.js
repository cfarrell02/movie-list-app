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
import { getMovie, getMovieSearchResults } from '../../api/TMDBAPI';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getMovieListById, addMovieToList, addMovieList, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import MovieAdd from '../../components/MovieComponents/movieAdd';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const MovieTrackingPage = (props) => {
  const [movies, setMovies] = useState([]);
  const [movieList, setMovieList] = useState({});
  const [loading, setLoading] = useState(false);
  const { listId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [user, setUser] = useState(null);
  const [accessType, setAccessType] = useState(0);
  const [error, setError] = useState({ type: '', body: '' });

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
      setAccessType(movieList.users.find((u) => u.uid === user.uid).accessType);
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
    setError({type: 'info', body: `${movie.title} removed`});
    }catch(error){
      console.error(error);
      setError({type: 'error', body: 'Error removing movie'});
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
      setError({type: 'success', body: `${movie.title} edited`});
    }
    }catch(error){
      console.error(error);
      setError({type: 'error', body: 'Error editing movie'});
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }} align="center">
        <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{marginBottom:'2em'}}>
          <Tab label="Movies" />
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
  error = {error}
  setError = {setError}
/>

          <MovieTable
          movies={movies}
          deleteMovie={removeMovie}
          editMovie={editMovie}
          loading={loading}
          accessType={accessType}
        />
        </>
        )}
        {selectedTab === 1 && (
          // Content for the second tab
          <MovieListSettings
            movieList={movieList}
          />
        )}

      </Paper>
    </Container>
  );
};

export default MovieTrackingPage;
