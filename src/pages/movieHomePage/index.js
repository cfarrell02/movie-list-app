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

const MovieHomePage = () => {
  const [movieLists, setMovieLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMovieList, setSelectedMovieList] = useState(null);
  const navigate = useNavigate();
  const {adultContent, setAdultContent} = useContext(SiteDataContext);
  const [user, setUser] = useState(null);
  const [hiddenContentMessage, setHiddenContentMessage] = useState('');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
        setLoading(true);
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

          if(newMovieLists.length < movieListCount){
            setHiddenContentMessage('Some movie lists contain adult content. Please enable adult content to view all lists.');
          }else{
            setHiddenContentMessage('');
          }

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

  const handleDeleteMovieListSelected = (movieList) => {
    setSelectedMovieList(movieList);
    setDeleteModalOpen(true);
  };

  const handleDeleteMovieList = async () => {
    const id = selectedMovieList;
    try {
      await deleteMovieList(id);
      setMovieLists(movieLists.filter((movieList) => movieList.id !== id));
    } catch (error) {
      console.error('Error deleting movie list:', error);
    }

    setDeleteModalOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', paddingTop: '5%' }}
    >
      <NewMovieListModal title="New Movie List" body="Enter a name for your new movie list." open={modalOpen} onClose={handleNewMovieList} />
      <ConfirmationModal header="Delete Movie List" body="Are you sure you want to delete this movie list?" open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => handleDeleteMovieList()} />
      <Typography variant="h2" align="center" sx={{ mb: 4, color: 'text.primary' }}>
        {user && user.firstName ? `${user.firstName}'s Movie Lists` : 'Movie Lists'}
      </Typography>
      {hiddenContentMessage && <Typography variant="h6" align="center" sx={{ mb: 4, color: 'text.primary' }}>
        <em>
        {hiddenContentMessage}
        </em>
      </Typography>}

      {loading ? (
        <CircularProgress /> // Show loading indicator while fetching data
      ) : (
        <Grid container spacing={2} alignItems="center">
          {movieLists.map((movieList) => (
            <Grid item xs={12} md={4}  key={movieList.id}>
              <MovieListCard movieList={movieList} onDelete={handleDeleteMovieListSelected} />
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
