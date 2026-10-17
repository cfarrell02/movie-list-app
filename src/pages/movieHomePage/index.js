import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Container, Typography, Button, Card, CardActionArea, Grid, IconButton, Skeleton, Stack, Tooltip } from '@mui/material';
import { getMovieListsByUserId, addMovieList, deleteMovieList } from '../../api/movieStorage';
import AddIcon from '@mui/icons-material/Add';
import MovieListCard from '../../components/MovieComponents/movieListCard';
import NewMovieListModal from '../../components/Modals/newMovieListModal';
import { uid } from 'uid';
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserById } from '../../api/userDataStorage';
import ConfirmationModal from '../../components/Modals/confirmationModal';
import { SiteDataContext } from '../../contexts/siteDataContext';
import RefreshIcon from '@mui/icons-material/Refresh';

const MovieHomePage = () => {
  const [movieLists, setMovieLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalBody, setDeleteModalBody] = useState('');
  const [selectedMovieList, setSelectedMovieList] = useState(null);
  const { adultContent } = useContext(SiteDataContext);
  const [user, setUser] = useState(null);
  const [hiddenContentMessage, setHiddenContentMessage] = useState('');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);

      if (user) {
        getUserById(user.uid).then((userData) => {
          setUser({ ...user, ...userData });
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createdTime = (list) => {
    const created = list.createdOn;
    if (!created) return 0;
    return created.seconds ? created.seconds * 1000 : new Date(created).getTime();
  };

  const loadMovieLists = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allLists = await getMovieListsByUserId(user.uid);
      const visibleLists = adultContent
        ? allLists
        : allLists.filter((list) => (list.movies || []).every((movie) => !movie.adult));
      visibleLists.sort((a, b) => createdTime(a) - createdTime(b));
      setHiddenContentMessage(
        visibleLists.length < allLists.length ? 'Some watch lists are hidden by your adult content setting.' : ''
      );
      setMovieLists(visibleLists);
    } catch (error) {
      console.error('Error getting watch lists:', error);
    } finally {
      setLoading(false);
    }
  }, [user, adultContent]);

  useEffect(() => {
    loadMovieLists();
  }, [loadMovieLists]);

  const handleNewMovieList = async (name) => {
    try {
      const movieList = { title: name, userIds: [user.uid], users: [{accessType: 3, email:user.email, uid:user.uid}]
        , id: uid(), movies: [] , tvShows : [], createdOn : new Date()};
      await addMovieList(movieList);
      setMovieLists((prevMovieLists) => [...prevMovieLists, movieList]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding watch list:', error);
    }
  };

  const handleDeleteMovieListSelected = (movieList) => {
    setSelectedMovieList(movieList);
    //find the ConfirmationModal and set the body to 
    const movieListObject = movieLists.find((m) => m.id === movieList);
    if (movieListObject){
      setDeleteModalBody(`Are you sure you want to delete the watch list "${movieListObject.title}"?`);
    }else{
      setDeleteModalBody('Are you sure you want to delete this watch list?');
    }
    setDeleteModalOpen(true);
  };

  const handleDeleteMovieList = async () => {
    const id = selectedMovieList;
    try {
      await deleteMovieList(id);
      setMovieLists(movieLists.filter((movieList) => movieList.id !== id));
    } catch (error) {
      console.error('Error deleting watch list:', error);
    }

    setDeleteModalOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <NewMovieListModal header="New watch list" body="Give your list a name. You can invite others from its settings." open={modalOpen} onClose={handleNewMovieList} onCancel={() => setModalOpen(false)} />
      <ConfirmationModal header="Delete watch list?" body={deleteModalBody} open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => handleDeleteMovieList()} confirmLabel="Delete" />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1">
            {user && user.firstName ? `${user.firstName}'s Watch Lists` : 'Watch Lists'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {hiddenContentMessage || 'Track movies and shows with friends.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={loadMovieLists} disabled={loading} aria-label="Refresh lists">
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
            New list
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Grid container spacing={3}>
          {[0, 1, 2].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" sx={{ aspectRatio: '16 / 10', height: 'auto' }} />
              <Skeleton width="60%" sx={{ mt: 1.5 }} />
              <Skeleton width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : movieLists.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5">No watch lists yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Create your first list to start tracking what you want to watch.</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>Create a list</Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {movieLists.map((movieList) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movieList.id}>
              <MovieListCard movieList={movieList} onDelete={handleDeleteMovieListSelected} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                minHeight: 220,
                borderStyle: 'dashed',
                borderWidth: 2,
                bgcolor: 'transparent',
              }}
            >
              <CardActionArea
                onClick={() => setModalOpen(true)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1, color: 'text.secondary' }}
              >
                <AddIcon sx={{ fontSize: 40 }} />
                <Typography fontWeight={600}>New list</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default MovieHomePage;
