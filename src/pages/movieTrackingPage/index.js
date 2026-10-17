import React, { useState, useEffect, useCallback } from 'react';
import { Box, Chip, Container, IconButton, Paper, Skeleton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MovieListSettings from '../../components/MovieComponents/movieListSettings';
import { AlertContext } from '../../contexts/alertContext';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getMovieListById, deleteMovieFromList, updateMovieInList, deleteTVShowFromList, updateTVShowInList } from '../../api/movieStorage';
import MovieAdd from '../../components/MovieComponents/movieAdd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import TVTable from '../../components/TVComponents/TVTable';
import TVAdd from '../../components/TVComponents/TVAdd';

const ACCESS_LABELS = ['Viewer', 'Contributor', 'Admin', 'Owner'];

const MovieTrackingPage = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [movieList, setMovieList] = useState({});
  const [loading, setLoading] = useState(true);
  const { listId } = useParams();
  const location = useLocation();
  const selectedTab = Math.min(Math.max(parseInt(new URLSearchParams(location.search).get('tab'), 10) || 0, 0), 2);
  const [user, setUser] = useState(null);
  const [accessType, setAccessType] = useState(0);
  const { addAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();

  const refreshMovieList = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getMovieListById(listId);
      setMovies(list.movies || []);
      setTvShows(list.tvShows || []);
      setMovieList(list);
    } catch (error) {
      console.error('Error getting list:', error);
      addAlert('error', 'Could not load this watch list.');
      navigate('/movielist', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [listId, addAlert, navigate]);

  useEffect(() => {
    return onAuthStateChanged(auth, (authUser) => setUser(authUser || null));
  }, []);

  useEffect(() => {
    refreshMovieList();
  }, [refreshMovieList]);

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

  // Optimistic update so toggles respond instantly; roll back if the save fails
  const editMovie = async (movie) => {
    const previous = movies;
    setMovies(previous.map((m) => (m.id === movie.id ? movie : m)));
    try {
      await updateMovieInList(listId, movie.id, movie);
    } catch (error) {
      console.error(error);
      setMovies(previous);
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
    const previous = tvShows;
    setTvShows(previous.map((tv) => (tv.id === tvShow.id ? tvShow : tv)));
    try {
      await updateTVShowInList(listId, tvShow.id, tvShow);
    } catch (error) {
      console.error(error);
      setTvShows(previous);
      addAlert('error', 'Error editing TV show');
    }
  };

  const handleTabChange = (event, newValue) => {
    navigate(`?tab=${newValue}`, { replace: true });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          {loading && !movieList.title ? (
            <Skeleton width={280} height={48} />
          ) : (
            <Typography variant="h3" component="h1" sx={{ wordBreak: 'break-word' }}>{movieList.title}</Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" variant="outlined" label={ACCESS_LABELS[accessType] || 'Viewer'} />
            <Typography variant="body2" color="text.secondary">
              {movies.length} {movies.length === 1 ? 'movie' : 'movies'} · {tvShows.length} {tvShows.length === 1 ? 'show' : 'shows'}
              {movieList.users ? ` · ${movieList.users.length} ${movieList.users.length === 1 ? 'member' : 'members'}` : ''}
            </Typography>
          </Stack>
        </Box>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={refreshMovieList} disabled={loading} aria-label="Refresh list">
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label={`Movies (${movies.length})`} />
        <Tab label={`TV Shows (${tvShows.length})`} />
        <Tab label="Settings" />
      </Tabs>

      {selectedTab === 0 && (
        <Stack spacing={2}>
          <MovieAdd
            listId={listId}
            movies={movies}
            setMovies={setMovies}
            disabled={accessType === 0}
            currentUserID={user ? user.uid : null}
          />
          <MovieTable movies={movies} deleteMovie={removeMovie} editMovie={editMovie} loading={loading} accessType={accessType} />
        </Stack>
      )}

      {selectedTab === 1 && (
        <Stack spacing={2}>
          <TVAdd
            listId={listId}
            tvshows={tvShows}
            setTvShows={setTvShows}
            disabled={accessType === 0}
            currentUserID={user ? user.uid : null}
          />
          <TVTable tvShows={tvShows} deleteTVShow={removeTVShow} editTVShow={editTVShow} loading={loading} accessType={accessType} />
        </Stack>
      )}

      {selectedTab === 2 && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px' }}>
          <MovieListSettings movieList={movieList} setMovieList={setMovieList} />
        </Paper>
      )}
    </Container>
  );
};

export default MovieTrackingPage;
