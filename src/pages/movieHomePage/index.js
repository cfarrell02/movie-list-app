import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, Grid, CardMedia, CircularProgress } from '@mui/material';
import { getMovieListById, getMovieListsByOwnerId } from '../../api/movieStorage';
import MovieListCard from '../../components/MovieComponents/movieListCard';

const MovieHomePage = () => {
  const [movieLists, setMovieLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieLists = async () => {
      try {
        setLoading(true);
        const newMovieLists = await getMovieListsByOwnerId('1'); // Replace with the desired owner ID
        setMovieLists(newMovieLists);
      } catch (error) {
        console.error('Error getting movie lists:', error);
      } finally {
        setLoading(false);
        }
    };
    fetchMovieLists();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', paddingTop: '5%' }}>
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome!
      </Typography>

      {loading ? (
        <CircularProgress /> // Show loading indicator while fetching data
      ) : (
        <Grid container spacing={2} alignItems="center">
          {movieLists.map((movieList) => (
            <Grid item xs={4}>
              <MovieListCard movieList= {movieList} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MovieHomePage;
