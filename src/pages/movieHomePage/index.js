import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, Grid, CardMedia, CircularProgress } from '@mui/material';
import { getMovieListsByUserId, addMovieList, deleteMovieList } from '../../api/movieStorage';
import AddIcon from '@mui/icons-material/Add';
import MovieListCard from '../../components/MovieComponents/movieListCard';
import NewMovieListModal from '../../components/Modals/newMovieListModal';
import { uid } from 'uid';
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const MovieHomePage = () => {
  const [movieLists, setMovieLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    const fetchMovieLists = async () => {
    
      try {
        setLoading(true);
        if (user) {
          const newMovieLists = await getMovieListsByUserId(user.uid); // Replace with the desired owner ID
          setMovieLists([...newMovieLists]);
          
        }
      } catch (error) {
        console.error('Error getting movie lists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieLists();
  }, [user]);



  const handleNewMovieList = async (name) => {
    try {
      const movieList = { title: name, userIds: [user.uid], users: [{accessType: 3, email:user.email, uid:user.uid}]
        , id: uid(), movies: [] };
      await addMovieList(movieList);
      setMovieLists((prevMovieLists) => [...prevMovieLists, movieList]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding movie list:', error);
    }
  };

  const handleDeleteMovieList = async (id) => {
    try {
      await deleteMovieList(id);
      setMovieLists(movieLists.filter((movieList) => movieList.id !== id));
    } catch (error) {
      console.error('Error deleting movie list:', error);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', paddingTop: '5%' }}
    >
      <NewMovieListModal title="New Movie List" body="Enter a name for your new movie list." open={modalOpen} onClose={handleNewMovieList} />
      <Typography variant="h2" align="center" sx={{ mb: 4, color: 'text.primary' }}>
        Welcome!
      </Typography>

      {loading ? (
        <CircularProgress /> // Show loading indicator while fetching data
      ) : (
        <Grid container spacing={2} alignItems="center">
          {movieLists.map((movieList) => (
            <Grid item xs={12} md={4}  key={movieList.id}>
              <MovieListCard movieList={movieList} onDelete={handleDeleteMovieList} />
            </Grid>
          ))}

        <Grid item xs={12} md={4} alignContent="center" alignItems="center" justifyContent="center">
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
