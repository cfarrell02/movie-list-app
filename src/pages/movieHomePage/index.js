import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, Grid, CardMedia, CircularProgress} from '@mui/material';
import { getMovieListById, getMovieListsByOwnerId, addMovieList, getAllMovieLists, deleteMovieList} from '../../api/movieStorage';
import AddIcon from '@mui/icons-material/Add';
import MovieListCard from '../../components/MovieComponents/movieListCard';
import NewMovieListModal from '../../components/Modals/newMovieListModal';
import { uid } from 'uid';

const MovieHomePage = () => {
  const [movieLists, setMovieLists] = useState([]);
  const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieLists = async () => {
      try {
        setLoading(true);
        const newMovieLists = await getMovieListsByOwnerId('1'); // Replace with the desired owner ID
        console.log(newMovieLists);
        setMovieLists(newMovieLists);
      } catch (error) {
        console.error('Error getting movie lists:', error);
      } finally {
        setLoading(false);
        }
    };
    fetchMovieLists();
  }, []);

  const handleNewMovieList = async (name) => {
    try {
      const movieList = { title: name, movies: [], ownerId: '1', id: uid() };
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
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', paddingTop: '5%' }}>
        <NewMovieListModal title="New Movie List" body="Enter a name for your new movie list." open={modalOpen} onClose={handleNewMovieList}/>
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome!
      </Typography>

      {loading ? (
        <CircularProgress /> // Show loading indicator while fetching data
      ) : (
        <Grid container spacing={2} alignItems="center">
          {movieLists.map((movieList) => (
            <Grid item xs={4}>
              <MovieListCard movieList= {movieList} 
                onDelete={handleDeleteMovieList}
              />
            </Grid>
          ))}
                      <Grid item xs={4}>
            <Link onClick={() => setModalOpen(true)}>
            <Card sx={{ height: '300px', backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
