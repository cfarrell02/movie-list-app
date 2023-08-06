import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid} from '@mui/material';
import { getMovies } from '../../api/TMDBAPI';
import MovieCard from '../../components/MovieComponents/movieCard';

const Homepage = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const fetchedMovies = await getMovies(1);
                setMovies(fetchedMovies.results);
            } catch (error) {
                console.error('Error getting movies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);
    console.log(movies);

  return (
    <Container  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5%' }}>
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Browse Movies
      </Typography>
      {loading ? ( 
        <Typography variant="h5" component="h2" align="center" >
          Loading...
        </Typography>
      ) : (
        <Grid container spacing={2}>
        {movies.map((movie) => (
        <Grid item xs={4}>
        <MovieCard  movie={movie} />
        </Grid>
      ))}</Grid>
      )}
      
      <Button variant="contained" size="large" color="primary" onClick={() => navigate('/movielist')}>
        Get Started
      </Button>
    </Container>
  );
};

export default Homepage;
