import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, Grid, CardMedia, CircularProgress } from '@mui/material';
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
  const navigate = useNavigate();
  const {adultContent, setAdultContent} = useContext(SiteDataContext);
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

  useEffect(() => {
    const fetchMovieLists = async () => {
    
      try {
        if (user) {
          let newMovieLists = await getMovieListsByUserId(user.uid); // Replace with the desired owner ID
          let movieListCount = newMovieLists.length;

          if(!adultContent){
            newMovieLists = newMovieLists.filter(list => {
              return list.movies.every(movie => 
                movie.adult === false
              );
            });
          }

          newMovieLists = newMovieLists.sort((a, b) => {
            return new Date(a.createdOn.seconds) - new Date(b.createdOn.seconds);
          });

          if(newMovieLists.length < movieListCount){
            setHiddenContentMessage('Some watch lists have been hidden due to adult content settings.');
          }else{
            setHiddenContentMessage('');
          }

          setMovieLists([...newMovieLists]);
          
        }
      } catch (error) {
        console.error('Error getting watch lists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieLists();
  }, [user]);

  const refreshPage = async () => {
    setLoading(true);
    setMovieLists([]);
    try {
      if (user) {
        let newMovieLists = await getMovieListsByUserId(user.uid); // Replace with the desired owner ID
        setMovieLists([...newMovieLists]);
      }
    } catch (error) {
      console.error('Error getting watch lists:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <Container
      maxWidth="lg"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2em', marginBottom: '2em' }}
    >
      <NewMovieListModal title="New Watch List" body="Enter a name for your new watch list." open={modalOpen} onClose={handleNewMovieList} onCancel={() => setModalOpen(false)} />
      <ConfirmationModal header="Delete Watch List" body={deleteModalBody} open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => handleDeleteMovieList()} />
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, marginBottom: '2em' }}>
      <Typography variant="h2" align="center" sx={{ color: 'text.primary' }}>
        {user && user.firstName ? `${user.firstName}'s Watch Lists` : 'Watch Lists'}
      </Typography>
      <Button 
        variant="contained" 
        onClick={refreshPage} 
        sx={{ display: 'flex', alignItems: 'center', minHeight: '100%' }}
      >
        <RefreshIcon />
      </Button>
    </Container>

      {hiddenContentMessage && <Typography variant="h6" align="center" sx={{ mb: 4, color: 'text.primary' }}>
        <em>
        {hiddenContentMessage}
        </em>
      </Typography>}

      {loading ? (
        <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
          <CircularProgress/>
        </Container>
      ) : (
        <Grid container spacing={2} alignItems="center">
          {movieLists.map((movieList) => (
            <Grid item xs={6} sm={4}   key={movieList.id}>
              <MovieListCard movieList={movieList} onDelete={handleDeleteMovieListSelected} />
            </Grid>
          ))}

        <Grid item xs={6} sm={4}   alignContent="center" alignItems="center" justifyContent="center">
          <Link onClick={() => setModalOpen(true)}>
            <Card
              sx={{
                aspectRatio: '1/1', // Set the aspect ratio to 1:1
                backgroundColor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s', // Add transition for smooth color change
                '&:hover': {
                  backgroundColor: 'primary.dark', // Change to the desired hover color
                },
              }}
            >
              <AddIcon sx={{ fontSize: 100, color: 'white' }} />
            </Card>
          </Link>
        </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default MovieHomePage;
